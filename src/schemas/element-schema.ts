import { z } from "zod";

import {
  containerNodeTypes,
  elementNodeTypes,
  elementResponsiveBreakpoints,
} from "@/types/elements";
import type {
  ContainerNode,
  ElementNode,
  ElementPropValue,
  ElementTreeNode,
  FreeformElementLayout,
} from "@/types/elements";

const elementPropValueSchema: z.ZodType<ElementPropValue> =
  z.lazy(() =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.null(),
      z.array(elementPropValueSchema),
      z.record(z.string(), elementPropValueSchema),
    ]),
  );

export const elementStyleSchema = z
  .object({
    alignSelf: z.string().min(1).optional(),
    backgroundColor: z.string().min(1).optional(),
    borderRadius: z.string().min(1).optional(),
    color: z.string().min(1).optional(),
    display: z.string().min(1).optional(),
    height: z.string().min(1).optional(),
    justifySelf: z.string().min(1).optional(),
    margin: z.string().min(1).optional(),
    maxWidth: z.string().min(1).optional(),
    padding: z.string().min(1).optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),
    width: z.string().min(1).optional(),
  })
  .strict();

const responsiveSchema = z
  .object(
    Object.fromEntries(
      elementResponsiveBreakpoints.map((breakpoint) => [breakpoint, elementStyleSchema.optional()]),
    ),
  )
  .partial()
  .strict();

export const elementNodeSchema: z.ZodType<ElementNode> = z
  .object({
    id: z.string().min(1),
    type: z.enum(elementNodeTypes),
    props: z.record(z.string(), elementPropValueSchema).optional(),
    style: elementStyleSchema.optional(),
    responsive: responsiveSchema.optional(),
  })
  .strict();

export type ElementNodeFromSchema = z.infer<typeof elementNodeSchema>;

export const elementTreeNodeSchema: z.ZodType<ElementTreeNode> = z.lazy(() =>
  z.union([elementNodeSchema, containerNodeSchema]),
);

export const containerNodeSchema: z.ZodType<ContainerNode> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      type: z.enum(containerNodeTypes),
      layout: z
        .object({
          direction: z.enum(["horizontal", "vertical"]).optional(),
          gap: z.string().min(1).optional(),
          align: z.string().min(1).optional(),
          justify: z.string().min(1).optional(),
          columns: z.union([z.number(), z.string().min(1)]).optional(),
          wrap: z.boolean().optional(),
        })
        .strict()
        .optional(),
      children: z.array(elementTreeNodeSchema),
      style: elementStyleSchema.optional(),
      responsive: responsiveSchema.optional(),
    })
    .strict(),
);

export const blockElementContentSchema = z
  .object({
    elements: z.array(elementNodeSchema).optional(),
    containers: z.array(containerNodeSchema).optional(),
  })
  .strict();

export const freeformElementLayoutSchema: z.ZodType<FreeformElementLayout> = z
  .object({
    breakpoint: z.enum(elementResponsiveBreakpoints),
    elementId: z.string().min(1),
    h: z.number(),
    w: z.number(),
    x: z.number(),
    y: z.number(),
    zIndex: z.number().optional(),
  })
  .strict();
