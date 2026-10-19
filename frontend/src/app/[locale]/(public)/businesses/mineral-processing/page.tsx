"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Layers,
  Wrench,
  Building2,
  Filter,
  Zap,
  Sliders,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Microscope,
  Gauge,
  Cpu,
  BarChart3,
  Compass,
  FileCheck,
  RotateCcw,
  BookOpen,
} from "lucide-react";

export default function MineralProcessingPage() {
  const locale = useLocale();
  const isAm = locale === "am";

  // Flowsheet stage selection state (0 to 3)
  const [activeStage, setActiveStage] = useState<number>(0);

  // Separation method selection state ('gravity' | 'flotation' | 'magnetic' | 'hydrometallurgy')
  const [activeMethod, setActiveMethod] = useState<string>("flotation");

  // Flowsheet stages data
  const flowsheetStages = [
    {
      id: "char",
      stageNumber: "01",
      name: isAm ? "የኦር ባህሪ እና ሜታሎግራፊ ትንተና" : "Characterization & Mineralogy",
      shortTitle: isAm ? "የባህሪ ጥናት" : "Characterization",
      tagline: isAm
        ? "የኬሚካል ውህድ፣ ክሪስታሎግራፊ እና ጠቃሚ ማዕድናት በድንጋዩ ውስጥ እንዴት እንደተጣመሩ ማረጋገጥ"
        : "Elemental composition, crystallography, and grain liberation analysis",
      purpose: isAm
        ? "ጥሬው ማዕድን ወደ ማጣሪያ ከመግባቱ በፊት የትኞቹ ጠቃሚ ማዕድናት እንደሚገኙበት፣ መጠናቸው እና ከቆሻሻው ድንጋይ (Gangue) ጋር ያላቸውን ትስስር በላቦራቶሪ ደረጃ ማረጋገጥ።"
        : "Determine the exact elemental assay, mineral species distribution, and grain liberation threshold before any comminution or separation circuit design.",
      parameters: [
        { label: isAm ? "የመመርመሪያ ዘዴዎች" : "Core Diagnostics", val: "XRF, XRD & Optical Microscopy" },
        { label: isAm ? "የትንተና ትኩረት" : "Analytical Focus", val: isAm ? "የንጥረ ነገር ይዘት እና ክሪስታል መዋቅር" : "Elemental Assay & Crystal Phases" },
        { label: isAm ? "የሚፈተሽ ናሙና መጠን" : "Sample Preparation", val: "-75 µm Pulverized Powder" },
        { label: isAm ? "ውጤት" : "Primary Output", val: isAm ? "የማዕድን አጠቃላይ የባህሪ ሪፖርት" : "Mineral Liberation Audit Report" },
      ],
      flowFeed: isAm ? "ጥሬ የኦር ናሙና (Run-of-Mine)" : "Run-of-Mine (ROM) Ore Feed",
      flowProduct: isAm ? "የተረጋገጠ የማዕድን ባህሪ መረጃ" : "Mineralogical Baseline Data",
    },
    {
      id: "comminution",
      stageNumber: "02",
      name: isAm ? "መፍጨት፣ ማድቀቅ እና መጠን መለየት" : "Comminution & Liberation Sizing",
      shortTitle: isAm ? "መፍጨት እና መጠን" : "Comminution",
      tagline: isAm
        ? "የጥሬ ማዕድኑን መጠን በክረሸር እና ቦል ሚል በመፍጨት ማዕድኑ ከቆሻሻው ተለይቶ ነፃ እንዲሆን ማድረግ"
        : "Progressive crushing, grinding, and classification to liberate valuable mineral grains",
      purpose: isAm
        ? "የማዕድኑ ጥራጥሬዎች ከቆሻሻው ድንጋይ ሙሉ በሙሉ ነፃ እስኪሆኑ (Liberation Size) ድረስ በመጀመሪያ ደረጃ በመሰባበር እና በሁለተኛ ደረጃ በቦል ሚል በመፍጨት ተስማሚ መጠን ማዘጋጀት።"
        : "Reduce particle size through multi-stage crushing and wet/dry grinding to unbind target minerals from host gangue without over-grinding or excessive slimes.",
      parameters: [
        { label: isAm ? "የመሰባበር መሳሪያዎች" : "Equipment Classes", val: "Jaw Crushers, Cone Mill, Ball Mill" },
        { label: isAm ? "የመጠን መለያ ዘዴ" : "Sizing Classification", val: "Hydrocyclones & Vibrating Sieves" },
        { label: isAm ? "የታለመ መጠን (P80)" : "Target P80 Grind Size", val: "75 µm – 150 µm" },
        { label: isAm ? "የኢነርጂ ቁጥጥር" : "Process Consideration", val: isAm ? "ከመጠን በላይ መፍጨትን መከላከል" : "Slime Minimization & Energy Audit" },
      ],
      flowFeed: isAm ? "ጥሬ የተቆፈረ ድንጋይ" : "Crushed Ore (<50mm)",
      flowProduct: isAm ? "ተስማሚ መጠን ያለው የዱቄት ዝግጅት" : "Classified Slurry / Dry Powder",
    },
    {
      id: "separation",
      stageNumber: "03",
      name: isAm ? "አካላዊ እና ኬሚካላዊ ማጣሪያ" : "Physical & Physicochemical Separation",
      shortTitle: isAm ? "ማጣራት እና መለየት" : "Separation",
      tagline: isAm
        ? "በስበት ልዩነት፣ በመግነጢሳዊ ሃይል ወይም በፍሎቴሽን አረፋ ጠቃሚውን ማዕድን ለይቶ ማበልፀግ"
        : "Selective concentration using gravity, magnetic properties, surface chemistry, or leaching",
      purpose: isAm
        ? "በማዕድናቱ መካከል ያለውን የክብደት፣ የመግነጢሳዊ ስበት ወይም የውሃ መሳብ/መግፋት (Hydrophobic/Hydrophilic) ልዩነት በመጠቀም ጠቃሚውን ክፍል ወደ ከፍተኛ ክምችት መቀየር።"
        : "Deploy targeted physical differential forces to segregate valuable concentrates from discarded tailings, maximizing overall recovery and final product grade.",
      parameters: [
        { label: isAm ? "ዋና ዘዴዎች" : "Primary Circuits", val: "Gravity, Froth Flotation, Magnetic" },
        { label: isAm ? "የክምችት ማሳደጊያ" : "Enrichment Ratio", val: "3x – 15x Feed Grade" },
        { label: isAm ? "የሂደት ቁጥጥር" : "Circuit Diagnostics", val: isAm ? "የፈሳሽ ጥግግት እና ፒኤች (pH)" : "Pulp Density & Reagent Dosing" },
        { label: isAm ? "ውጤት" : "Process Discharge", val: isAm ? "የበለፀገ ክምችት + ተረፈ-ቆሻሻ (Tailings)" : "Upgraded Concentrate + Tailings" },
      ],
      flowFeed: isAm ? "የተፈጨ እና የተመጠነ ማዕድን" : "Classified Mineral Slurry",
      flowProduct: isAm ? "ከፍተኛ ይዘት ያለው እርጥብ ክምችት" : "Enriched Mineral Concentrate",
    },
    {
      id: "dewatering",
      stageNumber: "04",
      name: isAm ? "ውሃ ማስወገድ፣ ማጣራት እና ክምችት ማድረቅ" : "Dewatering, Filtration & Product Handling",
      shortTitle: isAm ? "ውሃ ማስወገድ እና አያያዝ" : "Dewatering",
      tagline: isAm
        ? "የማጣሪያ ውሃን በማጥለልና በማጣራት ለቀጣይ የፋብሪካ ማቅለጥ ዝግጁ የሆነ ደረቅ ክምችት ማዘጋጀት"
        : "Thickening, vacuum/pressure filtration, and drying for smelter-ready bulk transport",
      purpose: isAm
        ? "ከተጣራው ክምችት ውስጥ ፈሳሽን በማስወገድ የእርጥበት መጠንን መቀነስ፣ የሂደት ውሃን እንደገና ጥቅም ላይ ማዋል እና ደረቅ ክምችቱን ለኢንዱስትሪ ገበያ ማዘጋጀት።"
        : "Separate process water from final mineral solids, recycle process reagents and water, and yield stable, low-moisture bulk filter cake meeting transport specifications.",
      parameters: [
        { label: isAm ? "የመለያ መሳሪያዎች" : "Filtration Systems", val: "High-Rate Thickeners, Filter Press" },
        { label: isAm ? "የእርጥበት መጠን ግብ" : "Target Moisture", val: "< 8% – 10% Residual Water" },
        { label: isAm ? "የውሃ መልሶ አጠቃቀም" : "Process Water Recycle", val: isAm ? "እስከ 85% የውሃ መልሶ ማገገም" : "Up to 85% Closed-Loop Recirculation" },
        { label: isAm ? "የተጠናቀቀ ውጤት" : "Final State", val: isAm ? "ለፋብሪካ ዝግጁ የሆነ ክምችት" : "Transportable Factory-Grade Cake" },
      ],
      flowFeed: isAm ? "እርጥብ የበለፀገ ክምችት" : "High-Density Concentrate Slurry",
      flowProduct: isAm ? "ለፋብሪካ ዝግጁ የሆነ የደረቀ ክምችት" : "Market-Grade Dry Concentrate",
    },
  ];

  // Separation methods data
  const separationMethods = [
    {
      id: "flotation",
      name: isAm ? "የፍሎቴሽን (አረፋ) መለያየት" : "Froth Flotation Circuits",
      badge: isAm ? "የገጽታ ኬሚስትሪ" : "Physicochemical Surface Chemistry",
      icon: Filter,
      commodities: isAm
        ? "የመዳብ፣ የዚንክ፣ የታንታለም፣ የሊቲየም እና የሰልፋይድ ኦሮች"
        : "Base Metal Sulfides (Cu, Zn, Pb), Tantalite, Spodumene (Lithium), Graphite",
      mechanism: isAm
        ? "በተመረጡ ኬሚካሎች (ኮሌክተሮች፣ ፍሮተሮች) አማካኝነት ጠቃሚ የሆኑ ማዕድናት የውሃ መከላከያ (Hydrophobic) ባህሪ እንዲኖራቸው በማድረግ ከአረፋ ጋር ተጣብቀው ወደ ላይ እንዲንሳፈፉ የሚደረግበት ሂደት።"
        : "Selectively coats target mineral surfaces with hydrophobic collector reagents. Air bubbles introduced into the agitated slurry capture buoyant mineral particles and float them into an overflowing froth launder.",
      specs: [
        { key: isAm ? "የአየር ፍሰት ቁጥጥር" : "Aeration Dynamics", value: "Sub-aerated Flotation Banks" },
        { key: isAm ? "የኬሚካል ግብዓት" : "Reagent Regimes", value: "Collectors, Frothers, Modifiers" },
        { key: isAm ? "የመለያ መጠን" : "Particle Sizing", value: "20 µm – 150 µm Optimal Window" },
        { key: isAm ? "የማጣሪያ ደረጃዎች" : "Circuit Layout", value: "Rougher → Scavenger → Cleaner Cells" },
      ],
    },
    {
      id: "magnetic",
      name: isAm ? "መግነጢሳዊ መለያየት" : "Magnetic Separation Systems",
      badge: isAm ? "መግነጢሳዊ ባህሪ" : "Magnetic Susceptibility Gradient",
      icon: Zap,
      commodities: isAm
        ? "የብረት ማዕድን (Magnetite/Hematite)፣ ኢልሜናይት፣ ክሮማይት እና የሲሊካ አሸዋ"
        : "Iron Ores (Magnetite, Hematite), Ilmenite, Chromite, Wolframite, Silica Sand",
      mechanism: isAm
        ? "በከፍተኛ እና ዝቅተኛ መግነጢሳዊ ሃይል (LIMS/WHIMS) መግነጢሳዊ ስበት ያላቸውን የብረት ማዕድናት የማይስቡትን የሲሊካ እና ሌሎች ማዕድናት በመለየት ንፁህ ክምችት ማግኘት።"
        : "Exploits differences in magnetic susceptibility between ferromagnetic, paramagnetic, and diamagnetic minerals under focused magnetic field gradients, operating in both wet and dry modes.",
      specs: [
        { key: isAm ? "የመስክ ጥንካሬ" : "Field Intensity", value: "Low (0.1T) to High (1.5T+) Tesla" },
        { key: isAm ? "የአሰራር ስርዓት" : "Process Medium", value: "Dry Drum & Wet High-Intensity (WHIMS)" },
        { key: isAm ? "የብረት ይዘት ማሳደግ" : "Fe Grade Upgrade", value: "Up to 65%+ Fe in Concentrate" },
        { key: isAm ? "የቆሻሻ ማስወገድ" : "Impurity Rejection", value: "Silica, Alumina & Phosphorous Removal" },
      ],
    },
    {
      id: "gravity",
      name: isAm ? "የስበት ልዩነት ማጣሪያ" : "Gravity Concentration",
      badge: isAm ? "የጥግግት ልዩነት" : "Specific Gravity Differential",
      icon: Sliders,
      commodities: isAm
        ? "ወርቅ፣ ታንታላይት፣ ከባድ ማዕድን አሸዋዎች (Zircon, Rutile)፣ ቱንግስተን"
        : "Placer & Lode Gold, Tantalite-Columbite, Heavy Mineral Sands, Cassiterite",
      mechanism: isAm
        ? "ያለ ምንም ኬሚካል ግብዓት፣ በማዕድናቱ የክብደት ልዩነት (Specific Gravity) እና በውሃ ፍሰት መስተጋብር አማካኝነት ከባድ ማዕድናትን ከቀላል አሸዋ የሚለይ ለአካባቢ ተስማሚ ዘዴ።"
        : "Segregates mineral grains driven strictly by relative specific gravity differences in fluid dynamic motion. High-density particles settle faster across rifled decks and spiral troughs.",
      specs: [
        { key: isAm ? "ዋና ማሽነሪዎች" : "Core Machinery", value: "Shaking Tables, Spirals, Knelson Bowls" },
        { key: isAm ? "የአካባቢ ተስማሚነት" : "Chemical Footprint", value: "Zero Reagent Additives (Eco-Friendly)" },
        { key: isAm ? "የመጠን ወሰን" : "Size Sensitivity", value: "30 µm to 2.0 mm Coarse Liberation" },
        { key: isAm ? "የመጀመሪያ ክምችት" : "Pre-Concentration", value: "Recovers 70%+ of Coarse Gravity Gold" },
      ],
    },
    {
      id: "hydrometallurgy",
      name: isAm ? "የሃይድሮሜታለርጂ ኬሚካል ማጣሪያ" : "Hydrometallurgical Leaching",
      badge: isAm ? "የፈሳሽ ኬሚስትሪ" : "Aqueous Chemical Extraction",
      icon: FlaskConical,
      commodities: isAm
        ? "ዝቅተኛ ይዘት ያላቸው ኦሮች፣ የተወሳሰቡ ሰልፋይዶች እና የፋብሪካ ቅሪቶች (Tailings)"
        : "Refractory Gold Ores, Low-Grade Copper Oxides, Zinc Leach Residues, Tailings",
      mechanism: isAm
        ? "ማዕድናትን በተስማሚ አሲዳማ ወይም አልካላይን ፈሳሾች ውስጥ በማሟሟት (Leaching)፣ በሟሟት ማጣራት (SX) እና በኤሌክትሮላይሲስ ንጹሕ ብረታብረቶችን የማግኘት የላቀ ቴክኒክ።"
        : "Selectively dissolves metal values from pulverized ore into an aqueous lixiviant solution, followed by solvent extraction (SX) purification and electrowinning (EW) metal recovery.",
      specs: [
        { key: isAm ? "የመሟሟት ዘዴ" : "Leaching Modes", value: "Agitation Tank & Column Heap Simulation" },
        { key: isAm ? "የኬሚካል አይነቶች" : "Lixiviant Types", value: "Sulfuric Acid, Cyanide, Alkaline Agents" },
        { key: isAm ? "የማጣሪያ እርምጃ" : "Purification Circuit", value: "Solvent Extraction (SX) & Carbon Adsorption" },
        { key: isAm ? "የተጠናቀቀ ብረት" : "Metal Recovery", value: "Electrowinning (EW) / Precipitation" },
      ],
    },
  ];

  const currentStageData = flowsheetStages[activeStage];
  const currentMethodData =
    separationMethods.find((m) => m.id === activeMethod) || separationMethods[0];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16">
      {/* Precision Engineering Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs font-mono text-slate-500 uppercase tracking-wider"
      >
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">
          {isAm ? "መነሻ" : "PORTAL"}
        </Link>
        <span>//</span>
        <Link href={`/${locale}/businesses`} className="hover:text-primary transition-colors">
          {isAm ? "የማዕድን ልማት" : "MINERAL_DEV"}
        </Link>
        <span>//</span>
        <span className="text-primary font-semibold">
          {isAm ? "ማቀነባበሪያ_እና_ማበልፀጊያ" : "BENEFICIATION_ENGINEERING"}
        </span>
      </nav>

      {/* SECTION 1: Asymmetric Engineering Hero Section */}
      <section className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 lg:p-12 shadow-sm overflow-hidden">
        {/* Engineering graph paper subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Technical Narrative & Spec Tags (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Gauge className="w-3.5 h-3.5" />
              <span>
                {isAm
                  ? "የቴክኒክ ማዕቀፍ // የማዕድን ማበልፀጊያ ምህንድስና"
                  : "TECHNICAL SPECIFICATION // MINERAL DRESSING ENGINEERING"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              {isAm ? (
                <>
                  የጥሬ ማዕድን ይዘትን በማሳደግ{" "}
                  <span className="text-primary underline decoration-primary/30 decoration-wavy">
                    የኢንዱስትሪ ጥሬ ዕቃ
                  </span>{" "}
                  ዝግጅት
                </>
              ) : (
                <>
                  Upgrading Raw Ore Grades via{" "}
                  <span className="text-primary underline decoration-primary/30 decoration-wavy">
                    Precision Beneficiation
                  </span>{" "}
                  Engineering
                </>
              )}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {isAm
                ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) በማዕድን ማውጣት እና በፋብሪካ ማኑፋክቸሪንግ መካከል ያለውን ወሳኝ የቴክኒክ ሽግግር ይመራል። ዝቅተኛ ይዘት ያላቸው የተፈጥሮ ኦሮች በሜካኒካል መፍጨት፣ በስበት ልዩነት፣ በመግነጢሳዊ ሃይል እና በፍሎቴሽን አረፋ አማካኝነት ቆሻሻቸው ተወግዶ ለቀጣይ የብረታብረት፣ የሲሚንቶ፣ የሴራሚክስ እና የመስታወት ፋብሪካዎች ከፍተኛ ጥራት ያላቸው ክምችቶች እንዲሆኑ ይደረጋል።"
                : "The Mineral Industry Development Institute (MIDI) delivers technical diagnostics, liberation modeling, and beneficiation flowsheet verification. By separating gangue waste from run-of-mine ores through advanced physical dressing, the institute enables domestic mineral producers to achieve international concentrate specifications for downstream smelting and manufacturing."}
            </p>

            {/* Technical Parameters Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                isAm ? "የኦር ባህሪ ትንተና" : "Grain Liberation Analysis",
                isAm ? "የመፍጨት መጠን ቁጥጥር (P80)" : "P80 Comminution Sizing",
                isAm ? "የክምችት ማሳደጊያ ቴክኖሎጂ" : "Recovery Optimization",
                isAm ? "ተረፈ-ቆሻሻ ቅነሳ" : "Tailings Minimization",
              ].map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                href={`/${locale}/publications`}
                className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold text-xs md:text-sm shadow-sm hover:bg-primary/95 transition-all group"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{isAm ? "የሂደት ጥናቶች እና ህትመቶች" : "Processing Studies & Publications"}</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs md:text-sm transition-all"
              >
                <Wrench className="w-4 h-4 mr-2 text-primary" />
                <span>{isAm ? "የቴክኒክ የማማከር አገልግሎቶች" : "Technical Process Advisory"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Industrial Process Telemetry Dashboard (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  {isAm ? "የሂደት ፍሰት መለኪያ" : "BENEFICIATION TELEMETRY"}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                P-80 DRESSING
              </span>
            </div>

            {/* Visual Ore Progression Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">{isAm ? "ጥሬ ኦር (Run-of-Mine)" : "Raw Ore Feed"}</span>
                <span className="text-emerald-400">{isAm ? "የበለፀገ ክምችት" : "Upgraded Concentrate"}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="bg-amber-600 w-1/4 h-full" title="Raw ROM Ore" />
                <div className="bg-blue-600 w-1/4 h-full" title="Comminution" />
                <div className="bg-primary w-1/3 h-full" title="Separation Circuit" />
                <div className="bg-emerald-500 w-1/6 h-full" title="Final Clean Cake" />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>15–35% Fe/Base Metal</span>
                <span>→ Comminution →</span>
                <span>&gt;85% Grade Purity</span>
              </div>
            </div>

            {/* Diagnostic Parameters Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">
                  {isAm ? "የመፍጨት መጠን" : "Liberation Mesh"}
                </p>
                <p className="text-base font-bold text-white font-mono">-75 µm to 150 µm</p>
                <p className="text-[10px] text-slate-400">{isAm ? "የጥራጥሬ ነፃ መውጣት" : "Hydrocyclone cut"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">
                  {isAm ? "የክምችት ማሳደጊያ" : "Enrichment Factor"}
                </p>
                <p className="text-base font-bold text-emerald-400 font-mono">3.5x – 12x</p>
                <p className="text-[10px] text-slate-400">{isAm ? "የይዘት ማሻሻያ" : "ROM to concentrate"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">
                  {isAm ? "የፈሳሽ ጥግግት" : "Pulp Density"}
                </p>
                <p className="text-base font-bold text-blue-400 font-mono">25% – 35%</p>
                <p className="text-[10px] text-slate-400">{isAm ? "የፍሎቴሽን አረፋ ፍሰት" : "Solids by weight"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-400 uppercase">
                  {isAm ? "የውሃ መልሶ ማግኛ" : "Recycle Ratio"}
                </p>
                <p className="text-base font-bold text-amber-400 font-mono">80% – 85%</p>
                <p className="text-[10px] text-slate-400">{isAm ? "ዝግ የውሃ ዑደት" : "Closed water circuit"}</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono">BENEFICIATION FLOWSHEET v3.2</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive Beneficiation Flowsheet Diagram */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-1">
              <Cpu className="w-4 h-4" />
              <span>{isAm ? "የሂደት ንድፍ አሳሽ" : "INTERACTIVE PROCESS FLOWSHEET"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              {isAm
                ? "የተቀናጀ የ4-ደረጃ የማዕድን ማበልፀጊያ ፍሰት"
                : "The 4-Stage Mineral Dressing Engineering Flowsheet"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {isAm
                ? "ዝርዝር መረጃውን ለማየት በማናቸውም ደረጃ ላይ ጠቅ ያድርጉ። እያንዳንዱ ደረጃ የቀጣዩ ደረጃ ቀጥተኛ ግብዓት ነው።"
                : "Select any stage node to inspect technical considerations, equipment types, and feed-to-product transformations."}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
            {isAm ? "የተመረጠው ደረጃ:" : "ACTIVE STAGE:"} <span className="text-primary font-bold">{currentStageData.stageNumber}</span>
          </div>
        </div>

        {/* Connected Flowsheet Pipeline (Interactive on Desktop & Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative">
          {flowsheetStages.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveStage(idx);
                  }
                }}
                className={`relative text-left p-5 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${isSelected
                    ? "bg-slate-950 text-white border-primary shadow-lg ring-1 ring-primary"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                  }`}
                role="tab"
                aria-selected={isSelected}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${isSelected
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                  >
                    STAGE {stage.stageNumber}
                  </span>
                  {idx < flowsheetStages.length - 1 && (
                    <ArrowRight
                      className={`w-4 h-4 hidden lg:block ${isSelected ? "text-primary" : "text-slate-400"
                        }`}
                    />
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1">{stage.shortTitle}</h3>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                    }`}
                >
                  {stage.tagline}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span>{isAm ? "ዝርዝር እየታየ ነው" : "INSPECTING..."}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Flowsheet Stage Deep-Dive Inspector Panel */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-primary text-white font-bold">
                  STAGE {currentStageData.stageNumber}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  FLOWSHEET INSPECTOR
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentStageData.name}
              </h3>
            </div>

            {/* Quick Flow Vector */}
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
              <span className="text-amber-400">{currentStageData.flowFeed}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-emerald-400 font-semibold">{currentStageData.flowProduct}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Purpose and Process Role (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                  {isAm ? "የደረጃው የቴክኒክ ዓላማ" : "ENGINEERING PURPOSE & ROLE"}
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {currentStageData.purpose}
                </p>
              </div>

              {/* Connected Flow Indicator */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">
                    {isAm ? "የደረጃው ግብዓት" : "Feed Stream (Inflow)"}
                  </p>
                  <p className="text-sm font-semibold text-amber-300">{currentStageData.flowFeed}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">
                    {isAm ? "የደረጃው ምርት" : "Product Discharge (Outflow)"}
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">{currentStageData.flowProduct}</p>
                </div>
              </div>
            </div>

            {/* Right: Technical Specifications Matrix (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>{isAm ? "የቴክኒክ መለኪያዎች" : "TECHNICAL SPECIFICATIONS"}</span>
                <Sliders className="w-3.5 h-3.5 text-primary" />
              </h4>

              <div className="space-y-3">
                {currentStageData.parameters.map((param, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-2"
                  >
                    <span className="text-xs font-mono text-slate-400">{param.label}</span>
                    <span className="text-xs font-mono font-semibold text-white text-right">
                      {param.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Selectable Engineering Separation Methods Explorer */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-1">
            <Filter className="w-4 h-4" />
            <span>{isAm ? "የማጣሪያ ቴክኖሎጂዎች" : "BENEFICIATION METHODS BENCH"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            {isAm
              ? "አካላዊ እና ኬሚካላዊ የማዕድን መለያ ቴክኒኮች"
              : "Physical & Physicochemical Separation Technologies"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isAm
              ? "የማዕድናትን ተፈጥሯዊ የክብደት፣ የመግነጢሳዊ ስበት እና የገጽታ ኬሚስትሪ ልዩነት መሰረት ያደረጉ የማበልፀጊያ ዘዴዎች።"
              : "Explore the core physical separation mechanisms evaluated for domestic ores to maximize concentrate recovery and mineral purity."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Method Selector Tabs (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {separationMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = activeMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${isSelected
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  role="tab"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{method.name}</p>
                      <p
                        className={`text-[11px] font-mono mt-0.5 ${isSelected ? "text-white/80" : "text-slate-500"
                          }`}
                      >
                        {method.badge}
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

          {/* Right Column: Active Method Technical Spec Card (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  {currentMethodData.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white mt-0.5">
                  {currentMethodData.name}
                </h3>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                BENEFICIATION CIRCUIT
              </span>
            </div>

            {/* Target Commodities */}
            <div className="space-y-1.5 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
              <p className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                {isAm ? "ዋና ተጠቃሚ የማዕድን አይነቶች" : "TARGET MINERAL COMMODITIES"}
              </p>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {currentMethodData.commodities}
              </p>
            </div>

            {/* Engineering Mechanism */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                {isAm ? "የአሰራር ሂደት እና ፊዚካላዊ መርህ" : "OPERATIONAL PRINCIPLE & SEPARATION DYNAMICS"}
              </h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {currentMethodData.mechanism}
              </p>
            </div>

            {/* Operational Specs Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                {isAm ? "የወረዳው የቴክኒክ መለኪያዎች" : "CIRCUIT SPECIFICATIONS"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentMethodData.specs.map((item, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1"
                  >
                    <p className="text-[11px] font-mono text-slate-500 uppercase">{item.key}</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
