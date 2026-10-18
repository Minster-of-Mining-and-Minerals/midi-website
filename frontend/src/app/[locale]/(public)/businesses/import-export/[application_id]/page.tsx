import { redirect } from "next/navigation";

export default async function BusinessesApplicationRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; application_id: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/businesses`);
}