import { createDirectus, readItems, rest, staticToken } from "@directus/sdk"
import type { CollectionEntry } from "astro:content"

type Schema = {
    blog: Array<{
        title: string;
        slug: string;
        body?: string;

    }>
}

export function getDirectusClient() {
    const URL = import.meta.env.DIRECTUS_URL ?? process.env.DIRECTUS_URL
    const TOKEN = import.meta.env.DIRECTUS_TOKEN ?? process.env.DIRECTUS_TOKEN
    if (!URL || !TOKEN) {
        console.log('URL/TOKEN', URL, TOKEN)
        throw new Error("Missing CMS URL and/or TOKEN")
    }
    const directus = createDirectus<Schema>(URL).with(rest()).with(staticToken(TOKEN))
    return directus
}

