import React from "react";
import { Image } from "@react-pdf/renderer";

export const Head = ({ src }: { src: any }) => (
  <Image
    source={src}
    style={{
      width: 90,
      height: 90,
      borderRadius: 90,
      marginBottom: 10,
      borderColor: "#f3f3f3",
      borderWidth: 1,
    }}
  />
);
