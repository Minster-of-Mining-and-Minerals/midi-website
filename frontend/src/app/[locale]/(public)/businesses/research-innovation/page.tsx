"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Atom, Recycle, Flame, Layers, BookOpen, GraduationCap, ChevronRight } from "lucide-react";

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

  const ThemeIcon = currentTheme.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* R&D pipeline */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-900">
          {isAm ? "ከቤንች ላቦራቶሪ እስከ ፋብሪካ ሽግግር ያለው የ4-ደረጃ የምርምር ፍሰት" : "The 4-Stage Applied Research & Technology Pipeline"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {pipelineStages.map((stage, idx) => {
            const active = idx === activePipelineStage;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActivePipelineStage(idx)}
                aria-pressed={active}
                className={`rounded-lg px-3.5 py-3 text-start flex flex-col gap-1 transition-colors ${
                  active ? "bg-slate-950 text-white" : "bg-white border border-slate-200 text-slate-900 hover:border-primary/50"
                }`}
              >
                <span className={`font-mono text-[11px] ${active ? "text-amber-400" : "text-primary"}`}>
                  {isAm ? "ደረጃ" : "STAGE"} {stage.stepNumber}
                </span>
                <span className="text-sm font-semibold leading-snug">{stage.shortTitle}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">{currentPipelineStage.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{currentPipelineStage.subtitle}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {isAm ? "ደረጃው የሚመልሰው ቁልፍ የምርምር ጥያቄ" : "Primary Research Questions Answered"}
            </p>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">{currentPipelineStage.questions}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {isAm ? "የተግባራዊ ፍተሻ ስነ-ዘዴ" : "Testing Methodology & Protocols"}
            </p>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">{currentPipelineStage.methodology}</p>
          </div>
          <div className="mt-auto rounded-lg bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isAm ? "ተጨባጭ የምርምር ውጤቶች" : "Verified Deliverables"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{currentPipelineStage.deliverables}</p>
            </div>
            <span className="text-xs text-slate-500 sm:text-end sm:max-w-[45%]">{currentPipelineStage.handoff}</span>
          </div>
        </div>
      </div>

      {/* Research themes + workforce / publications */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-2">
          <h2 className="text-base font-semibold text-slate-900 pb-1">
            {isAm ? "የሀገር ውስጥ ኢንዱስትሪዎችን ችግር የሚፈቱ የምርምር መስኮች" : "Four Priority Applied Mineral Research Themes"}
          </h2>
          {researchThemes.map((theme) => {
            const active = theme.id === activeThemeId;
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeId(theme.id)}
                aria-expanded={active}
                className={`rounded-xl px-4 py-3 text-start flex items-start gap-3 transition-colors ${
                  active ? "bg-amber-50 ring-1 ring-primary/30" : "border border-slate-100 hover:bg-slate-50"
                }`}
              >
                <Icon className={`mt-0.5 w-4 h-4 shrink-0 ${active ? "text-primary" : "text-slate-400"}`} />
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className={`text-[11px] font-semibold tracking-wider ${active ? "text-amber-800" : "text-slate-500"}`}>
                    {theme.badge}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{theme.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ThemeIcon className="w-4 h-4" />
            {currentTheme.title}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">{currentTheme.summary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isAm ? "የኢንዱስትሪው ችግር" : "Industrial Problem"}
              </p>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed line-clamp-4">{currentTheme.problem}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isAm ? "የተቋሙ የምርምር አካሄድ" : "Applied R&D Approach"}
              </p>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed line-clamp-4">{currentTheme.approach}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-amber-800">
            <span className="text-slate-500 font-normal">{isAm ? "የታለመው ተጨባጭ ውጤት" : "Targeted impact"}: </span>
            {currentTheme.impact}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/publications"
            className="group rounded-2xl bg-slate-950 text-white p-4 flex items-center justify-between gap-3 hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="w-4 h-4 text-amber-400" />
              {isAm ? "ወደ ህትመቶች ማህደር ይሂዱ" : "Explore Publications"}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
          <Link
            href="/services"
            className="group rounded-2xl bg-primary text-white p-4 flex items-center justify-between gap-3 hover:bg-primary-hover transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="w-4 h-4" />
              {isAm ? "ልዩ የተግባር ስልጠናዎች እና የክህሎት ሽግግር" : "Workforce Skills & Training"}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
