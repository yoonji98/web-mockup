export const collectionFieldTypes = [
  "text",
  "textarea",
  "number",
  "image",
  "date",
  "boolean",
  "select",
  "tags",
  "url",
] as const;

export type CollectionFieldType = (typeof collectionFieldTypes)[number];

export type FieldDefinition = {
  id: string;
  name: string;
  options?: string[];
  required?: boolean;
  type: CollectionFieldType;
};

export type CollectionDefinition = {
  fields: FieldDefinition[];
  id: string;
  itemName: string;
  name: string;
  sampleData: Record<string, unknown>[];
};
