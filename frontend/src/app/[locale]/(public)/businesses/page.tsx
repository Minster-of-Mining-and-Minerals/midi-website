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
      title: isAm ? "የላቦራቶሪ እና አውደ ጥናት ማዕከላት" : "Laboratories & Pilot Facilities",
      description: isAm
        ? "የላቁ የኤክስሬይ (XRF/XRD) ማዕድን ምርመራዎች እና የስልጠና ወርክሾፖችን ይመልከቱ።"
        : "Explore certified mineral characterization, assay laboratories, and foundry workshops.",
      href: `/${locale}/facilities`,
      icon: Building2,
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

      {/* 2. Four Prominent Navigation Cards Linking to the Expanded Section Pages */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-primary font-semibold tracking-wider text-xs md:text-sm uppercase px-3 py-1 bg-primary/10 rounded-full">
            {isAm ? "የተቋማዊ ስራዎች አቅጣጫ" : "Core Technical Development Areas"}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-3 mb-3">
            {isAm
              ? "የማዕድን ኢንዱስትሪ ልማት ዋና ዋና ክፍሎችን ያስሱ"
              : "Explore the Mineral Industry Development Areas"}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            {isAm
              ? "ተቋሙ በማዕድን ሚኒስቴር ስር የተሰጠውን ተልዕኮ ለመወጣት የሚያከናውናቸውን ቁልፍ የቴክኒክ ድጋፎች፣ የምርምር ዘርፎች እና የእሴት ጭማሪ መስኮች ዝርዝር ይመልከቱ።"
              : "Examine the dedicated institutional areas guiding technical diagnostics, mineral dressing, downstream manufacturing, and technological adaptation across Ethiopia."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionPages.map((page, idx) => {
            const Icon = page.icon;
            return (
              <Link
                key={idx}
                href={page.href}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full border border-amber-500/20">
                      {page.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {page.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                    {page.description}
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{isAm ? "ሙሉ ዝርዝሩን ይመልከቱ" : "Explore Section"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Four Strategic Development Pillars */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-primary font-semibold tracking-wider text-xs md:text-sm uppercase px-3 py-1 bg-primary/10 rounded-full">
            {isAm ? "የኢንዱስትሪ ልማት ምሰሶዎች" : "Strategic Development Pillars"}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-3 mb-4">
            {isAm
              ? "የማዕድን ሀብትን ወደ ኢንዱስትሪ ምርት የመቀየር ስልት"
              : "Transforming Raw Mineral Wealth into Industrial Production"}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            {isAm
              ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) በጥሬ የተፈጥሮ ማዕድን ሀብቶች እና በዘመናዊ የማኑፋክቸሪንግ ኢንዱስትሪዎች መካከል ያለውን የቴክኖሎጂ እና አቅም ክፍተት ይሞላል።"
              : "The Mineral Industry Development Institute (MIDI) accelerates national industrialization by bridging the gap between raw geological resources and advanced domestic manufacturing."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
                      {pillar.tag}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Cross-Module Institutional Links */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700/60">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              {isAm
                ? "ከተቋማዊ አገልግሎቶቻችን እና ማዕከሎቻችን ጋር ይገናኙ"
                : "Explore MIDI's Specialized Capabilities & Facilities"}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              {isAm
                ? "ለማዕድን አምራቾች፣ አቀነባባሪዎች እና ባለሀብቶች የተዘጋጁ የላቦራቶሪ ምርመራዎች፣ ቴክኒካዊ ማማከሪያዎች እና የምርምር ሰነዶች።"
                : "Comprehensive institutional infrastructure supporting mineral producers, industrial processors, and development partners across Ethiopia."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {institutionalLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h5 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors mb-1.5">
                      {item.title}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
                    <span>{isAm ? "ይመልከቱ" : "View"}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}