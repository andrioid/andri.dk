import React from "react";

import {
  FaTwitter as TwitterIcon,
  FaLinkedin as LinkedInIcon,
  FaGithub as GithubIcon,
} from "react-icons/fa";

const iconResolver = (type) => {
  switch (type) {
    case "twitter":
      return TwitterIcon;
    case "linkedin":
      return LinkedInIcon;
    case "github":
      return GithubIcon;
    default:
      throw new Error(`Type '${type}' not found in iconResolver`);
  }
};

const linkResolver = (user, type) => {
  switch (type) {
    case "twitter":
      return `https://www.twitter.com/${user}`;
    case "github":
      return `https://github.com/${user}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${user}`;
    default:
      throw new Error(`Type '${type}' not found in linkResolver`);
  }
};

const BaseLink = (user, type) => {
  const Icon = iconResolver(type);
  const href = linkResolver(user, type);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mr-2">
      <Icon className="inline-block" />
    </a>
  );
};

export const Twitter = ({ user }) => BaseLink(user, "twitter");
export const LinkedIn = ({ user }) => BaseLink(user, "linkedin");
export const Github = ({ user }) => BaseLink(user, "github");
