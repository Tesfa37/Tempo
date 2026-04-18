import { redirect } from "next/navigation";

export default async function TryOnSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/fit/${slug}`);
}
