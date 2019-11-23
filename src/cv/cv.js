import React, { useEffect, useState } from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
  Link
} from "@react-pdf/renderer";

import {
  SectionHeader,
  Headline,
  Head,
  ExperienceItem,
  Box,
  colors,
  TimelineItem,
  Paragraph,
  EducationItem,
  periodToString,
  Tag
} from "./elements";

import resolveConfig from "tailwindcss/resolveConfig";

import localConfig from "../../tailwind.config";

const { theme } = resolveConfig(localConfig);

import resume from "./resume.json";

const sortedCategories = resume.skills.map(c => {
  const nk = c.keywords
    .map(k => {
      return {
        name: k,
        // score is currently just duration
        score: (resume.work && durationForSkill(resume.work, k)) || 0
      };
    })
    .sort((a, b) => {
      return b.score - a.score;
    });
  return {
    ...c,
    keywords: nk
  };
});

import { Andri } from "./pictures";
import { durationForSkill } from "../lib/skills";

const CVFrontpage = ({ image }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.top}>
      <Head src={Andri} />
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "semibold" }}>
          Andri Óskarsson
        </Text>
        <Text style={{ fontSize: 12 }}>Computer Engineer</Text>
      </View>
    </View>
    <View
      style={{
        marginTop: 5,
        paddingVertical: 10,
        borderTop: 0.5,
        borderBottom: 0.5,
        borderColor: "#d3d3d3",
        backgroundColor: colors.programming
      }}
    >
      <Text
        style={{
          fontStyle: "italic",
          fontSize: 12,
          textAlign: "center",
          color: "white"
        }}
      >
        {resume.basics.summary}
      </Text>
    </View>

    <View
      style={{
        flexDirection: "row"
      }}
    >
      <View style={styles.left}>
        <Box title="Education">
          {resume.education.map(e => (
            <EducationItem
              key={`${e.institution + e.startDate}`}
              institution={e.institution}
              area={e.area}
              period={periodToString(e.startDate, e.endDate)}
              studyType={e.studyType}
            />
          ))}
        </Box>

        <Box title="Skills">
          <Text style={{ color: "grey", fontSize: 8, marginTop: -5 }}>
            Ordered by experience
          </Text>
          {sortedCategories.map(s => (
            <View key={s.name} wrap={true} style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", color: s.color }} key={s.name}>
                {s.name}
              </Text>
              <View
                style={{ flexWrap: "wrap", flexDirection: "row", marginTop: 5 }}
              >
                {s.keywords &&
                  s.keywords.map(kw => (
                    <Tag key={kw.name} color={s.color}>
                      {kw.name}
                    </Tag>
                  ))}
              </View>
            </View>
          ))}
        </Box>

        <Box title="About">
          <Paragraph>
            I come from Reykjavík, Iceland and am the oldest of 5 brothers. In
            2006 I moved to Denmark to study. I now live near Aalborg, Denmark
            with my girlfriend and son. In my off-time I like to cook, take
            photos and go for walks.
          </Paragraph>
          <Paragraph>
            I've been facinated by computers since age 8 and spend much of my
            free time, learning more about them.
          </Paragraph>
        </Box>

        <Box title="Languages">
          <Text>Icelandic (native)</Text>
          <Text>English (fluent)</Text>
          <Text>Danish (fluent)</Text>
        </Box>

        <Box title="Social">
          <Text>Co-organizer & Speaker Aalborg React Meetup</Text>
          <Text>Co-organizer & Speaker Aalborg Hackathon</Text>
        </Box>

        <Box title="Contact">
          <Link src="mailto:m@andri.dk">
            <Text>m@andri.dk</Text>
          </Link>
        </Box>
      </View>
      <View wrap={true} style={styles.right}>
        <View>
          <SectionHeader>Experience</SectionHeader>
          {resume.work.slice(0, 100).map((w, idx) => (
            <TimelineItem
              idx={idx}
              key={`${w.company + w.startDate}`}
              title={w.position}
              employer={w.company}
              period={periodToString(w.startDate, w.endDate)}
              tags={w.skills}
              skills={resume.skills}
            >
              {w.summary}
            </TimelineItem>
          ))}
        </View>
      </View>
    </View>
    <View fixed style={styles.footer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{resume.basics.name}</Text>

        <Text>{resume.basics.email}</Text>
        <Text
          fixed
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </View>
  </Page>
);

// Create Document Component
export const CVDoc = ({ image }) => (
  <Document>
    <CVFrontpage image={image} />
  </Document>
);

// Create styles
const styles = StyleSheet.create({
  page: {
    //paddingVertical: 30,
    position: "relative",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 30,
    //marginHorizontal: 30,
    fontSize: 8,
    color: theme.colors.gray[900],
    fontFamily: "DefaultFont"
  },
  leftHeader: {
    alignItems: "center",
    paddingBottom: 20
  },
  top: {
    flexDirection: "row",
    alignItems: "center"
  },
  left: {
    width: "50%",
    marginTop: 20,
    paddingRight: 10
    //flex: 1,
  },
  right: {
    marginTop: 20,
    paddingLeft: 10,
    width: "50%"
    //flex: 1
  },
  footer: {
    marginHorizontal: 10,
    borderTopColor: "#d3d3d3",
    borderTopWidth: 0.5,
    paddingVertical: 10,
    width: "100%",
    position: "absolute",
    bottom: 20,
    left: 20
  }
});
