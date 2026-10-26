import React from "react";
import Link from "next/link";
import OurBusinesses from "@/components/pages/businesses-page-components/OurBusinesses";
import {
  Layers,
  Factory,
  Cpu,
  FlaskConical,
  Building2,
  Wrench,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
} from "lucide-react";

export default async function BusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAm = locale === "am";

  // Four dedicated sub-page navigation cards
  const sectionPages = [
    {
      title: isAm ? "የልማት አጠቃላይ እይታ" : "Development Overview",
      description: isAm
        ? "በስልታዊ የማዕድን ምርቶች ላይ የተዘረጋ ተቋማዊ የቴክኒክ ድጋፍ ማዕቀፍ እና ቀዳሚ የትኩረት መስኮች።"
        : "Institutional support framework, priority technical focus areas, and specialized industrial engineering capabilities.",
      href: `/${locale}/businesses/overview`,
      icon: ShieldCheck,
      badge: isAm ? "ተቋማዊ ማዕቀፍ" : "Technical Framework",
    },
    {
      title: isAm ? "የማዕድን ማቀነባበሪያ እና ማበልፀጊያ" : "Mineral Processing & Beneficiation",
      description: isAm
        ? "የኦር ባህሪ ጥናት፣ መፍጨት፣ የስበት እና የፍሎቴሽን አካላዊ የማጣሪያ ቴክኖሎጂዎች።"
        : "Ore characterization, comminution, gravity concentration, froth flotation, and recovery optimization.",
      href: `/${locale}/businesses/mineral-processing`,
      icon: Layers,
      badge: isAm ? "ማጣራት እና ማበልፀግ" : "Ore Upgrading",
    },
    {
      title: isAm ? "እሴት መጨመር እና ማኑፋክቸሪንግ" : "Mineral-Based Manufacturing",
      description: isAm
        ? "የሀገር ውስጥ ማዕድናትን ወደ ሲሚንቶ፣ ሴራሚክስ፣ መስታወት፣ ብረታብረት እና ጌጣጌጥ መቀየር።"
        : "Transforming domestic mineral feedstocks into cement, structural ceramics, glass, foundries, and lapidary.",
      href: `/${locale}/businesses/value-addition`,
      icon: Factory,
      badge: isAm ? "የውጭ ምርት መተካት" : "Value Addition",
    },
    {
      title: isAm ? "ተግባራዊ ምርምር እና ቴክኖሎጂ ሽግግር" : "Applied Research & Innovation",
      description: isAm
        ? "ኢንዱስትሪ-መር ምርምር፣ የሙከራ ፍሰት-ንድፍ ግምገማ፣ የቴክኖሎጂ ማላመድ እና የህትመት ውጤቶች።"
        : "Bench-scale testing, pilot trials, metallurgical solutions, and technical knowledge dissemination.",
      href: `/${locale}/businesses/research-innovation`,
      icon: FlaskConical,
      badge: isAm ? "ኢኖቬሽን" : "Technology Transfer",
    },
  ];

  // Four thematic pillars
  const pillars = [
    {
      icon: Layers,
      title: isAm ? "ማዕድናትን ማበልፀግ እና ማጣራት" : "Mineral Beneficiation & Dressing",
      description: isAm
        ? "የማዕድን ይዘትን ለማሳደግ፣ ቆሻሻዎችን ለማስወገድ እና ጥራት ያላቸውን ክምችቶች ለማዘጋጀት የሚደረግ የመፍጨት፣ የማጣራት፣ የፍሎቴሽን እና መግነጢሳዊ መለያየት ተግባር።"
        : "Crushing, grinding, flotation, and magnetic separation processes designed to upgrade run-of-mine ore grades and create high-purity industrial concentrates.",
      tag: isAm ? "የመጀመሪያ ደረጃ ማጣራት" : "Primary Upgrading",
    },
    {
      icon: Factory,
      title: isAm ? "እሴት የተጨመረበት ማኑፋክቸሪንግ" : "Value-Added Manufacturing",
      description: isAm
        ? "የሀገር ውስጥ ማዕድናትን ወደ ሲሚንቶ፣ የላቁ ሴራሚክስ፣ የመስታወት ምርቶች፣ የተወለወሉ የከበሩ ድንጋዮች እና የግንባታ ብረታብረት በመቀየር የውጭ ምንዛሬን ማዳን።"
        : "Conversion of domestic minerals into Portland cement, architectural ceramics, container glass, cut gemstones, and structural steel for national development.",
      tag: isAm ? "የውጭ ምርት መተካት" : "Import Substitution",
    },
    {
      icon: Cpu,
      title: isAm ? "የኢንዱስትሪ ትስስር እና አተገባበር" : "Strategic Industrial Linkages",
      description: isAm
        ? "በጥሬ ማዕድን አውጪዎች እና በሀገር ውስጥ የማኑፋክቸሪንግ ኢንዱስትሪዎች መካከል ቀጥተኛ የግብዓት ትስስር በመፍጠር የተረጋጋ የሀገር ውስጥ አቅርቦት ማረጋገጥ።"
        : "Creating formal backward and forward linkages between mineral extraction operations and domestic industrial producers to build resilient domestic supply chains.",
      tag: isAm ? "የአቅርቦት ሰንሰለት" : "Supply Integration",
    },
    {
      icon: FlaskConical,
      title: isAm ? "የተግባራዊ ምርምር እና ቴክኖሎጂ ሽግግር" : "Applied R&D & Technology Transfer",
      description: isAm
        ? "ለአዳዲስ የማዕድን ክምችቶች የሂደት ማረጋገጫ መስጠት፣ የሞዴል እና ቀረጣ ቴክኒካዊ ድጋፍ ማድረግ እና ዘመናዊ አሰራሮችን ወደ አምራቾች ማሸጋገር።"
        : "Developing pilot-scale beneficiation flowsheets, metallurgical foundry trials, and adapting energy-efficient processing technologies for local industries.",
      tag: isAm ? "ኢኖቬሽን" : "Sector Innovation",
    },
  ];

  // Cross-module institutional links
  const institutionalLinks = [
    {
      title: isAm ? "ተቋማዊ ማዕቀፍ እና አጠቃላይ እይታ" : "Technical Framework & Overview",
      description: isAm
        ? "የተቋሙን ስትራቴጂካዊ የቴክኒክ ማዕቀፍ እና የልማት ፕሮግራሞች ይመልከቱ።"
        : "Explore institutional technical framework, testing criteria, and development programs.",
      href: `/${locale}/businesses/overview`,
      icon: Layers,
    },
    {
      title: isAm ? "የቴክኒክ የማማከር አገልግሎቶች" : "Technical Advisory Services",
      description: isAm
        ? "የፋብሪካ ምርታማነት ማሻሻያ፣ የጥራት ቁጥጥር እና የቅድመ አዋጭነት ጥናቶች።"
        : "Discover plant productivity diagnostics, feasibility studies, and metallurgical troubleshooting.",
      href: `/${locale}/services`,
      icon: Wrench,
    },
    {
      title: isAm ? "የምርምር ህትመቶች እና ካርታዎች" : "Research & Publications",
      description: isAm
        ? "የተቋሙን የቴክኒክ ሪፖርቶች፣ የማዕድን ካርታዎች እና መመሪያዎች ያንብቡ።"
        : "Access institutional research findings, mineral occurrence maps, and technical guidelines.",
      href: `/${locale}/publications`,
      icon: BookOpen,
    },
    {
      title: isAm ? "የMIDI 5-ዓመት ፕሮጀክት" : "5-Year Flagship Project",
      description: isAm
        ? "የላቁ የልህቀት ማዕከላትን እና 520+ ባለሙያዎችን የማፍራት ብሔራዊ ፕሮጀክት።"
        : "National flagship program building Centers of Excellence and 520+ specialized professionals.",
      href: `/${locale}/midi-project`,
      icon: Compass,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-16">
      {/* 1. Interactive Mineral Value Chain Section */}
      <OurBusinesses />
    </div>
  );
}