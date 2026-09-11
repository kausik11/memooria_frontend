import { redirect } from "next/navigation";
export default async function ProfileAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  redirect(`/creator/${encodeURIComponent((await params).slug)}`);
}
