import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TextProps, Style } from "@react-pdf/types";
import React from "react";
import ReactMarkdown, { compiler } from "markdown-to-jsx";
import { Section } from "./section/section";
import { Headline } from "../headline";
import { SectionHeader } from "./section/section-header";
import { Footer } from "./footer";
import { useResume } from "../use-resume";

const TextOverride = {
  component: Text,
};

function Heading(props: { children: string }) {
  console.log("heading rendered", props);
  return (
    <Text style={{ fontWeight: "bold", fontSize: 32 }}>{props.children}</Text>
  );
}

const typography: Record<string, Style> = {
  h1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  h2: {
    fontSize: 16,
    marginBottom: 10,
  },
  h3: {
    fontSize: 14,
    marginBottom: 10,
  },
  h4: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  p: {
    marginBottom: 10,
  },
  emph: {
    fontStyle: "italic",
  },
  strong: {
    fontWeight: "bold",
  },
};

// Typography
export function Typography({
  children,
  el,
}: {
  children: string;
  el: keyof typeof typography;
}) {
  const { skillToColor } = useResume();
  const highlightColor = skillToColor(children);
  if (!highlightColor) {
    return <Text style={[typography[el]]}>{children}</Text>;
  }
  return (
    <Text style={[typography[el], { color: highlightColor }]}>{children}</Text>
  );
}

function Spacing() {
  return <View style={{ marginTop: 5 }} />;
}

function Cover({ frontmatter }) {
  if (!frontmatter) {
    return null;
  }

  const { date, location }: { date: Date; location: string } = frontmatter;
  if (!date || !location) {
    throw new Error("date and location frontmatter are required");
  }

  return (
    <View style={styles.cover}>
      <Text>{date.toLocaleDateString()}</Text>
      <Text>{location}</Text>
    </View>
  );
}

export function Markdown({
  children,
  frontmatter,
}: {
  children?: string;
  frontmatter?: Record<string, any>;
}) {
  if (typeof children !== "string") {
    throw new Error("Markdown expects string");
  }
  if (!children) {
    throw new Error("No children defined in Markdown component");
  }

  const options = {
    disableParsingRawHTML: true,
    createElement: React.createElement,
    overrides: {
      a: Link,
      text: Text,
      div: View,
      h1: { component: Typography, props: { el: "h1" } },
      h2: { component: Typography, props: { el: "h2" } },
      h3: { component: Typography, props: { el: "h3" } },
      h4: { component: Typography, props: { el: "h4" } },
      p: { component: Typography, props: { el: "p" } },
      li: TextOverride,
      span: TextOverride,
      br: Spacing,
      emph: { component: Typography, props: { el: "emph" } },
      strong: { component: Typography, props: { el: "strong" } },
      outer: View,
    },
  };

  return (
    <Page style={styles.page}>
      <Cover frontmatter={frontmatter} />
      <ReactMarkdown options={options}>{children}</ReactMarkdown>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            width: 180,
            borderTop: 1,
            paddingTop: 10,
            alignItems: "flex-end",
          }}
        >
          <Text>Andri Óskarsson</Text>
        </View>
      </View>
      <Footer name="Trifork ansøgning" email="hej@andri.dk" />
    </Page>
  );
}

const styles = StyleSheet.create({
  page: {
    //paddingVertical: 30,
    position: "relative",
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 30,
    //marginHorizontal: 30,
    fontSize: 12,
    color: "black",
    fontFamily: "DefaultFont",
  },
  cover: {
    alignItems: "flex-end",
    marginBottom: 40,
  },
});
