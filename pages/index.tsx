import React from "react";
import Link from "next/link";

import { Twitter, LinkedIn, Github } from "../components/social-icons";
import { FaHeart } from "react-icons/fa";
import { SkillDataTransform, Skills } from "../components/skills/skills";
import ReactCountryFlag from "react-country-flag";
import { Card } from "../components/card";
import { Layout } from "../components/layouts/layout";
import { getAllPosts } from "../lib/blog-posts";

const IndexPage = ({ data, allPosts }) => (
  <Layout>
    <div
      className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-700 bg-fixed"
      style={{
        background: `/img/header.svg`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "darken",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.33)",
          flex: 1,
        }}
      >
        <nav className="flex items-end justify-end justify-between items-center p-8">
          <img
            alt="round profile"
            src="/img/andratar.jpg"
            className="rounded-full shadow-2xl w-16 h-16 md:invisible"
          />
          <div>
            <ul className="flex flex-row">
              <NavLink href="blog/">Blog</NavLink>

              <NavLink href="now/">Now</NavLink>
              <NavLink href="cv.pdf">CV</NavLink>
            </ul>
          </div>
        </nav>
        <div className="mx-10 md:mx-20 pb-8 lg:mx-40 flex flex-row flex-wrap font-headline text-2xl">
          <div className="flex-1">
            <h2 className="font-headline md:text-6xl text-3xl font-semibold inline-block my-2">
              Hi, I'm Andri
            </h2>
            <div className="text-lg md:text-2xl">
              <p>
                Computer Engineer from &nbsp;
                <span aria-hidden>
                  <ReactCountryFlag countryCode="is" svg />
                </span>
                &nbsp;<span hidden>Iceland</span> living in &nbsp;
                <ReactCountryFlag countryCode="dk" svg />
                <span hidden>Denmark</span>
              </p>
              <p>&nbsp;</p>
              <p>
                I make websites, create apps, manage infrastructure, develop
                products and more.
              </p>
            </div>
          </div>
          <div className="hidden md:block p-4 items-start justify-start flex mr-6">
            <img
              alt="round profile"
              src="/img/andratar"
              className="rounded-full shadow-2xl block mx-auto md:w-48 md:h-48"
            />
          </div>
        </div>
      </div>
    </div>
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

const NavLink = ({ href, children }) => (
  <li className="mr-6">
    <a className="text-white hover:text-gray-400" href={href}>
      {children}
    </a>
  </li>
);

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
