import { Text, View } from "@react-pdf/renderer";
import React, { ReactNode } from "react";
import { hex } from "wcag-contrast";

export const Tag = ({
  color = "#f3f3f3",
  children,
  badgeText,
}: {
  color: string;
  children: ReactNode;
  badgeText?: string;
}) => (
  <View
    style={{
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: color,
      //backgroundColor: color,
      marginRight: badgeText ? 7 : 2.5,
      marginVertical: 2.5,
      paddingHorizontal: 2.5,
      paddingVertical: 1.5,
      //minWidth: 20,
      position: "relative",
    }}
  >
    <Text
      style={{
        fontSize: 6,
        fontWeight: "bold",
        //color: hex("#00000", color) < 7 ? "white" : "black",
        color: color,
      }}
    >
      {children}
    </Text>
  </View>
);
