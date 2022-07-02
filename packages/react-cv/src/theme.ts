export const colors = {
  grayBackground: "#F1F5F8",
  borders: "#d3d3d3",
  operations: "#259490",
  programming: "#2460A7",
  data: "#491D70",
  processes: "#000000",
  personLabel: "#2460A7",
};

export function getColor(name: keyof typeof colors | string): string {
  return colors[name as keyof typeof colors];
}
