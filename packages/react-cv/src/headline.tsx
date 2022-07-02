import React from "react";
import { Text } from "@react-pdf/renderer";

export const Headline = ({ children = "" }: { children: string }) => (
  <Text
    style={{ fontWeight: "bold", fontSize: 14, marginBottom: 0, marginTop: 5 }}
  >
    {children}
  </Text>
);
