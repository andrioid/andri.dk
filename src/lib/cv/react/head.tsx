import { Image } from "@react-pdf/renderer";
import path from "node:path";
import andriPic from "@static/img/andri.jpg";

export const Head = ({ src }: { src: any }) => {
  return (
    <Image
      source={andriPic.src}
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
};
