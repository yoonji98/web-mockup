export const exportModes = [
  "static-website",
  "clickable-prototype",
  "frontend-scaffold",
  "full-stack-starter",
] as const;

export type ExportMode = (typeof exportModes)[number];
