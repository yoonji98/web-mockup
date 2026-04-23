import { z } from "zod";

import { collectionFieldTypes } from "@/types/collections";
import type { CollectionDefinition } from "@/types/collections";

export const fieldDefinitionSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    options: z.array(z.string().min(1)).optional(),
    required: z.boolean().optional(),
    type: z.enum(collectionFieldTypes),
  })
  .strict();

export const collectionDefinitionSchema: z.ZodType<CollectionDefinition> = z
  .object({
    fields: z.array(fieldDefinitionSchema).min(1),
    id: z.string().min(1),
    itemName: z.string().min(1),
    name: z.string().min(1),
    sampleData: z.array(z.record(z.string(), z.unknown())),
  })
  .strict();
