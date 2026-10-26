"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Building2, Layers, Factory, Gem, FlaskConical, BookOpen, Wrench } from "lucide-react";

export default function ValueAdditionPage() {
  const locale = useLocale();
  const isAm = locale === "am";

  // Selected transformation step and manufacturing sector
  const [activeStoryStage, setActiveStoryStage] = useState<number>(0);
  const [activeSectorId, setActiveSectorId] = useState<string>("cement");

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

  // Five priority manufacturing sectors (previously five stacked showcases)
  const sectors = [
    {
      id: "cement",
      icon: Building2,
      name: isAm ? "የሲሚንቶ፣ የኖራ እና የግንባታ ማጣበቂያዎች ኢንዱስትሪ" : "Cement, Lime & Construction Binders",
      tag: isAm ? "ቀዳሚ ስልታዊ ዘርፍ // ሲሚንቶ" : "FLAGSHIP SECTOR // CONSTRUCTION BINDERS",
      heading: isAm
        ? "የሲሚንቶ፣ የኖራ እና የግንባታ ማጣበቂያዎች ኢንዱስትሪ"
        : "Cement Clinker Optimization & Supplementary Cementitious Materials (SCMs)",
      desc: isAm
        ? "የኢትዮጵያ ግዙፍ የመሠረተ ልማት እና የከተሞች ግንባታ ከፍተኛ የሲሚንቶ አቅርቦትን ይፈልጋል። ተቋሙ የሀገር ውስጥ የኖራ ድንጋይ፣ ሸክላ፣ ጂፕሰም እና የእሳተ ገሞራ ፖዞላና ጥራትን በመመርመር የሲሚንቶ ክሊንከርን የማቃጠል ሙቀት መቀነስን፣ የሃይል ፍጆታን መቆጠብን እና የተሻሻሉ ፖዞላኒክ ሲሚንቶዎችን ማምረትን በቴክኒክ ይደግፋል።"
        : "Cement manufacturing represents the largest domestic consumer of industrial limestone, clay, gypsum, and volcanic pozzolana. MIDI supports cement factories in characterizing raw meal burnability, optimizing silica-alumina-iron ratios, and formulating pozzolanic blends that lower clinker factor, curtail thermal energy costs, and produce high-strength construction binders.",
      inputsLabel: isAm ? "የጥሬ ዕቃ ግብዓቶች" : "Primary Mineral Feedstocks",
      inputs: isAm ? "የኖራ ድንጋይ፣ ጂፕሰም፣ ሸክላ፣ ፖዞላና፣ ፑሚስ" : "High-grade Limestone, Gypsum, Pozzolana, Basalt & Pumice",
      outputsLabel: isAm ? "የተጠናቀቁ ምርቶች" : "Manufactured Products",
      outputs: isAm
        ? "ኦርዲናሪ ፖርትላንድ ሲሚንቶ (OPC)፣ ፖዞላኒክ ሲሚንቶ (PPC)፣ ኖራ"
        : "Ordinary Portland Cement (OPC), Pozzolanic Cement (PPC), Quicklime",
      badge: isAm ? "ከፍተኛ የሀገር ውስጥ አቅም" : "MAJOR IMPORT SUBSTITUTION",
      standard: "ISO 9001 / EN 197-1 STANDARDS",
      focusTitle: isAm ? "የቴክኒክ ምርመራ እና ውጤት" : "TECHNICAL OPTIMIZATION FOCUS",
      metrics: [
        {
          label: isAm ? "የኖራ ድንጋይ ንፅህና (CaCO3)" : "Limestone Calcium Carbonate (CaCO3)",
          value: "> 80% – 92% Purity",
          note: isAm ? "የክሊንከር ጥራት ማረጋገጫ" : "Required for stable alite phase formation",
        },
        {
          label: isAm ? "የፖዞላና ኬሚካላዊ ምላሽ" : "Pozzolanic Activity Index (PAI)",
          value: "> 75% at 28 Days",
          note: isAm ? "የሙቀት ሃይል እና የካርቦን ቅነሳ" : "Replaces clinker, reducing kiln thermal energy",
        },
      ],
      focusNote: isAm
        ? "ተቋሙ ለሲሚንቶ አምራቾች የላቦራቶሪ ትንተና እና የማማከር ድጋፍ ይሰጣል"
        : "Assisting national cement plants with raw mix burnability and compressive testing",
    },
    {
      id: "ceramics",
      icon: Layers,
      name: isAm ? "ሴራሚክስ እና የመስታወት ማኑፋክቸሪንግ እሴት ጭማሪ" : "Ceramics, Tiles & Container Glass",
      tag: isAm ? "የግንባታ እሴት // ሴራሚክስ እና መስታወት" : "STRUCTURAL MATERIALS // CERAMICS & GLASS",
      heading: isAm
        ? "ሴራሚክስ እና የመስታወት ማኑፋክቸሪንግ እሴት ጭማሪ"
        : "Architectural Ceramics, Vitrified Tiles & Container Glass",
      desc: isAm
        ? "ኢትዮጵያ ለግንባታ የሚያስፈልጉ በርካታ የሴራሚክ ንጣፎችን እና የመስታወት ምርቶችን በከፍተኛ የውጭ ምንዛሬ ከውጭ ስታስገባ ቆይታለች። በሀገር ውስጥ የሚገኙ የሲሊካ አሸዋ፣ ኳርትዝ፣ ፌልድስፓር እና ካኦሊን ማዕድናት በላቦራቶሪ ተፈትሸው እና ተጣርተው የብረት ይዘታቸው ሲቀነስ፣ ከፍተኛ ጥራት ያላቸው የመስታወት እና የሴራሚክ ፋብሪካዎች ጥሬ ዕቃ እንዲሆኑ ይደረጋል።"
        : "Domestic building construction has historically relied heavily on imported ceramic tiles, sanitaryware, and container glass. By conducting beneficiation diagnostics to remove iron-bearing staining impurities from local silica sand and white-firing kaolin deposits, MIDI facilitates the domestic production of high-grade architectural flat glass and sanitary ceramics.",
      inputsLabel: isAm ? "የማዕድን ግብዓቶች" : "Mineral Raw Materials",
      inputs: isAm ? "የሲሊካ አሸዋ፣ ፌልድስፓር፣ ካኦሊን፣ ኳርትዝ፣ ዶሎማይት" : "High-Silica Quartz, Feldspar, Kaolin Clays & Dolomite",
      outputsLabel: isAm ? "የተጠናቀቁ ውጤቶች" : "End Products",
      outputs: isAm
        ? "የወለልና የግድግዳ ንጣፎች (Tiles)፣ የንፅህና መጠበቂያ ሴራሚክስ፣ ጠርሙስ"
        : "Vitrified Floor Tiles, Sanitaryware, Flat Architectural Glass",
      badge: isAm ? "ከፍተኛ የገበያ ፍላጎት" : "HIGH NATIONAL DEMAND",
      standard: "EN 14411 CERAMIC TILE CLASSIFICATION",
      focusTitle: isAm ? "የሲሊካ እና ካኦሊን ማጣሪያ" : "HIGH-PURITY SILICA & KAOLIN",
      metrics: [
        {
          label: isAm ? "የሲሊካ አሸዋ ንፅህና (SiO2)" : "Silica Sand Purity (SiO2)",
          value: "> 98.5% – 99.2%",
          note: isAm ? "ብረት እና ቲታኒየም በከፍተኛ ሁኔታ እንዲቀነስ ይደረጋል" : "Iron oxide (Fe2O3) reduced below 0.03% for clear glass",
        },
        {
          label: isAm ? "የሴራሚክ ሸክላ ማቃጠል ነጭነት" : "Kaolin Fired Whiteness Index",
          value: "> 82% Reflectance",
          note: isAm ? "ለወለል ንጣፎች እና ለንፅህና መጠበቂያ ሴራሚክስ" : "Essential for vitreous porcelain tiles and sanitaryware",
        },
      ],
      focusNote: isAm
        ? "የሀገር ውስጥ የኳርትዝ እና የካኦሊን ማዕድናትን ወደ ንፁህ ጥሬ ዕቃነት መቀየር"
        : "Upgrading domestic silica sand to substitute expensive imported glass batch fluxes",
    },
    {
      id: "foundries",
      icon: Factory,
      name: isAm ? "ብረታብረት እና የፋውንደሪ ውጤቶች" : "Metallurgical Foundries & Cast Components",
      tag: isAm ? "ብረታብረት እና ቀረጣ" : "METALLURGY & CASTING",
      heading: isAm ? "ብረታብረት እና የፋውንደሪ ውጤቶች" : "Metallurgical Foundries & Cast Components",
      desc: isAm
        ? "የሀገር ውስጥ የብረታብረት ማቅለጥ እቶኖች እና ፋውንደሪዎች ለኢንዱስትሪዎች እና ለእርሻ ማሽነሪዎች የሚያስፈልጉ ወሳኝ መለዋወጫዎችን (Impellers, Gears, Grinding Media) በጥራት እንዲያመርቱ የቀረጣ አሸዋ እና የብረት ውህድ ሙከራዎችን ማካሄድ።"
        : "Foundry sand testing, mold permeability analysis, charge calculation, and induction melting diagnostics. Assisting domestic foundries in manufacturing precision replacement machinery spares, grinding balls, and wear-resistant alloy castings.",
      outputsLabel: isAm ? "ዋና ምርቶች" : "Key Outputs",
      outputs: isAm
        ? "የማሽነሪ መለዋወጫዎች፣ የግንባታ ብረት፣ የተጣሉ የፓምፕ ክፍሎች"
        : "Precision Cast Machinery Parts, Grinding Media & Structural Rebar",
    },
    {
      id: "gemstones",
      icon: Gem,
      name: isAm ? "የላፒዳሪ እሴት ጭማሪ እና ጌጣጌጥ" : "Gemstone Lapidary & Certified Jewelry",
      tag: isAm ? "የከበሩ ድንጋዮች" : "GEMSTONE CRAFT",
      heading: isAm ? "የላፒዳሪ እሴት ጭማሪ እና ጌጣጌጥ" : "Gemstone Lapidary & Certified Jewelry",
      desc: isAm
        ? "ጥሬ ኦፓል፣ መረግድ እና ሳፋየርን ያለ እሴት ጭማሪ በርካሽ ከመሸጥ ይልቅ በዘመናዊ ላፒዳሪ በመቁረጥ፣ በማወልወል እና ደረጃቸውን የጠበቁ ጌጣጌጦችን በማዘጋጀት የሀገሪቱን የውጭ ምንዛሬ ገቢ በበርካታ እጥፍ ማሳደግ።"
        : "Transitioning from exporting unpolished rough gemstones to high-margin precision faceting, tumbling, and standardized jewel certification. Transforming Wollo opal, Shakiso emerald, and Tigray sapphire into international-grade jewelry.",
      outputsLabel: isAm ? "ዋና ምርቶች" : "Key Outputs",
      outputs: isAm
        ? "የተወለወሉ ድንጋዮች (Facetted Gems)፣ የተጠናቀቁ ጌጣጌጦች"
        : "Calibrated Faceted Stones, Certified Cabochons & Fine Jewelry",
      gems: [
        { src: "/gems/opal.jpg", alt: "Ethiopian Opal", label: "OPAL" },
        { src: "/gems/emerald.jpg", alt: "Ethiopian Emerald", label: "EMERALD" },
        { src: "/gems/sapphire.webp", alt: "Ethiopian Sapphire", label: "SAPPHIRE" },
      ],
    },
    {
      id: "agro",
      icon: FlaskConical,
      name: isAm ? "የግብርና ማዕድናት እና የአፈር ማከሚያ ኖራ" : "Agro-Lime & Soil Conditioners",
      tag: isAm ? "የግብርና ትስስር" : "AGRO-INDUSTRIAL LINKAGE",
      heading: isAm ? "የግብርና ማዕድናት እና የአፈር ማከሚያ ኖራ" : "Agro-Lime & Soil Conditioners",
      desc: isAm
        ? "በአሲዳማ አፈር ምክንያት የሚከሰተውን የሰብል ምርታማነት መቀነስ ለመከላከል፣ የሀገር ውስጥ የኖራ ድንጋይ እና የዶሎማይት ማዕድናትን ወደ አፈር ማከሚያ ኖራ (Ag-Lime) በመቀየር የግብርና ምርታማነትን ማሳደግ።"
        : "Processing regional dolomitic limestone into micronized agricultural lime (Ag-lime). Neutralizing acidic farm soils across the Ethiopian highlands to unlock fertilizer efficiency and restore national grain productivity.",
      outputsLabel: isAm ? "ዋና ምርቶች" : "Key Outputs",
      outputs: isAm
        ? "የአፈር ማከሚያ ኖራ (Ag-Lime)፣ የተቀላቀሉ ማዳበሪያዎች"
        : "Micronized Soil Neutralizers, Blend Conditioners & Mineral Feed",
    },
  ];

  const sector = sectors.find((s) => s.id === activeSectorId) || sectors[0];
  const story = transformationNarrative[activeStoryStage];

  return (
    <div className="flex flex-col gap-5">
      {/* Mineral-to-market journey */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {transformationNarrative.map((step, idx) => {
            const active = idx === activeStoryStage;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStoryStage(idx)}
                aria-pressed={active}
                className={`rounded-xl p-4 text-start flex flex-col gap-1 transition-colors bg-white border text-slate-900 ${
                  active ? "border-primary ring-1 ring-primary" : "border-slate-200 hover:border-primary/50"
                }`}
              >
                <span className="text-xs font-semibold text-primary">
                  {step.step} · {step.subtitle}
                </span>
                <span className="text-sm md:text-[15px] font-semibold leading-snug">{step.title}</span>
              </button>
            );
          })}
        </div>
        <p className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">{story.tag}: </span>
          {story.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sector list */}
        <nav aria-label={isAm ? "የማኑፋክቸሪንግ ዘርፎች" : "Manufacturing sectors"} className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
          <h2 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {isAm ? "አምስት ቁልፍ የማዕድን ውጤቶች እና የኢንዱስትሪ መስኮች" : "Five Priority Mineral-Based Manufacturing Sectors"}
          </h2>
          {sectors.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSectorId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSectorId(item.id)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-start text-sm font-semibold transition-colors ${
                  active ? "bg-primary/10 text-slate-900" : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-primary" />
                <span className="leading-snug">{item.name}</span>
              </button>
            );
          })}
          <div className="mt-auto flex flex-col gap-2 pt-3">
            <Link
              href="/publications"
              className="inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              {isAm ? "የህትመቶች ማህደር" : "Publications Module"}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              <Wrench className="w-4 h-4 text-primary" />
              {isAm ? "የቴክኒክ አገልግሎቶች" : "Technical Diagnostics"}
            </Link>
          </div>
        </nav>

        {/* Selected sector */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="p-5 md:p-6 flex flex-col gap-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{sector.tag}</span>
              {sector.badge && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">{sector.badge}</span>
              )}
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-snug">{sector.heading}</h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-6">{sector.desc}</p>

            <div className={`grid grid-cols-1 ${sector.inputs ? "sm:grid-cols-2" : ""} gap-3`}>
              {sector.inputs && (
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{sector.inputsLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{sector.inputs}</p>
                </div>
              )}
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{sector.outputsLabel}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{sector.outputs}</p>
              </div>
            </div>

            {sector.standard && <p className="mt-auto font-mono text-xs text-slate-500">{sector.standard}</p>}
          </div>

          {sector.metrics && (
            <div className="bg-slate-50 border-t md:border-t-0 md:border-s border-slate-200 text-slate-900 p-5 md:p-6 md:w-72 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{sector.focusTitle}</span>
              {sector.metrics.map((metric, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 flex flex-col gap-1">
                  <span className="text-xs text-slate-500">{metric.label}</span>
                  <span className="font-mono text-lg font-bold text-slate-900">{metric.value}</span>
                  <span className="text-[11px] text-slate-500">{metric.note}</span>
                </div>
              ))}
              <p className="mt-auto text-xs text-slate-500">{sector.focusNote}</p>
            </div>
          )}

          {sector.gems && (
            <div className="p-5 md:p-6 md:w-72 grid grid-cols-3 md:grid-cols-1 gap-2 bg-slate-50">
              {sector.gems.map((gem) => (
                <div key={gem.label} className="relative h-20 md:h-24 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={gem.src} alt={gem.alt} fill className="object-cover" sizes="(min-width: 768px) 288px, 33vw" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1 font-mono text-[10px] font-bold text-white">
                    {gem.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
