import { NextRequest } from "next/server";
import { z } from "zod";

import { generateReactProjectZip } from "@/lib/export/react-project-generator";
import { pageDataSchema } from "@/schemas/page-schema";
import { siteDataSchema } from "@/schemas/site-schema";
import { exportModes } from "@/types/export";

const exportRequestSchema = z
  .object({
    mode: z.enum(exportModes).optional(),
    page: pageDataSchema.optional(),
    projectName: z.string().min(1),
    site: siteDataSchema.optional(),
  })
  .refine((request) => request.page || request.site, {
    message: "page 또는 site가 필요합니다.",
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedRequest = exportRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "Invalid export request.",
        issues: parsedRequest.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const result = await generateReactProjectZip(parsedRequest.data);
  const zipBody = result.zip.buffer.slice(
    result.zip.byteOffset,
    result.zip.byteOffset + result.zip.byteLength,
  ) as ArrayBuffer;

  return new Response(zipBody, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${result.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
