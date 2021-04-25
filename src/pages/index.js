import React from "react";
import Link from "gatsby-link";
import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Twitter, LinkedIn, Github } from "../components/social-icons";
import { FaHeart } from "react-icons/fa";
import { SkillDataTransform, Skills } from "../components/skills/skills";
import { Card } from "../components/card";
import { Layout } from "../layouts/layout";
import { SEO } from "../components/seo";

import waveBG from "../../static/img/wave.svg";
import isFlag from "../../static/img/iceland-flag.svg";
import dkFlag from "../../static/img/denmark-flag.svg";

const IndexPage = ({ data }) => (
  <Layout>
    <SEO />
    <div
      className="flex flex-col font-sans md:min-h-one-third-screen text-white bg-blue-700"
      style={{
        background: `url(${waveBG}) no-repeat`,
        backgroundSize: "cover",
        //backgroundImage: `url(${waveBG})`,
      }}
    >
      <div className="flex-1">
        <nav className="flex justify-between items-center p-8">
          <StaticImage
            alt="round profile (small)"
            src={"../../static/img/coffee-art.jpg"}
            className="rounded-full  w-16 h-16 md:invisible"
            imgClassName="rounded-full shadow-2xl"
          />
          <div>
            <ul className="flex flex-row">
              <NavLink href="blog/">Blog</NavLink>

              <NavLink href="now/">Now</NavLink>
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
                <span aria-hidden hidden>
                  Iceland
                </span>
                <img
                  className="inline-block align-middle md:w-8 md:h-8 w-4 h-4"
                  alt="Iceland"
                  src={isFlag}
                />
                &nbsp; living in &nbsp;
                <img
                  className="inline-block align-middle md:w-8 md:h-8 w-4 h-4"
                  alt="Denmark"
                  src={dkFlag}
                />
                <span aria-hidden hidden>
                  Denmark
                </span>
              </p>
              <p>&nbsp;</p>

              <p>&nbsp;</p>
              <p>
                I make websites, create apps, manage infrastructure, develop
                products and more.
              </p>
            </div>
          </div>
          <div className="hidden md:block p-4 items-start justify-start mr-6">
            <StaticImage
              alt="round profile (large)"
              src={"../../static/img/coffee-art.jpg"}
              className="rounded-full shadow-2xl block mx-auto md:w-48 md:h-48"
              imgClassName="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
    <Section title="Latest Posts">
      <ArticleList posts={data.allMarkdownRemark.edges} />
      <div className="mt-4 px-4 md:px-0">
        <Link className="link" to="/blog">
          More posts...
        </Link>
      </div>
    </Section>
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
    {posts.map(({ node: post }) => {
      return (
        <Card
          key={post.id}
          title={post.fields.title}
          link={post.fields.slug || "/"}
          description={post.excerpt}
          tags={post.frontmatter.tags}
          date={post.fields.date}
          draft={
            process.env.NODE_ENV !== "production" && post.frontmatter.draft
          }
        />
      );
    })}
  </div>
);

const NavLink = ({ href, children }) => (
  <li className="mr-6">
    <a className="text-white hover:text-gray-400" href={href}>
      {children}
    </a>
  </li>
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
    <h2 className="font-headline ml-6 md:ml-0 font-semibold text-xl md:text-2xl uppercase mb-2">
      {title}
    </h2>
    {children}
  </div>
);

export const query = graphql`
  query ArticleList {
    allMarkdownRemark(
      limit: 3
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fields: { draft: { ne: true } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 100, format: PLAIN)
          id
          fields {
            title
            slug
            date
            tags
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            draft
            tags
          }
        }
      }
    }
    cvJson {
      skills {
        name
        level
        keywords
        color
      }
      work {
        company
        startDate
        endDate
        skills
      }
    }
  }
`;

export default IndexPage;
