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
  periodToString
} from "./elements";

import resolveConfig from "tailwindcss/resolveConfig";

import localConfig from "../../tailwind.config";

const { theme } = resolveConfig(localConfig);

import resume from "./resume.json";

import { Andri } from "./pictures";

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
              studyType={e.studyType}
              startDate={e.startDate}
              endDate={e.endDate}
            />
          ))}
        </Box>

        <Box title="Languages">
          <Text>Icelandic (native)</Text>
          <Text>English (fluent)</Text>
          <Text>Danish (fluent)</Text>
        </Box>

        <Box title="Social">
          <Text>Co-organizer Aalborg React Meetup</Text>
          <Text>Co-organizer Aalborg Hackathon</Text>
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
          {resume.work.slice(0, 100).map(w => (
            <TimelineItem
              key={`${w.company + w.startDate}`}
              title={w.position}
              employer={w.company}
              period={periodToString(w.startDate, w.endDate)}
              tags={w.skills}
            >
              {w.summary}
            </TimelineItem>
          ))}
        </View>

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
    paddingVertical: 30,
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
  }
});
