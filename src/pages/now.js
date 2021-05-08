import React from "react";
import { BodyContainer } from "../components/body-container";
import PagesLayout from "../layouts/pages";

const Section = ({ children, title }) => (
  <div className="mt-6 leading-relaxed text-sm md:text-lg">
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </div>
);

const NowPage = ({ data }) => (
  <PagesLayout>
    <BodyContainer>
      <h1 className="text-3xl font-semibold">What I'm doing now</h1>
      <Section title="Reading again!">
        <p>
          Currently churning through The Dresden Files series (book 8 atm). I
          love these books. They mix together fantasy, old school investigative
          stories and a the Bruce Willis of wizards. Always in the wrong place
          at the wrong time.
        </p>
      </Section>

      <Section title="Programming, for fun">
        <p>
          I have a few pet-projects that I'm working on. Mostly for learning
          purposes, but it would sure be fun to spawn a business at some point.
        </p>
        <p>&nbsp;</p>
        <p>
          I'm reading and experimenting with event-sourcing, cqrs and
          domain-driven-design on the backend and on the frontend I'm playing
          with Tailwind CSS.
        </p>
      </Section>

      <Section title="My son keeps growing">
        <p>
          Our little half-Icelandic, half-Dane, all Viking son keeps us
          entertained and challanged at home. He's soon to be 7 years old and
          his little head is filled with questions that I hope Wikipedia can
          help answer. We've started doing physics experiments together.
        </p>
        <p>&nbsp;</p>
        <p>
          He's already very interested in computers of all sizes, but I dare not
          push it on him. He'll get there if and when he wants to.
        </p>
      </Section>

      <Section title="Engaged, but not in a hurry">
        <p>
          Me and my girlfriend got engaged. I proposed during a hide-and-seek
          game with our son. I was going for: "rememberable, but silly". I think
          I nailed it. No date set yet.
        </p>
      </Section>

      <Section title="[Last updated: 2021-04-24]"></Section>

      <div className="mt-10">
        <p className="text-sm">
          Inspired by{" "}
          <a className="link" href="#top">
            Derek Sivers' now page
          </a>
          .
        </p>
      </div>
    </BodyContainer>
  </PagesLayout>
);

export default NowPage;
