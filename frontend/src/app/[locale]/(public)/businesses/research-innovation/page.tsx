"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FlaskConical,
  BookOpen,
  ArrowRight,
  Cpu,
  GraduationCap,
  Share2,
  CheckCircle2,
  Lightbulb,
  Building2,
  Wrench,
  Microscope,
  FileText,
  ChevronRight,
  Binary,
  Layers,
  Atom,
  Network,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Flame,
  Recycle,
  ShieldAlert,
} from "lucide-react";

export default function ResearchInnovationPage() {
  const locale = useLocale();
  const isAm = locale === "am";

  // Active Research Pipeline stage (0 to 3)
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // Active Research Theme id
  const [activeThemeId, setActiveThemeId] = useState<string>("metallurgy");

  // Pipeline stages
  const pipelineStages = [
    {
      id: "bench",
      stepNumber: "01",
      title: isAm ? "የላቦራቶሪ ቤንች ፍተሻ እና የኦር ባህሪ ጥናት" : "Laboratory Bench-Scale Characterization",
      shortTitle: isAm ? "የላቦራቶሪ ቤንች ፍተሻ" : "Bench Testing",
      subtitle: isAm
        ? "የኬሚካል ይዘት፣ ክሪስታል መዋቅር እና የማዕድን ጥራጥሬ ነፃ መውጣት ትንተና"
        : "Assay verification, mineral liberation analysis (MLA), and preliminary feasibility",
      questions: isAm
        ? "በናሙናው ውስጥ ምን ያህል ጠቃሚ ማዕድን አለ? ከቆሻሻው ድንጋይ ለመለየት በምን ያህል መጠን (Mesh) መፈጨት አለበት?"
        : "What is the precise elemental assay of the target mineral? At what comminution size (-75µm vs 150µm) do mineral grains fully liberate from gangue?",
      methodology: isAm
        ? "የኤክስሬይ ስፔክትሮሜትሪ (XRF/XRD)፣ የኦፕቲካል ማይክሮስኮፒ፣ የክብደት መጠን ትንተና እና አነስተኛ የመፍጨት/የማጣሪያ ሙከራዎች።"
        : "X-ray Fluorescence (XRF), X-ray Diffraction (XRD), Optical Petrography, and standard laboratory ball-mill grindability tests.",
      deliverables: isAm
        ? "የማዕድን ባህሪ ጥናት ሪፖርት እና የመነሻ የሂደት ፍሰት ምክረ-ሀሳብ"
        : "Mineralogical Baseline Audit & Preliminary Liberation Curve",
      handoff: isAm ? "ወደ ፍሰት-ንድፍ ማመጣጠን (Stage 02) ይሸጋገራል" : "Feeds directly into Circuit Optimization (Stage 02)",
    },
    {
      id: "optimization",
      stepNumber: "02",
      title: isAm ? "የሂደት ፍሰት-ንድፍ እና ማመጣጠን" : "Flowsheet Simulation & Parametric Optimization",
      shortTitle: isAm ? "የፍሰት-ንድፍ ማመጣጠን" : "Flowsheet Optimization",
      subtitle: isAm
        ? "የማጣሪያ ኬሚካሎች፣ የፈሳሽ ጥግግት እና የማገገም መጠን ሙከራዎች"
        : "Reagent dosage kinetics, pulp density sweeps, and recovery curve modeling",
      questions: isAm
        ? "ከፍተኛውን የማዕድን ማገገም (Recovery %) ለማግኘት ምን ያህል ኬሚካል እና የፈሳሽ ጥግግት መደረግ አለበት? ኪሳራን በምን መንገድ መቀነስ ይቻላል?"
        : "What reagent formulation (collectors, frothers, depressants) maximizes recovery while minimizing chemical consumption and slime generation?",
      methodology: isAm
        ? "በአነስተኛ የፍሎቴሽን ማሽኖች፣ በሚንቀጠቀጡ ጠረጴዛዎች እና በመግነጢሳዊ መለያዎች ላይ የሚደረጉ ተከታታይ የንፅፅር ሙከራዎች።"
        : "Parametric laboratory flotation tests, kinetic flotation rate modeling, shaking table deck adjustments, and magnetic field gradient tests.",
      deliverables: isAm
        ? "የተመቻቸ የማጣሪያ ፍሰት-ንድፍ (Optimized Flowsheet) እና የኬሚካል ቀመር"
        : "Optimized Circuit Flowsheet & Chemical Reagent Regime",
      handoff: isAm ? "ወደ ፓይለት ሙከራ (Stage 03) ይሸጋገራል" : "Provides blueprint for Scaled Pilot Evaluation (Stage 03)",
    },
    {
      id: "pilot",
      stepNumber: "03",
      title: isAm ? "የፓይለት ደረጃ ማረጋገጫ እና የማቴሪያል ሚዛን" : "Pilot-Scale Verification & Material Balance",
      shortTitle: isAm ? "የፓይለት ደረጃ ማረጋገጫ" : "Pilot Verification",
      subtitle: isAm
        ? "በቀጣይነት በሚሰሩ ማሽኖች ላይ መጠነ-ሰፊ የሙከራ ምርት ማካሄድ"
        : "Continuous circuit validation, mass balance audits, and tailings profiling",
      questions: isAm
        ? "በላቦራቶሪ የተገኘው ውጤት መጠኑ ሰፋ ባለ የፋብሪካ ማሽን ላይ በተከታታይነት ይሰራል? የተረፈ-ቆሻሻ (Tailings) መጠን እና የአካባቢ ተፅዕኖ ምን ይመስላል?"
        : "Can the laboratory recovery curve be reliably maintained under continuous feed variations? What are the exact mass-balance and dewatering parameters?",
      methodology: isAm
        ? "በትንንሽ ፓይለት ፋብሪካዎች ላይ የሚደረግ የቀጣይነት ሙከራ፣ የውሃ መልሶ ማጣራት እና የተረፈ-ቆሻሻ አካላዊ እና ኬሚካላዊ ትንተና።"
        : "Continuous pilot circuit runs, closed-loop thickening tests, filtrate water chemical recirculation, and tailings stability testing.",
      deliverables: isAm
        ? "የቴክኒክ አዋጭነት ማረጋገጫ እና የፋብሪካ ግንባታ መረጃዎች"
        : "Techno-Economic Feasibility Dossier & Plant Sizing Parameters",
      handoff: isAm ? "ወደ ኢንዱስትሪ ሽግግር (Stage 04) ይሸጋገራል" : "Enables Commercial Commissioning & Adaptation (Stage 04)",
    },
    {
      id: "adaptation",
      stepNumber: "04",
      title: isAm ? "የቴክኖሎጂ ማላመድ እና የፋብሪካ ሽግግር" : "Technology Transfer & Factory Adaptation",
      shortTitle: isAm ? "የቴክኖሎጂ ሽግግር" : "Technology Transfer",
      subtitle: isAm
        ? "የተረጋገጡ አሰራሮችን ወደ ሀገር ውስጥ አምራቾች ማሸጋገር እና ድጋፍ ማድረግ"
        : "Industrial commissioning advisory, standard operating procedures, and training",
      questions: isAm
        ? "የአገር ውስጥ ፋብሪካዎች ቴክኖሎጂውን በቀላሉ እንዴት ተግባራዊ ማድረግ ይችላሉ? የፋብሪካ ሰራተኞች ምን አይነት ስልጠና ያስፈልጋቸዋል?"
        : "How do domestic producers operationalize the verified flowsheet? What standard operating procedures (SOPs) protect ongoing plant efficiency?",
      methodology: isAm
        ? "በቦታው በመገኘት የሚሰጥ የቴክኒክ የማማከር ድጋፍ፣ የሰራተኞች የተግባር ስልጠና እና ደረጃቸውን የጠበቁ የአሰራር መመሪያዎች (SOPs) ዝግጅት።"
        : "On-site plant commissioning diagnostics, factory engineering workshops, standard operating procedure (SOP) manuals, and operator training.",
      deliverables: isAm
        ? "የፋብሪካ የአሰራር መመሪያዎች እና የሰለጠኑ የቴክኒክ ባለሙያዎች"
        : "Industrial SOP Manuals, Handed-Over Circuit & Trained Operators",
      handoff: isAm ? "የቀጣይነት ያለው የቴክኒክ ክትትል" : "Ongoing Technical Monitoring & Continuous Improvement",
    },
  ];

  // Research Themes data
  const researchThemes = [
    {
      id: "metallurgy",
      icon: Atom,
      badge: isAm ? "የማዕድን ይዘት ማሳደግ" : "RECOVERY ENGINEERING",
      title: isAm ? "የብረታብረት እና ማዕድናት ማገገም ማሻሻያ" : "Metallurgical Recovery & Grade Enhancement",
      summary: isAm
        ? "በማጣራት ወቅት የሚባክኑ ጥቃቅን ማዕድናትን (Slimes) ማዳን እና የክምችት ንፅህናን ወደ ውጭ ገበያ እና ፋብሪካ ደረጃ ማሳደግ።"
        : "Developing optimized flotation reagent suites and gravity circuits to recover ultrafine mineral values historically lost to tailings.",
      problem: isAm
        ? "በተለምዷዊ የማጣሪያ ዘዴዎች እስከ 20-30% የሚደርስ ጠቃሚ ማዕድን በጥቃቅን ዱቄትነት (Slimes) ምክንያት አብሮ ይባክናል፤ ይህም አምራቾችን ለከፍተኛ ኪሳራ ይዳርጋል።"
        : "Conventional processing often experiences 20–30% valuable mineral loss in ultrafine particle fractions (<20µm) due to poor bubble-particle collision kinetics.",
      approach: isAm
        ? "የአረፋ ፍሰት ኬሚስትሪን በማስተካከል እና የላቁ የሴንትሪፊውጋል ማጣሪያዎችን በመጠቀም ጥቃቅን ቅንጣቶች ሳይባክኑ ወደ ከፍተኛ ክምችት እንዲቀየሩ ማድረግ።"
        : "Simulating micro-bubble column flotation and hydrocyclone cut-point refinement to recover liberated mineral fines and boost overall plant yield.",
      impact: isAm ? "የማዕድን ማገገም መጠንን እስከ 15% ማሳደግ" : "Potential 10–15% increase in total mineral recovery",
    },
    {
      id: "waste",
      icon: Recycle,
      badge: isAm ? "ተረፈ-ቆሻሻ አጠቃቀም" : "CIRCULAR MINERALOGY",
      title: isAm ? "የኢንዱስትሪ ተረፈ-ቆሻሻ እና ቴይሊንግስ አጠቃቀም" : "Industrial Waste & Tailings Valorization",
      summary: isAm
        ? "ከማዕድን ማውጣት እና ማጣራት የሚቀሩ ተረፈ-ቆሻሻዎችን (Tailings) ለግንባታ ማቴሪያሎች እና ለሲሚንቶ ግብዓትነት ማዋል የሚቻልበትን መንገድ ማጥናት።"
        : "Characterizing legacy mine tailings and slag residues to extract secondary mineral values and formulate sustainable construction geopolymers.",
      problem: isAm
        ? "የማዕድን ቴይሊንግስ በግድቦች ውስጥ ተከማችተው የሚቀሩ እና የአካባቢ ስጋት የሚፈጥሩ ቢሆንም፣ በውስጣቸው ጠቃሚ ሲሊካ እና አልሙና ይዘዋል።"
        : "Accumulated tailings dams pose geotechnical and environmental risks while locking away millions of tons of usable silica, alumina, and residual base metals.",
      approach: isAm
        ? "የቴይሊንግስ ናሙናዎችን ኬሚካላዊ ይዘት በመመርመር ለሲሚንቶ ፋብሪካዎች የፖዞላና መተኪያ፣ ለሴራሚክስ ጥሬ ዕቃ ወይም ለጡብ ማምረቻነት ማዋል የሚያስችሉ ሙከራዎችን ማካሄድ።"
        : "Bench testing alkaline activation and thermal sintering to convert barren silicate tailings into compliant road sub-base, masonry blocks, and pozzolana.",
      impact: isAm ? "የአካባቢ ብክለትን መቀነስ እና ተጨማሪ ገቢ መፍጠር" : "Mitigates environmental footprint and lowers building material costs",
    },
    {
      id: "energy",
      icon: Flame,
      badge: isAm ? "የኢነርጂ ቅልጥፍና" : "THERMAL EFFICIENCY",
      title: isAm ? "የኢነርጂ ቆጣቢ ማቀነባበሪያ እና ማቅለጥ ቴክኖሎጂዎች" : "Energy-Efficient Processing & Foundries",
      summary: isAm
        ? "በማዕድን መፍጨት እና በብረታብረት ማቅለጥ እቶኖች ውስጥ የሚባክነውን ከፍተኛ የኤሌክትሪክ እና የሙቀት ሃይል መቀነስ የሚያስችሉ ቴክኒኮችን መቅረፅ።"
        : "Researching comminution energy efficiency and induction furnace thermal profiling to minimize kilowatt-hour consumption per ton of processed rock.",
      problem: isAm
        ? "የማዕድን መፍጨት (Comminution) እና ማቅለጥ በፋብሪካዎች ውስጥ እስከ 50% የሚደርሰውን የኤሌክትሪክ ፍጆታ ይወስዳሉ፤ ይህም ከፍተኛ ወጪ ያስከትላል።"
        : "Comminution and high-temperature thermal smelting consume up to 50% of total plant operating costs, creating severe energy vulnerability.",
      approach: isAm
        ? "የመፍጨት ሚዲያዎችን መጠን በማስተካከል፣ የሙቀት መከላከያዎችን በማሻሻል እና የተረፈ ሙቀትን (Waste Heat) መልሶ ጥቅም ላይ በማዋል የሃይል ብክነትን መቀነስ።"
        : "Optimizing ball mill charge ratios, investigating high-alumina refractory furnace linings, and modeling waste-heat recovery from kiln flues.",
      impact: isAm ? "የኤሌክትሪክ እና የነዳጅ ፍጆታን እስከ 20% መቆጠብ" : "Potential 15–20% specific energy reduction per ton of output",
    },
    {
      id: "refractory",
      icon: Layers,
      badge: isAm ? "የሙቀት መቋቋም" : "HIGH-TEMPERATURE CERAMICS",
      title: isAm ? "የሀገር ውስጥ ሪፍራክተሪ (Refractory) ቁሶች ልማት" : "Local Refractory & High-Temperature Materials",
      summary: isAm
        ? "የሲሚንቶ፣ የመስታወት እና የብረት እቶኖች ውስጣዊ ግድግዳ የሚለበዱ እሳት-ቋቋሚ ጡቦችን (Firebricks) ከሀገር ውስጥ ሸክላ እና ቦክሳይት ማዘጋጀት።"
        : "Developing high-temperature refractory bricks and castables from domestic fireclays, bauxites, and magnesite deposits to line industrial kilns.",
      problem: isAm
        ? "የሀገር ውስጥ የሲሚንቶ እና የብረት ፋብሪካዎች ለእቶኖቻቸው የሚያስፈልጉ የእሳት-ቋቋሚ ጡቦችን በሙሉ በሚሊዮን ዶላር ከውጭ ያስገባሉ።"
        : "All high-temperature kiln bricks and furnace linings are currently imported at substantial foreign exchange cost, causing prolonged factory downtime.",
      approach: isAm
        ? "በሀገር ውስጥ የሚገኙ የአልሙኒየም የበለፀጉ ሸክላዎችን (Fireclay) በማጥናት፣ በከፍተኛ ሙቀት በማቃጠል እና የሙቀት መቋቋም አቅማቸውን በመፈተሽ የሀገር ውስጥ ጡቦችን ማፍራት።"
        : "Formulating refractory test batches from domestic kaolin and bauxite, evaluating pyrometric cone equivalents (PCE), thermal shock resistance, and slag erosion.",
      impact: isAm ? "የፋብሪካ መቆራረጥን መቀነስ እና የውጭ ምንዛሬን ማዳን" : "Establishes domestic baseline for industrial kiln consumables",
    },
  ];

  const currentPipelineStage = pipelineStages[activePipelineStage];
  const currentTheme =
    researchThemes.find((t) => t.id === activeThemeId) || researchThemes[0];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16">
      {/* Scientific Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs font-mono text-slate-500 uppercase tracking-widest"
      >
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {isAm ? "መነሻ" : "PORTAL"}
        </Link>
        <span>::</span>
        <Link href={`/${locale}/businesses`} className="hover:text-primary transition-colors">
          {isAm ? "የማዕድን ልማት" : "MINERAL_DEV"}
        </Link>
        <span>::</span>
        <span className="text-primary font-semibold">
          {isAm ? "ምርምር_እና_ኢኖቬሽን" : "APPLIED_RESEARCH_INNOVATION"}
        </span>
      </nav>

      {/* SECTION 1: Contemporary Research Institute Hero */}
      <section className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 lg:p-16 shadow-sm overflow-hidden">
        {/* Subtle geometric research matrix background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Research Vision & Statement (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-mono uppercase tracking-widest">
              <Microscope className="w-3.5 h-3.5" />
              <span>
                {isAm
                  ? "ተግባራዊ ምርምር እና ቴክኖሎጂ ሽግግር"
                  : "APPLIED R&D // INDUSTRY TRANSFORMATION PIPELINE"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              {isAm ? (
                <>
                  የማዕድን ምርምርን ከተግባራዊ{" "}
                  <span className="text-primary underline decoration-primary/30 decoration-wavy">
                    የኢንዱስትሪ መፍትሄዎች
                  </span>{" "}
                  ጋር ማስተሳሰር
                </>
              ) : (
                <>
                  Bridging Fundamental Science and{" "}
                  <span className="text-primary underline decoration-primary/30 decoration-wavy">
                    Industrial Scalability
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {isAm
                ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) በንድፈ-ሀሳብ ላይ ብቻ የተገደቡ ጥናቶችን በማስቀረት፣ ቀጥታ የሀገር ውስጥ አምራች ፋብሪካዎች የሚያጋጥሟቸውን የጥሬ ዕቃ፣ የማጣራት እና የኢነርጂ ተግዳሮቶች የሚፈቱ ተግባራዊ ምርምሮችን ያካሂዳል። በላቦራቶሪ የተረጋገጡ የሂደት ፍሰት-ንድፎች (Flowsheets) ወደ ፓይለት ደረጃ አድገው ለፋብሪካዎች እንዲሸጋገሩ ይደረጋል።"
                : "Applied research at MIDI does not remain confined to academic papers. The institute focuses strictly on solving practical industrial bottlenecks: eliminating ultrafine mineral waste, formulating local refractory substitutes, optimizing cementitious clinker blends, and transferring verified flowsheet blueprints to operational domestic enterprises."}
            </p>

            {/* Direct Link to Publications & Technical Services */}
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                href={`/${locale}/publications`}
                className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm shadow-sm hover:bg-primary/95 transition-all group"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{isAm ? "የተቋሙን የምርምር ህትመቶች ይመልከቱ" : "Access Publications & Research"}</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs md:text-sm transition-all"
              >
                <Wrench className="w-4 h-4 mr-2 text-primary" />
                <span>{isAm ? "የቴክኒክ የማማከር አገልግሎቶች" : "Technical Advisory Services"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Research Matrix Schematic Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  {isAm ? "የምርምር ማዕቀፍ ማትሪክስ" : "R&D TRANSLATION MATRIX"}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ACTIVE PIPELINE
              </span>
            </div>

            {/* Matrix Data Nodes */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold">
                  01
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isAm ? "የኦር ባህሪ እና ሜታሎግራፊ" : "Mineral Liberation Modeling"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAm ? "የማዕድናቱ ጥቃቅን መዋቅር እና ትስስር" : "XRF/XRD phase mapping and grain sizing"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold">
                  02
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isAm ? "የማጣሪያ ኪነቲክስ እና የኬሚካል ቀመር" : "Flotation & Separation Kinetics"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAm ? "የአረፋ እና የስበት ማጣሪያ ማመጣጠን" : "Reagent suite sweeps and pulp density"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold">
                  03
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isAm ? "የፓይለት ፍሰት-ንድፍ ማረጋገጫ" : "Pilot Continuous Simulation"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAm ? "የተከታታይ ሙከራ እና የማቴሪያል ሚዛን" : "Scale-up risk mitigation and mass balance"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold">
                  04
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isAm ? "የቴክኖሎጂ ሽግግር እና SOP ዝግጅት" : "Industry Adaptation & SOPs"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAm ? "ለፋብሪካዎች የሚሰጥ ቀጥተኛ የቴክኒክ ድጋፍ" : "Plant commissioning support and operator training"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 flex items-center justify-between font-mono">
              <span>RESEARCH DISSEMINATION</span>
              <span className="text-primary font-semibold">PEER-VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Applied R&D Pipeline (Interactive Research Journey) */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-1">
              <Network className="w-4 h-4" />
              <span>{isAm ? "የምርምር ጉዞ መስመር" : "APPLIED R&D STAGED JOURNEY"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              {isAm
                ? "ከቤንች ላቦራቶሪ እስከ ፋብሪካ ሽግግር ያለው የ4-ደረጃ የምርምር ፍሰት"
                : "The 4-Stage Applied Research & Technology Pipeline"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {isAm
                ? "እያንዳንዱ የምርምር ደረጃ ምን አይነት ጥያቄዎችን እንደሚመልስ እና ምን አይነት ቴክኒካዊ ውጤቶችን እንደሚያስገኝ ለማየት ደረጃዎቹን ይምረጡ።"
                : "Select any research phase to inspect the scientific questions addressed, applied methodologies, and technical deliverables."}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
            {isAm ? "ንቁ የምርምር ደረጃ:" : "INSPECTING PHASE:"} <span className="text-primary font-bold">{currentPipelineStage.stepNumber}</span>
          </div>
        </div>

        {/* 4 Pipeline Stage Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {pipelineStages.map((stage, sIdx) => {
            const isSelected = activePipelineStage === sIdx;
            return (
              <button
                key={stage.id}
                onClick={() => setActivePipelineStage(sIdx)}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                  isSelected
                    ? "bg-slate-950 text-white border-primary shadow-lg ring-1 ring-primary"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
                role="tab"
                aria-selected={isSelected}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    PHASE {stage.stepNumber}
                  </span>
                  {sIdx < pipelineStages.length - 1 && (
                    <ArrowRight
                      className={`w-4 h-4 hidden lg:block ${
                        isSelected ? "text-primary" : "text-slate-400"
                      }`}
                    />
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1">
                  {stage.shortTitle}
                </h3>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isSelected ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {stage.subtitle}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-blue-400">
                    <span>{isAm ? "ደረጃው ተመርጧል" : "PHASE DOSSIER"}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Dossier */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-primary text-white font-bold">
                  PHASE {currentPipelineStage.stepNumber}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  RESEARCH DOSSIER
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentPipelineStage.title}
              </h3>
            </div>

            <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              {currentPipelineStage.handoff}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Questions & Methodology (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Question Answered */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>{isAm ? "ደረጃው የሚመልሰው ቁልፍ የምርምር ጥያቄ" : "PRIMARY RESEARCH QUESTIONS ANSWERED"}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  &ldquo;{currentPipelineStage.questions}&rdquo;
                </p>
              </div>

              {/* Applied Methodology */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  {isAm ? "የተግባራዊ ፍተሻ ስነ-ዘዴ" : "TESTING METHODOLOGY & PROTOCOLS"}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {currentPipelineStage.methodology}
                </p>
              </div>
            </div>

            {/* Right: Deliverables Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>{isAm ? "ተጨባጭ የምርምር ውጤቶች" : "VERIFIED DELIVERABLES"}</span>
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </h4>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  {isAm ? "የደረጃው የቴክኒክ ሰነድ" : "Technical Output"}
                </p>
                <p className="text-sm font-bold text-white">
                  {currentPipelineStage.deliverables}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  {isAm ? "የቀጣይ ደረጃ ትስስር" : "Downstream Transition"}
                </p>
                <p className="text-xs text-slate-300 font-mono">
                  {currentPipelineStage.handoff}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-slate-500">
                {isAm
                  ? "የምርምር ሂደቱ አለም አቀፍ የላቦራቶሪ ደረጃዎችን (ISO/IEC 17025) የተከተለ ነው"
                  : "Conducted under rigorous laboratory quality assurance protocols"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Research Themes Explorer */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-1">
            <Atom className="w-4 h-4" />
            <span>{isAm ? "ስልታዊ የምርምር መስኮች" : "CORE APPLIED RESEARCH THEMES"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            {isAm
              ? "የሀገር ውስጥ ኢንዱስትሪዎችን ችግር የሚፈቱ የምርምር መስኮች"
              : "Four Priority Applied Mineral Research Themes"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isAm
              ? "የሀገር ውስጥ ፋብሪካዎች የሚያጋጥሟቸውን የጥሬ ዕቃ እጥረት፣ የሃይል ብክነት እና የተረፈ-ቆሻሻ አያያዝ ችግሮች የሚፈቱ የምርምር ስራዎች።"
              : "Explore targeted research initiatives focused on recovery optimization, industrial circularity, energy reduction, and domestic refractory development."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Theme Selectors (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {researchThemes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                  role="tab"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{theme.title}</p>
                      <p
                        className={`text-[11px] font-mono mt-0.5 ${
                          isSelected ? "text-white/80" : "text-slate-500"
                        }`}
                      >
                        {theme.badge}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Theme Explorer Card (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  {currentTheme.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white mt-0.5">
                  {currentTheme.title}
                </h3>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                ACTIVE R&D INITIATIVE
              </span>
            </div>

            {/* Summary */}
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {currentTheme.summary}
            </p>

            {/* Problem & Approach Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-800 dark:text-amber-400 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isAm ? "የኢንዱስትሪው ችግር" : "INDUSTRIAL PROBLEM"}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentTheme.problem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-blue-800 dark:text-blue-400 font-bold">
                  <FlaskConical className="w-4 h-4" />
                  <span>{isAm ? "የተቋሙ የምርምር አካሄድ" : "APPLIED R&D APPROACH"}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentTheme.approach}
                </p>
              </div>
            </div>

            {/* Targeted Impact */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-slate-500 uppercase">
                  {isAm ? "የታለመው ተጨባጭ ውጤት" : "TARGETED INDUSTRIAL IMPACT"}
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentTheme.impact}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Research-to-Industry Staged Flow Diagram */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            {isAm ? "የእውቀት እና ቴክኖሎጂ ሽግግር ፍሰት" : "RESEARCH TRANSLATION CONTINUUM"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isAm
              ? "ከምርምር ጥያቄ ወደ ኢንዱስትሪ አሰራር ሽግግር"
              : "From Problem Statement to Commercial Factory Implementation"}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isAm
              ? "የተቋሙ ስራ በምርምር ውጤት ብቻ አያበቃም፤ የተገኙ አዳዲስ አሰራሮች ወደ ሀገር ውስጥ አምራቾች ተሸጋግረው ውጤት እስኪያመጡ ድረስ ቀጣይነት ያለው የቴክኒክ ድጋፍ ይሰጣል።"
              : "Ensuring laboratory breakthroughs translate into higher factory yields, reduced energy overheads, and lower unit production costs for domestic mineral producers."}
          </p>
        </div>

        {/* 5-Step Staged Continuum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: "01",
              title: isAm ? "የኢንዱስትሪ ጥያቄ" : "Industry Bottleneck",
              desc: isAm ? "የአምራቾችን የጥራት እና የማጣራት ተግዳሮቶች መለየት" : "Identifying recovery, energy or impurity challenges",
            },
            {
              step: "02",
              title: isAm ? "የላቦራቶሪ ፍተሻ" : "Lab Evaluation",
              desc: isAm ? "በናሙናዎች ላይ ጥብቅ የኬሚካል እና ሜካኒካል ምርመራ" : "Bench characterization and liberation assaying",
            },
            {
              step: "03",
              title: isAm ? "የቴክኒክ ማረጋገጫ" : "Flowsheet Audit",
              desc: isAm ? "የተመቻቸ የማጣሪያ ፍሰት-ንድፍ እና ኬሚካል ማረጋገጥ" : "Simulating optimal parameters and recovery kinetics",
            },
            {
              step: "04",
              title: isAm ? "የቴክኖሎጂ ሽግግር" : "Technology Transfer",
              desc: isAm ? "የአሰራር መመሪያዎች (SOP) እና የስራ ላይ ስልጠና መስጠት" : "Delivering SOPs, manuals, and technical advisory",
            },
            {
              step: "05",
              title: isAm ? "የኢንዱስትሪ ትግበራ" : "Factory Adoption",
              desc: isAm ? "በፋብሪካ ደረጃ የምርት ጥራት እና ቅልጥፍና ማሳደግ" : "Scaled production yielding commercial return",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-primary font-bold">{item.step}</span>
                {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden lg:block" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Workforce Skills Development & Publications Direct Integration */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Workforce Technical Capacity (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                {isAm ? "የቴክኒክ የሰው ኃይል ልማት" : "HUMAN RESOURCE DEVELOPMENT"}
              </span>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {isAm ? "ልዩ የተግባር ስልጠናዎች እና የክህሎት ሽግግር" : "Applied Technical Masterclasses & Workforce Skills"}
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {isAm
                ? "ተቋሙ በማዕድን ማጣራት፣ በብረታብረት ቀረጣ እና ማቅለጥ፣ በሞዴል ዝግጅት እና በከበሩ ድንጋዮች ላፒዳሪ ዘርፍ ለሀገር ውስጥ ፋብሪካ ሰራተኞች እና ለወጣት ባለሙያዎች የተግባር ስልጠናዎችን በመስጠት ብቁ የቴክኒክ የሰው ኃይል ይገነባል።"
                : "Building national technological self-reliance requires a skilled engineering workforce. MIDI conducts specialized hands-on training in foundry technology, sand mold preparation, mineral dressing, and precision gemstone faceting to bridge the industrial skills gap."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>EXCELLENCE CENTERS & WORKSHOPS</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {isAm ? "ቀጣይነት ያለው ስልጠና" : "ONGOING WORKSHOPS"}
            </span>
          </div>
        </div>

        {/* Right: Direct Publications Module Integration (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-primary/20 text-white p-8 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {isAm ? "የህትመቶች እና የምርምር ማህደር" : "PUBLICATIONS & RESEARCH REPOSITORY"}
              </span>
              <h3 className="text-2xl font-bold text-white">
                {isAm ? "የተቋሙን የምርምር ሰነዶች በድረ-ገጻችን ያግኙ" : "Verified Technical Monographs & Research Reports"}
              </h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {isAm
                ? "በማዕድን ዘርፉ የተዘጋጁ የቴክኒክ መመሪያዎችን፣ የጂኦሎጂካል ጥናቶችን፣ የማዕድን ስርጭት ካርታዎችን እና የፖሊሲ ሰነዶችን በቀጥታ በህትመቶች ማህደራችን ማግኘት፣ ማንበብ እና ማውረድ ይችላሉ።"
                : "Explore verified institutional publications, geological studies, mineral distribution maps, and metallurgical monographs directly cataloged in the MIDI Publications module."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3 items-center justify-between">
            <Link
              href={`/${locale}/publications`}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm shadow-sm hover:bg-primary/95 transition-all group"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>{isAm ? "ወደ ህትመቶች ማህደር ይሂዱ" : "Explore Publications"}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-xs font-mono text-slate-400">
              {isAm ? "በዲጂታል ቅርጸት ዝግጁ" : "DIGITAL ACCESS"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
