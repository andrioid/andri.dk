---
path: "/blog/2020/devops/app-stack-with-terraform-on-gcp"
date: "2020-05-31T00:00:00.000Z"
title: "Deploying a Full-Stack app on Google with Terraform"
tags: ["hosting", "cloud"]
draft: true
---

In this post, we are going to setup continuous deployment on Github Actions that will deploy a full environment in the cloud. Then we will setup a scheduled action to tear it all down, if we're not using it.

> Note: While this is perfectly fine for development-environments, you should probably NOT do this in production.

## Motivation

I didn't like paying for hosting on projects that I rarely have time to work on. So, I figured that if I could describe my environment decleratively, then I could just create automatically when I need it, and delete it automatically when I don't.

## Before we begin

You will need a few things before we get started.

- A Google Cloud account
- A Google Cloud project
- Terraform installed
- A [service-account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) with a JSON key file.
- The following roles on your service-account: Cloud Build Service Account, Cloud Build Editor, Cloud SQL Admin, Editor, Service Account User, Cloud, Run Admin, Storage Admin

When you have the JSON key file, you can add it to an environmental variable while you work with Terraform. If you forget to add this to ENV, then Terraform won't be able to talk to GCP.

```sh
export GOOGLE_CREDENTIALS=$(cat ~/Downloads/path-to-my-secret-service-account.json)
```

> Note: We are giving this service-account some pretty broad permissions on our project. So, be careful of not putting the file into Git or anything like that. I also recommend trimming these permissions manually.

## Describing our environment

Hashicorp's Terraform is "infrastructure as code", or as I would put it: "A declaritive way of describing your hosting environment". Instead of telling Google or Amazon what to do, we tell Terraform how it should look like. Terraform then does the required API calls, and if everything is as it should be, it will do nothing at all.

This may seem overly complicated, but by doing this, copying an environment is trivial. If there's a new person on your team that wants to know what environments are running, we can look in one place.

We will be deploying:

- a Postgres database
- a storage bucket
- a managed container with a Go backend

### Initial Terraform configuration

Terraform configuration-files have a `.tf` postfix. To keep things simple, we'll only use one file (`main.tf`). The file is rather large, so we will start small and then add to it.

```hcl
provider "google" {
  project = var.project
  region  = var.region
  version = "= 3.23"
}
```

This just tells Terraform that we'll be using the Google Cloud provider. We lock the version, so that our configuration file matches the provider API used.

### Persisting our state

If you run Terraform locally, you might notice a `.tfstate` file. It tells Terraform which services are already created, their last known configuration and so on. We will be using Terraform as a part of our builds, so we want this state to be persisted somewhere globally.

To be able to do that, you need to manually create a bucket called `tfstate.internal.example.com` (or whatever you want, just make it match the configuration below) in your Google Cloud project.

```hcl
terraform {
  backend "gcs" {
    bucket = "tfstate.internal.example.com"
    prefix = "terraform/state"
  }
}
```

> Note: The Terraform state bucket cannot be managed by Terraform. You must create it yourself.

### Variables

Using variables allow us to define stuff like "region" and "database_secret" in one place. Terraform variables can also be set using ENV, like "TF_VAR_REGION" will be matched to a "region" variable.

```hcl
variable "region" {
  type        = string
  description = "GCP region"
  default     = "europe-west1"
}

variable "project" {
  type        = string
  description = "GCP project"
  default     = "example-project"
}

# Used by our non-root database user
variable "db_password" {
  type        = string
  description = "Database secret"
}

# Used by our deployment pipeline to set the new image.
variable "docker_tag" {
  type        = string
  description = "Tag for Docker Image"
  default     = "latest"
}

```

### Adding the database

