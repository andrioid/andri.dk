import { Text } from "@react-pdf/renderer";

export const Paragraph = ({
  children = "",
  style,
}: {
  children: string;
  style?: any;
}) => <Text style={[{ marginTop: 5 }, style]}>{children}</Text>;
