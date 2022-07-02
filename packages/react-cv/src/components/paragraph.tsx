import React from "react";
import { Text } from "@react-pdf/renderer";
import { SafeText } from "./safe-text";

export const Paragraph = ({
  children = "",
  style,
}: {
  children: string;
  style?: any;
}) => <Text style={[{ marginTop: 5 }, style]}>{children}</Text>;
