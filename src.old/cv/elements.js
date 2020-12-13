import React from "react";

import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font
} from "@react-pdf/renderer";

import { hex } from "wcag-contrast";
import dayjs from "dayjs";
import "dayjs/locale/en";

export const colors = {
  borders: "#d3d3d3",
  operations: "#259490",
  programming: "#2460A7",
  databases: "#491D70"
};

export const tagColors = {
  react: colors.programming,
  linux: colors.operations,
  gcp: colors.operations,
  mysql: colors.databases,
  firestore: colors.databases,
  php: colors.programming,
  typescript: colors.programming,
  javascript: colors.programming
};

export const Head = ({ src }) => (
  <Image
    source={src}
    resizeMode="contain"
    style={{
      width: 75,
      height: 75,
      borderRadius: 50,
      marginBottom: 10,
      borderColor: colors.borders,
      borderWidth: 1
    }}
  />
);

export const SectionHeader = ({ children, color = "black" }) => {
  const first = children.toUpperCase();
  const last = children.substring(1);
  return (
    <View style={{}}>
      <Text style={{ fontWeight: "bold", fontSize: 12 }}>
        <Text style={{ color: color }}>{first}</Text>
      </Text>
      <View
        style={{
          width: "auto",
          height: 1,
          marginBottom: 5
        }}
      />
    </View>
  );
};

export const Headline = ({ children }) => (
  <Text
    style={{ fontWeight: "bold", fontSize: 15, marginBottom: 0, marginTop: 5 }}
  >
    {children}
  </Text>
);

export const TimelineItem = ({
  idx = 0,
  title,
  period,
  children,
  employer,
  tags = [],
  location,
  skills
}) => {
  //tags = tags.sort();
  return (
    <View
      wrap={false}
      style={{
        marginTop: 5
        //arginBottom: 5
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 2.5,
          flexWrap: "wrap"
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{title}</Text>
          <Text>{employer}</Text>
        </View>
        <Text style={{ color: "grey", fontSize: 8 }}>{period}</Text>
      </View>

      {children && <Text style={{ marginBottom: 2.5 }}>{children}</Text>}
      {tags && (
        <View wrap style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {tags &&
            tags.map(m => {
              let color;
              if (skills) {
                const idx = skills.findIndex(skill => {
                  const match = skill.keywords.findIndex(
                    k => k.toLowerCase() === m.toLowerCase()
                  );
                  if (match > -1) {
                    return true;
                  }
                  return false;
                });
                if (idx > -1) {
                  color = skills[idx].color;
                }
              }
              return (
                <Tag key={m} color={color}>
                  {m}
                </Tag>
              );
            })}
        </View>
      )}
    </View>
  );
};

export const EducationItem = ({ institution, period, area, studyType }) => (
  <View wrap={false} style={{ marginTop: 5 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        {area}, {studyType}
      </Text>
      <Text style={{ color: "grey" }}>{period}</Text>
    </View>
    <Text style={{ fontWeight: "normal" }}>{institution}</Text>
  </View>
);

export const Tag = ({ color = colors.borders, children, badgeText }) => (
  <View
    style={{
      //borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: color,
      marginRight: badgeText ? 7 : 2.5,
      marginVertical: 2.5,
      padding: 2.5,
      minWidth: 20,
      borderColor: color,
      position: "relative"
    }}
  >
    <Text
      style={{
        fontSize: 6,
        //fontWeight: "bold",
        //color: hex("#00000", color) < 10 ? "white" : "black"
        color: "black"
      }}
    >
      {children}
    </Text>
    {badgeText && (
      <View
        style={{
          position: "absolute",
          borderRadius: 10,
          top: -5,
          right: -5,
          padding: 2,
          backgroundColor: color
        }}
      >
        <Text
          style={{
            fontSize: 5,
            color: "white"
          }}
        >
          {badgeText}
        </Text>
      </View>
    )}
  </View>
);

// Not meant for anything wrapping pages
export const Box = ({ children, title, color, style = {} }) => (
  <View wrap={true} style={{ marginBottom: 10 }}>
    <SectionHeader color={color}>{title}</SectionHeader>
    <View style={{ ...style }}>
      {children && typeof children === "string" ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </View>
  </View>
);

export const Paragraph = ({ children }) => (
  <Text style={{ marginTop: 5 }}>{children}</Text>
);

export const periodToString = (startDate, endDate) => {
  if (!startDate) {
    throw new Error("no startDate");
  }
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dateformat = "YYYY";

  if (endDate === startDate) {
    return `${start.format(dateformat)}`;
  }

  if (!endDate) {
    return `${start.format(dateformat)} - Present`;
  }

  return `${start.format(dateformat)} - ${end.format(dateformat)}`;
};
