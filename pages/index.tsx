import React from "react";
import Link from "next/link";

import { Layout } from "../components/layouts/layout";
import { BlogPost, getAllPosts } from "../lib/blog-posts";
import { FrontPageHeader } from "../components/frontpage-header";
import { ArticleList } from "../components/ArticleList";
import { Section } from "../components/Section";
import CVdata from "../cv/resume.json";
// import { SkillSummary } from "../components/SkillSummary";
import { PageFooter } from "./PageFooter";
import { Card } from "../components/card";

const IndexPage = ({ allPosts }: { allPosts: BlogPost[] }) => (
  <Layout>
    <FrontPageHeader />
    <Section title="Latest Posts">
      <ArticleList>
        {allPosts.map((post) => (
          <Card
            key={post.path}
            title={post.title}
            link={"/blog/" + post.path}
            description={post.excerpt}
            tags={post.tags}
            date={new Date(post.date)}
            draft={process.env.NODE_ENV !== "production" && post.draft}
          />
        ))}
      </ArticleList>

      <div className="mt-4 px-4 md:px-0">
        <span className="link">
          <Link href="/blog">More posts...</Link>
        </span>
      </div>
    </Section>
    {/* <SkillSummary
      jsonResume={CVdata}
      focus={[
        "React",
        "Go",
        "Linux",
        "TypeScript",
        "Postgres",
        "React Native",
        "Kubernetes",
      ]}
    /> */}
    <PageFooter />
  </Layout>
);

export async function getStaticProps() {
  const posts = await getAllPosts(["title", "date", "path", "tags", "excerpt"]);
  return {
    props: {
      allPosts: posts,
    },
  };
}

export default IndexPage;
