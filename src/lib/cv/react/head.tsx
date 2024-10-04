import { Image } from "@react-pdf/renderer";
import path from "node:path";
import { STATIC_DIR } from "../pdf-utils";

export const Head = () => {
  return (
    <Image
      source={path.join(STATIC_DIR, "img/andri.jpg")}
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
