import { PublishedProjectClient } from "@/components/site/PublishedProjectClient";

type PublishedPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublishedPage({ params }: PublishedPageProps) {
  const { slug } = await params;

  return <PublishedProjectClient slug={decodeURIComponent(slug)} />;
}
