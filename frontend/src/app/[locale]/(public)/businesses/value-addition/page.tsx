"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  Factory,
  Building2,
  Layers,
  Gem,
  FlaskConical,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Wrench,
  ChevronRight,
  ArrowDownRight,
  Maximize2,
  Coins,
  Repeat,
} from "lucide-react";

export default function ValueAdditionPage() {
  const locale = useLocale();
  const isAm = locale === "am";

  // Selected transformation story tab
  const [activeStoryStage, setActiveStoryStage] = useState<number>(0);

  const transformationNarrative = [
    {
      step: "01",
      title: isAm ? "የተፈጥሮ ማዕድን ሀብት" : "Raw Geological Endowment",
      subtitle: isAm ? "በሀገር ውስጥ የሚገኙ ማዕድናት" : "Exploration & Extraction",
      desc: isAm
        ? "የኢትዮጵያ ምድር በኖራ ድንጋይ፣ በኳርትዝ፣ በካኦሊን፣ በታንታላይት፣ በብረት እና በከበሩ ድንጋዮች እጅግ የበለፀገ ነው። እነዚህን ሀብቶች በጥሬያቸው ከመላክ ይልቅ በሀገር ውስጥ እሴት የመጨመር ስትራቴጂ ተቀርጿል።"
        : "Ethiopia possesses world-class deposits of industrial minerals, high-purity limestone, structural clays, quartz sands, and rare colored gemstones. Retaining these resources for domestic processing forms the foundation of modern national industrialization.",
      tag: isAm ? "የመጀመሪያ ጥሬ ዕቃ" : "Domestic Inflow",
    },
    {
      step: "02",
      title: isAm ? "ማበልፀግ እና ደረጃ ማሻሻል" : "Mineral Dressing & Beneficiation",
      subtitle: isAm ? "ቆሻሻን ማስወገድ እና ይዘት ማሳደግ" : "Upgrading & Refining",
      desc: isAm
        ? "የጥሬ ድንጋዮች ቆሻሻ በሜካኒካል እና ፊዚካላዊ ዘዴዎች ተወግዶ፣ የንጥረ ነገራቸው ይዘት (Grade) ለፋብሪካ ማቅለጥ እና ለማኑፋክቸሪንግ በሚስማማ ደረጃ ይበለፅጋል።"
        : "Raw run-of-mine ores undergo comminution, optical sorting, and physical concentration to strip gangue impurities, delivering compliant, calibrated feedstocks to domestic smelters, kilns, and foundries.",
      tag: isAm ? "የጥራት ደረጃ ማሻሻያ" : "Physical Refinement",
    },
    {
      step: "03",
      title: isAm ? "የሙቀት እና ኬሚካላዊ ቅንብር" : "Thermal & Chemical Synthesis",
      subtitle: isAm ? "ማቅለጥ፣ ማቃጠል እና መቅረፅ" : "Downstream Manufacturing",
      desc: isAm
        ? "በከፍተኛ የሙቀት እቶኖች እና ፋውንደሪዎች ውስጥ ማዕድናቱ ወደ ሲሚንቶ ክሊንከር፣ የቀለጡ ብረታብረቶች፣ የሴራሚክ ሰሌዳዎች እና የመስታወት ውጤቶች ይቀየራሉ።"
        : "Through controlled calcination, glass melting tanks, and metallurgical induction foundries, beneficiated mineral matrices undergo physical-chemical transformation into high-strength structural materials.",
      tag: isAm ? "የፋብሪካ ሂደት" : "Factory Transformation",
    },
    {
      step: "04",
      title: isAm ? "የተጠናቀቁ የኢንዱስትሪ ምርቶች" : "Engineered Industrial Products",
      subtitle: isAm ? "የግንባታ፣ የኢንዱስትሪ እና የገበያ ውጤቶች" : "Commercial Goods",
      desc: isAm
        ? "የተጠናቀቁ ፖርትላንድ ሲሚንቶዎች፣ የሴራሚክ ንጣፎች፣ ጠፍጣፋ መስታወቶች፣ የተወለወሉ ጌጣጌጦች እና ማዳበሪያዎች ለሀገር ውስጥ ግንባታ እና ኤክስፖርት ይቀርባሉ።"
        : "Finished cement binders, architectural vitreous tiles, container glass bottles, precision casting components, calibrated jewels, and agricultural conditioners ready for domestic and international markets.",
      tag: isAm ? "የገበያ ውጤት" : "End Products",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-20">
      {/* Editorial Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs font-serif tracking-widest text-slate-500 uppercase"
      >
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {isAm ? "መነሻ" : "Home"}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/businesses`} className="hover:text-primary transition-colors">
          {isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development"}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          {isAm ? "እሴት መጨመር እና ማኑፋክቸሪንግ" : "Value Addition & Manufacturing"}
        </span>
      </nav>

      {/* SECTION 2: Mineral-to-Market Storytelling Journey */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold px-3 py-1 bg-primary/10 rounded-full">
            {isAm ? "የእሴት ሰንሰለት ጉዞ" : "MINERAL-TO-MARKET JOURNEY"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white">
            {isAm
              ? "ከተፈጥሮ ክምችት እስከ ገበያ ዝግጁ ምርት ድረስ ያለው ሂደት"
              : "The Connected Industrial Transformation Continuum"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isAm
              ? "እያንዳንዱ የማዕድን ሀብት በሳይንሳዊ ደረጃ ተጣርቶ እና ተቀነባብሮ ወደ ተጠናቀቀ የኢንዱስትሪ እሴት የሚሸጋገርበት ቅደም ተከተል"
              : "Follow how raw geological endowments progress through refining, synthesis, and manufacturing to satisfy domestic industrial demand."}
          </p>
        </div>

        {/* 4-Step Interactive Transformation Journey Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {transformationNarrative.map((item, index) => {
            const isCurrent = activeStoryStage === index;
            return (
              <button
                key={index}
                onClick={() => setActiveStoryStage(index)}
                className={`text-left p-6 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                  isCurrent
                    ? "bg-white dark:bg-slate-900 border-primary shadow-lg ring-1 ring-primary"
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isCurrent
                        ? "bg-primary text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    PHASE {item.step}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">{item.tag}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-primary mb-3">{item.subtitle}</p>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Five Material Application Showcases (Editorial Mosaic) */}
      <section className="space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            {isAm ? "የማኑፋክቸሪንግ ዘርፎች" : "CORE APPLICATION DOMAINS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 dark:text-white mt-1">
            {isAm
              ? "አምስት ቁልፍ የማዕድን ውጤቶች እና የኢንዱስትሪ መስኮች"
              : "Five Priority Mineral-Based Manufacturing Sectors"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {isAm
              ? "የሀገር ውስጥ ማዕድናትን ወደ ተጠናቀቁ ምርቶች በመቀየር የውጭ ምርትን የሚተኩ ዋና ዋና የኢንዱስትሪ ዘርፎች"
              : "In-depth breakdown of downstream industries powered by domestic mineral feedstocks, processing diagnostics, and technical quality standards."}
          </p>
        </div>

        {/* SHOWCASE 1: Cement & Construction Binders (Lead Editorial Split Feature) */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {isAm ? "ቀዳሚ ስልታዊ ዘርፍ // ሲሚንቶ" : "FLAGSHIP SECTOR // CONSTRUCTION BINDERS"}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                  {isAm
                    ? "የሲሚንቶ፣ የኖራ እና የግንባታ ማጣበቂያዎች ኢንዱስትሪ"
                    : "Cement Clinker Optimization & Supplementary Cementitious Materials (SCMs)"}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {isAm
                    ? "የኢትዮጵያ ግዙፍ የመሠረተ ልማት እና የከተሞች ግንባታ ከፍተኛ የሲሚንቶ አቅርቦትን ይፈልጋል። ተቋሙ የሀገር ውስጥ የኖራ ድንጋይ፣ ሸክላ፣ ጂፕሰም እና የእሳተ ገሞራ ፖዞላና ጥራትን በመመርመር የሲሚንቶ ክሊንከርን የማቃጠል ሙቀት መቀነስን፣ የሃይል ፍጆታን መቆጠብን እና የተሻሻሉ ፖዞላኒክ ሲሚንቶዎችን ማምረትን በቴክኒክ ይደግፋል።"
                    : "Cement manufacturing represents the largest domestic consumer of industrial limestone, clay, gypsum, and volcanic pozzolana. MIDI supports cement factories in characterizing raw meal burnability, optimizing silica-alumina-iron ratios, and formulating pozzolanic blends that lower clinker factor, curtail thermal energy costs, and produce high-strength construction binders."}
                </p>

                {/* Technical Feedstocks vs Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="text-[11px] font-mono text-slate-500 uppercase">
                      {isAm ? "የጥሬ ዕቃ ግብዓቶች" : "Primary Mineral Feedstocks"}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAm
                        ? "የኖራ ድንጋይ፣ ጂፕሰም፣ ሸክላ፣ ፖዞላና፣ ፑሚስ"
                        : "High-grade Limestone, Gypsum, Pozzolana, Basalt & Pumice"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="text-[11px] font-mono text-primary uppercase">
                      {isAm ? "የተጠናቀቁ ምርቶች" : "Manufactured Products"}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAm
                        ? "ኦርዲናሪ ፖርትላንድ ሲሚንቶ (OPC)፣ ፖዞላኒክ ሲሚንቶ (PPC)፣ ኖራ"
                        : "Ordinary Portland Cement (OPC), Pozzolanic Cement (PPC), Quicklime"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ISO 9001 / EN 197-1 STANDARDS</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isAm ? "ከፍተኛ የሀገር ውስጥ አቅም" : "MAJOR IMPORT SUBSTITUTION"}
                </span>
              </div>
            </div>

            {/* Right: Technical Infographic Feature Block (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  {isAm ? "የቴክኒክ ምርመራ እና ውጤት" : "TECHNICAL OPTIMIZATION FOCUS"}
                </span>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-xs font-mono text-slate-400">
                      {isAm ? "የኖራ ድንጋይ ንፅህና (CaCO3)" : "Limestone Calcium Carbonate (CaCO3)"}
                    </p>
                    <p className="text-xl font-bold text-white font-mono">&gt; 80% – 92% Purity</p>
                    <p className="text-[11px] text-slate-400">
                      {isAm ? "የክሊንከር ጥራት ማረጋገጫ" : "Required for stable alite phase formation"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <p className="text-xs font-mono text-slate-400">
                      {isAm ? "የፖዞላና ኬሚካላዊ ምላሽ" : "Pozzolanic Activity Index (PAI)"}
                    </p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">&gt; 75% at 28 Days</p>
                    <p className="text-[11px] text-slate-400">
                      {isAm ? "የሙቀት ሃይል እና የካርቦን ቅነሳ" : "Replaces clinker, reducing kiln thermal energy"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {isAm
                  ? "ተቋሙ ለሲሚንቶ አምራቾች የላቦራቶሪ ትንተና እና የማማከር ድጋፍ ይሰጣል"
                  : "Assisting national cement plants with raw mix burnability and compressive testing"}
              </div>
            </div>
          </div>
        </div>

        {/* SHOWCASE 2: Architectural Ceramics & Container Glass (Alternating Feature) */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Spec Highlights (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 order-2 lg:order-1">
              <div className="space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                  {isAm ? "የሲሊካ እና ካኦሊን ማጣሪያ" : "HIGH-PURITY SILICA & KAOLIN"}
                </span>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <p className="text-xs font-mono text-slate-400">
                      {isAm ? "የሲሊካ አሸዋ ንፅህና (SiO2)" : "Silica Sand Purity (SiO2)"}
                    </p>
                    <p className="text-xl font-bold text-white font-mono">&gt; 98.5% – 99.2%</p>
                    <p className="text-[11px] text-slate-400">
                      {isAm ? "ብረት እና ቲታኒየም በከፍተኛ ሁኔታ እንዲቀነስ ይደረጋል" : "Iron oxide (Fe2O3) reduced below 0.03% for clear glass"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <p className="text-xs font-mono text-slate-400">
                      {isAm ? "የሴራሚክ ሸክላ ማቃጠል ነጭነት" : "Kaolin Fired Whiteness Index"}
                    </p>
                    <p className="text-xl font-bold text-blue-300 font-mono">&gt; 82% Reflectance</p>
                    <p className="text-[11px] text-slate-400">
                      {isAm ? "ለወለል ንጣፎች እና ለንፅህና መጠበቂያ ሴራሚክስ" : "Essential for vitreous porcelain tiles and sanitaryware"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {isAm
                  ? "የሀገር ውስጥ የኳርትዝ እና የካኦሊን ማዕድናትን ወደ ንፁህ ጥሬ ዕቃነት መቀየር"
                  : "Upgrading domestic silica sand to substitute expensive imported glass batch fluxes"}
              </div>
            </div>

            {/* Right: Narrative Details (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between order-1 lg:order-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider font-bold">
                  <Layers className="w-4 h-4" />
                  <span>
                    {isAm ? "የግንባታ እሴት // ሴራሚክስ እና መስታወት" : "STRUCTURAL MATERIALS // CERAMICS & GLASS"}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                  {isAm
                    ? "ሴራሚክስ እና የመስታወት ማኑፋክቸሪንግ እሴት ጭማሪ"
                    : "Architectural Ceramics, Vitrified Tiles & Container Glass"}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {isAm
                    ? "ኢትዮጵያ ለግንባታ የሚያስፈልጉ በርካታ የሴራሚክ ንጣፎችን እና የመስታወት ምርቶችን በከፍተኛ የውጭ ምንዛሬ ከውጭ ስታስገባ ቆይታለች። በሀገር ውስጥ የሚገኙ የሲሊካ አሸዋ፣ ኳርትዝ፣ ፌልድስፓር እና ካኦሊን ማዕድናት በላቦራቶሪ ተፈትሸው እና ተጣርተው የብረት ይዘታቸው ሲቀነስ፣ ከፍተኛ ጥራት ያላቸው የመስታወት እና የሴራሚክ ፋብሪካዎች ጥሬ ዕቃ እንዲሆኑ ይደረጋል።"
                    : "Domestic building construction has historically relied heavily on imported ceramic tiles, sanitaryware, and container glass. By conducting beneficiation diagnostics to remove iron-bearing staining impurities from local silica sand and white-firing kaolin deposits, MIDI facilitates the domestic production of high-grade architectural flat glass and sanitary ceramics."}
                </p>

                {/* Feedstock vs Product Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="text-[11px] font-mono text-slate-500 uppercase">
                      {isAm ? "የማዕድን ግብዓቶች" : "Mineral Raw Materials"}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAm
                        ? "የሲሊካ አሸዋ፣ ፌልድስፓር፣ ካኦሊን፣ ኳርትዝ፣ ዶሎማይት"
                        : "High-Silica Quartz, Feldspar, Kaolin Clays & Dolomite"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="text-[11px] font-mono text-primary uppercase">
                      {isAm ? "የተጠናቀቁ ውጤቶች" : "End Products"}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAm
                        ? "የወለልና የግድግዳ ንጣፎች (Tiles)፣ የንፅህና መጠበቂያ ሴራሚክስ፣ ጠርሙስ"
                        : "Vitrified Floor Tiles, Sanitaryware, Flat Architectural Glass"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>EN 14411 CERAMIC TILE CLASSIFICATION</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {isAm ? "ከፍተኛ የገበያ ፍላጎት" : "HIGH NATIONAL DEMAND"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SHOWCASES 3, 4, 5: Asymmetric Tri-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Showcase 3: Metallurgy & Foundries */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                  {isAm ? "ብረታብረት እና ቀረጣ" : "METALLURGY & CASTING"}
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-950 dark:text-white mt-1">
                  {isAm ? "ብረታብረት እና የፋውንደሪ ውጤቶች" : "Metallurgical Foundries & Cast Components"}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAm
                  ? "የሀገር ውስጥ የብረታብረት ማቅለጥ እቶኖች እና ፋውንደሪዎች ለኢንዱስትሪዎች እና ለእርሻ ማሽነሪዎች የሚያስፈልጉ ወሳኝ መለዋወጫዎችን (Impellers, Gears, Grinding Media) በጥራት እንዲያመርቱ የቀረጣ አሸዋ እና የብረት ውህድ ሙከራዎችን ማካሄድ።"
                  : "Foundry sand testing, mold permeability analysis, charge calculation, and induction melting diagnostics. Assisting domestic foundries in manufacturing precision replacement machinery spares, grinding balls, and wear-resistant alloy castings."}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-mono text-slate-500 uppercase">
                {isAm ? "ዋና ምርቶች" : "Key Outputs"}
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isAm
                  ? "የማሽነሪ መለዋወጫዎች፣ የግንባታ ብረት፣ የተጣሉ የፓምፕ ክፍሎች"
                  : "Precision Cast Machinery Parts, Grinding Media & Structural Rebar"}
              </p>
            </div>
          </div>

          {/* Showcase 4: Gemstone Lapidary & Jewelry (Features Genuine Gemstone Images) */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Gem className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  {isAm ? "የከበሩ ድንጋዮች" : "GEMSTONE CRAFT"}
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-950 dark:text-white mt-1">
                  {isAm ? "የላፒዳሪ እሴት ጭማሪ እና ጌጣጌጥ" : "Gemstone Lapidary & Certified Jewelry"}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAm
                  ? "ጥሬ ኦፓል፣ መረግድ እና ሳፋየርን ያለ እሴት ጭማሪ በርካሽ ከመሸጥ ይልቅ በዘመናዊ ላፒዳሪ በመቁረጥ፣ በማወልወል እና ደረጃቸውን የጠበቁ ጌጣጌጦችን በማዘጋጀት የሀገሪቱን የውጭ ምንዛሬ ገቢ በበርካታ እጥፍ ማሳደግ።"
                  : "Transitioning from exporting unpolished rough gemstones to high-margin precision faceting, tumbling, and standardized jewel certification. Transforming Wollo opal, Shakiso emerald, and Tigray sapphire into international-grade jewelry."}
              </p>

              {/* Gemstone Thumbnail Visual Matrix */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="relative h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                  <Image
                    src="/gems/opal.jpg"
                    alt="Ethiopian Opal"
                    fill
                    className="object-cover hover:scale-110 transition-transform"
                    sizes="100px"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                    <span className="text-[9px] font-mono text-white font-bold">OPAL</span>
                  </div>
                </div>
                <div className="relative h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                  <Image
                    src="/gems/emerald.jpg"
                    alt="Ethiopian Emerald"
                    fill
                    className="object-cover hover:scale-110 transition-transform"
                    sizes="100px"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                    <span className="text-[9px] font-mono text-white font-bold">EMERALD</span>
                  </div>
                </div>
                <div className="relative h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                  <Image
                    src="/gems/sapphire.webp"
                    alt="Ethiopian Sapphire"
                    fill
                    className="object-cover hover:scale-110 transition-transform"
                    sizes="100px"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                    <span className="text-[9px] font-mono text-white font-bold">SAPPHIRE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-mono text-slate-500 uppercase">
                {isAm ? "ዋና ምርቶች" : "Key Outputs"}
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isAm
                  ? "የተወለወሉ ድንጋዮች (Facetted Gems)፣ የተጠናቀቁ ጌጣጌጦች"
                  : "Calibrated Faceted Stones, Certified Cabochons & Fine Jewelry"}
              </p>
            </div>
          </div>

          {/* Showcase 5: Agro-Minerals & Soil Neutralizers */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FlaskConical className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                  {isAm ? "የግብርና ትስስር" : "AGRO-INDUSTRIAL LINKAGE"}
                </span>
                <h4 className="text-xl font-serif font-bold text-slate-950 dark:text-white mt-1">
                  {isAm ? "የግብርና ማዕድናት እና የአፈር ማከሚያ ኖራ" : "Agro-Lime & Soil Conditioners"}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAm
                  ? "በአሲዳማ አፈር ምክንያት የሚከሰተውን የሰብል ምርታማነት መቀነስ ለመከላከል፣ የሀገር ውስጥ የኖራ ድንጋይ እና የዶሎማይት ማዕድናትን ወደ አፈር ማከሚያ ኖራ (Ag-Lime) በመቀየር የግብርና ምርታማነትን ማሳደግ።"
                  : "Processing regional dolomitic limestone into micronized agricultural lime (Ag-lime). Neutralizing acidic farm soils across the Ethiopian highlands to unlock fertilizer efficiency and restore national grain productivity."}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-mono text-slate-500 uppercase">
                {isAm ? "ዋና ምርቶች" : "Key Outputs"}
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isAm
                  ? "የአፈር ማከሚያ ኖራ (Ag-Lime)፣ የተቀላቀሉ ማዳበሪያዎች"
                  : "Micronized Soil Neutralizers, Blend Conditioners & Mineral Feed"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Closing Editorial Call-to-Action */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            {isAm ? "ተቋማዊ ሀብቶች እና ህትመቶች" : "RESEARCH MONOGRAPHS & TECHNICAL SERVICES"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
            {isAm
              ? "የማዕድን እሴት ጭማሪ ጥናቶችን እና የቴክኒክ መመሪያዎችን ያስሱ"
              : "Access Value Addition Feasibility Studies & Processing Guides"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {isAm
              ? "በሲሚንቶ፣ በሴራሚክስ፣ በመስታወት እና በላፒዳሪ ዙሪያ የተዘጋጁ ቴክኒካዊ ጥናቶችን በህትመቶች ገጻችን ይመልከቱ ወይም የላቦራቶሪ ፍተሻ አገልግሎት ይጠይቁ።"
              : "Review verified institutional publications on mineral utilization feasibility or consult with MIDI technical specialists to test mineral feedstocks."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Link
            href={`/${locale}/publications`}
            className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm shadow-sm hover:bg-primary/95 transition-all group"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{isAm ? "የህትመቶች ማህደር" : "Publications Module"}</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all"
          >
            <Wrench className="w-4 h-4 mr-2 text-primary" />
            <span>{isAm ? "የቴክኒክ አገልግሎቶች" : "Technical Diagnostics"}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
