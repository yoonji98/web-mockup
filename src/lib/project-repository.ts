import { z } from "zod";

import { pageDataSchema } from "@/schemas/page-schema";
import type { PageData } from "@/types/page";

export const PUBLISHED_PROJECTS_STORAGE_KEY = "publishedProjects";

export const projectPaymentStatuses = ["NONE", "PAID"] as const;
export const projectStatuses = ["DRAFT", "PUBLISHED"] as const;

export type ProjectPaymentStatus = (typeof projectPaymentStatuses)[number];
export type ProjectStatus = (typeof projectStatuses)[number];

export type PublishedProject = {
  id: string;
  title: string;
  slug: string;
  page: PageData;
  status: "PUBLISHED";
  paymentStatus: ProjectPaymentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type PublishProjectInput = {
  page: PageData;
  slug: string;
  paymentStatus?: ProjectPaymentStatus;
};

export interface ProjectRepository {
  getPublishedProjectBySlug: (slug: string) => Promise<PublishedProject | null>;
  publishProject: (input: PublishProjectInput) => Promise<PublishedProject>;
}

export const projectPaymentStatusSchema = z.enum(projectPaymentStatuses);

const publishedProjectSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    page: pageDataSchema,
    status: z.literal("PUBLISHED"),
    paymentStatus: projectPaymentStatusSchema,
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    publishedAt: z.string().min(1),
  })
  .strict();

const publishedProjectsSchema = z.array(publishedProjectSchema);

export function normalizeProjectSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidProjectSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function readPublishedProjects(): PublishedProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawProjects = window.localStorage.getItem(PUBLISHED_PROJECTS_STORAGE_KEY);

  if (!rawProjects) {
    return [];
  }

  try {
    return publishedProjectsSchema.parse(JSON.parse(rawProjects));
  } catch {
    return [];
  }
}

function writePublishedProjects(projects: PublishedProject[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PUBLISHED_PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

export const localStorageProjectRepository: ProjectRepository = {
  async getPublishedProjectBySlug(slug) {
    return readPublishedProjects().find((project) => project.slug === slug) ?? null;
  },
  async publishProject({ page, paymentStatus = "NONE", slug }) {
    if (!isValidProjectSlug(slug)) {
      throw new Error("Slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
    }

    const now = new Date().toISOString();
    const previousProjects = readPublishedProjects();
    const existingProject = previousProjects.find((project) => project.slug === slug);
    const publishedProject: PublishedProject = {
      id: existingProject?.id ?? page.id ?? `published-${slug}`,
      title: page.title,
      slug,
      page: {
        ...page,
        slug,
      },
      status: "PUBLISHED",
      paymentStatus,
      createdAt: existingProject?.createdAt ?? now,
      updatedAt: now,
      publishedAt: now,
    };

    writePublishedProjects([
      ...previousProjects.filter((project) => project.slug !== slug),
      publishedProject,
    ]);

    return publishedProject;
  },
};

export function getPublishedProjectBySlug(slug: string) {
  return localStorageProjectRepository.getPublishedProjectBySlug(slug);
}

export function publishProject(input: PublishProjectInput) {
  return localStorageProjectRepository.publishProject(input);
}