Since this is just a teeny tiny staging environment, we buy the cheapest database server around. We are using Postgres 11, there are also [other database types and options](https://www.terraform.io/docs/providers/google/r/sql_database_instance.html).

> Note: We will be destroying our database periodically, so if you need to store something permenently, you should do backups.

```hcl
resource "google_sql_database_instance" "db" {
  name             = "db"
  region           = var.region
  database_version = "POSTGRES_11"
  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "dbname" {
  name     = "staging"
  instance = google_sql_database_instance.db.name
}

resource "google_sql_user" "dbuser" {
  name     = "pgadmin"
  instance = google_sql_database_instance.db.name
  password = var.db_password
}
```

You will notice that we are referencing our variables (like `var.db_password`), but we're also referencing the resources controlled by Terraform. In this case, we fetch the instance-name from the newly created instance. In a normal setup, we'd have to know this information to be able to proceed. By using Terraform, it manages all of these references for us.

### Adding a storage bucket for assets

My application uses [Go Cloud Development Kit](https://gocloud.dev) to store assets. And on Google Cloud, that means adding a Cloud Storage bucket to the project. At the moment, this bucket is private. Check the [documentation](https://www.terraform.io/docs/providers/google/r/storage_bucket_access_control.html) if you want a public bucket.

```hcl
resource "google_storage_bucket" "assets" {
  name     = "assets.example.com"
  location = "EU"
  #force_destroy = true # If you want this destroyed when we take our environment down, uncomment this line
  bucket_policy_only = true
}
```

### Adding a cloud-run service

This guide is not going to cover building Docker images or creating Dockerfiles. In the second part of this guide, we will build a docker-image, push it to Container Registry and pass it on to Cloud Run.

I was going to use Github Packages, but Cloud-Run only works from Google's Container Registry.

For demonstration purposes, we are just using a sample image from Google, and the ENV variables will not be used. But I spent quite some time digging up how to make the SQL connection work, so I think leaving it in will be helpful The `metadata` part tells the Google SQL Proxy how to connect to the database and how many instances we will allow Google to scale to.

```hcl
resource "google_cloud_run_service" "backend" {
  name     = "backend"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello:${var.docker_tag}"
        # Demonstration purposes only
        env {
          name  = "PG_STRING"
          value = "host=/cloudsql/${google_sql_database_instance.db.connection_name} user=${google_sql_user.dbuser.name} password=${google_sql_user.dbuser.password} dbname=${google_sql_database.dbname.name} sslmode=require"
        }
        # Demonstration purposes only
        env {
          name  = "BUCKET"
          value = "gs://${google_storage_bucket.assets.name}"
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "3"
        "run.googleapis.com/cloudsql-instances" = "${var.project}:${var.region}:${google_sql_database_instance.db.name}"
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  autogenerate_revision_name = true
}
```

### Custom name for your Cloud Run instance

Google offers automatic TLS and load balancing with custom-names. First you have to validate your domain with Google, and then you have to [add your service-account to it](https://cloud.google.com/run/docs/mapping-custom-domains#adding_verified_domain_owners_to_other_users_or_service_accounts).

When that is done, you can use the following to add a custom dns name.

```
# https://cloud.google.com/run/docs/mapping-custom-domains#adding_verified_domain_owners_to_other_users_or_service_accounts
resource "google_cloud_run_domain_mapping" "backend" {
  location = var.region
  name     = "api.example.com"

  metadata {
    namespace = var.project
  }

  spec {
    route_name = google_cloud_run_service.backend.name
  }
}
```

## Terraform Plan

Navigate to your directory. I keep mine in `devops/google/main.tf`.

```sh
terraform plan
```

## Terraform Apply

If you agree with the changes suggested by `terraform plan` you can run:

```sh
terraform apply
```

## Terraform Destroy

To clean up all the resources we have created, we can run:

```sh
terraform destroy
```

> Note: I don't take any responsibility for what you might leave on your account. So make sure that the cleanup worked as expected.

## Part 2: Setting this up on Github Actions.

I'll add a link to the second part of this blog post as soon as it's ready.
