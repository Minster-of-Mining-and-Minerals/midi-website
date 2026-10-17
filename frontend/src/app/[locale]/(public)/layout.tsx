import type { Metadata } from "next";
import PublicNavbar from "@/components/public-layout/nav-bar";
import Footer from "@/components/public-layout/footer";

export const metadata: Metadata = {
    title: "Mineral Industry Development Institute (MIDI)",
    description: "Official portal of the Mineral Industry Development Institute (MIDI), Ministry of Mines, Federal Democratic Republic of Ethiopia.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative bg-[#f7f9fc] w-full min-h-screen flex flex-col">
            <PublicNavbar />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </div>
    );
}
