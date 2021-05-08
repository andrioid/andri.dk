import React from "react";
import Link from "next/link";

import { Twitter, LinkedIn, Github } from "../components/social-icons";
import { FaHeart } from "react-icons/fa";
import { SkillDataTransform, Skills } from "../components/skills/skills";
import { Card } from "../components/card";
import { Layout } from "../components/layouts/layout";
import { getAllPosts } from "../lib/blog-posts";
import { FrontPageHeader } from "../components/frontpage-header";

const IndexPage = ({ data, allPosts }) => (
  <Layout>
    <FrontPageHeader />
    <Section title="Latest Posts">
      <ArticleList posts={allPosts} />
      <div className="mt-4 px-4 md:px-0">
        <span className="link">
          <Link href="/blog">More posts...</Link>
        </span>
      </div>
    </Section>
    {data && data.cvJson && (
      <Section title="Technology" bgColorLevel={100}>
        <div className="pl-6 md:pl-0 text-sm mb-4 italic">
          Sorted by experience. Preference indicated by{" "}
          <FaHeart className="inline text-red-700" />
        </div>
        <SkillDataTransform
          workSkills={data.cvJson.work}
          rootSkills={data.cvJson.skills}
        >
          {(categories) => (
            <Skills
              categories={categories}
              focus={[
                "React",
                "Go",
                "Linux",
                "TypeScript",
                "Postgres",
                "React Native",
                "Kubernetes",
              ]}
            />
          )}
        </SkillDataTransform>
      </Section>
    )}
    <div className="text-lg px-10 md:px-20 lg:px-40 py-10 flex justify-between">
      <span className="italic">Andri Óskarsson</span>
      <div>
        <Twitter user="andrioid" />
        <Github user="andrioid" />
        <LinkedIn user="andriosk" />
      </div>
    </div>
  </Layout>
);

const ArticleList = ({ posts }) => (
  <div className="flex flex-wrap justify-start items-stretch">
    {posts &&
      posts.map((post) => {
        return (
          <Card
            key={post.id + post.title}
            title={post.title}
            link={post.path}
            description={post.excerpt}
            tags={post.tags}
            date={post.date}
            draft={process.env.NODE_ENV !== "production" && post.draft}
          />
        );
      })}
  </div>
);

export async function getStaticProps() {
  const posts = await getAllPosts(["title", "date", "path", "tags", "excerpt"]);
  return {
    props: {
      allPosts: posts,
    },
  };
}

// Wraps the text and handles margins
export const BodyContainer = ({ children, className }) => (
  <div className="mt-10 mx-5 md:mx-10 md:mx-20 lg:mx-40 text-xl md:max-w-4xl">
    {children}
  </div>
);

const Section = ({
  children,
  title,
  bgColorBase = "gray",
  bgColorLevel = 200,
}) => (
  <div
    className={`md:px-20 lg:px-40 text-xl bg-${bgColorBase}-${bgColorLevel} py-6`}
  >
    <h2 className="font-headline ml-6 md:ml-0 font-semibold text-xl md:text-2xl uppercase">
      {title}
    </h2>
    {children}
  </div>
);

export default IndexPage;
