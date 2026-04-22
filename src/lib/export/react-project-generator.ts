import JSZip from "jszip";

import { pageDataSchema } from "@/schemas/page-schema";
import { siteDataSchema } from "@/schemas/site-schema";
import { pageDataToSiteData } from "@/lib/site-data";
import type { PageData, SiteData } from "@/types/page";
import { createReactProjectFiles } from "@/lib/export/templates";

export type GenerateReactProjectInput = {
  page?: PageData;
  projectName: string;
  site?: SiteData;
};

export type GeneratedReactProject = {
  fileName: string;
  projectName: string;
  zip: Uint8Array;
};

export async function generateReactProjectZip({
  page,
  projectName,
  site,
}: GenerateReactProjectInput): Promise<GeneratedReactProject> {
  const parsedSite = site ? siteDataSchema.parse(site) : pageDataToSiteData(pageDataSchema.parse(page));
  const safeProjectName = sanitizeProjectName(projectName);
  const zip = new JSZip();

  for (const file of createReactProjectFiles({
    projectName: safeProjectName,
    site: parsedSite,
  })) {
    zip.file(`${safeProjectName}/${file.path}`, file.content);
  }

  return {
    fileName: `${safeProjectName}.zip`,
    projectName: safeProjectName,
    zip: await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    }),
  };
}

export function sanitizeProjectName(projectName: string) {
  const safeName = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return safeName || "my-landing-page";
}
