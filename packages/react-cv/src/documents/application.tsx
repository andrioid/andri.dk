import React from "react";
import ReactPDF, {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Markdown } from "../components/markdown";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

// Create Document Component
export const ApplicationDoc = ({
  frontmatter,
  markdown,
}: {
  frontmatter: Record<string, any>;
  markdown: string;
}) => (
  <Document>
    <Markdown frontmatter={frontmatter}>{markdown}</Markdown>
  </Document>
);
