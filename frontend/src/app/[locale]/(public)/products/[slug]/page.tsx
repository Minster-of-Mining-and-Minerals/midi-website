import { redirect } from "next/navigation";

export default async function ProductDetailRedirectPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    redirect(`/${locale}/publications/${slug}`);
}
