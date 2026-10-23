"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Filter, Zap, Sliders, FlaskConical, ArrowRight, BookOpen, Wrench } from "lucide-react";

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

  const MethodIcon = currentMethodData.icon;

  return (
    <div className="flex flex-col gap-5">
      {/* Flowsheet stage selector */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <h2 className="text-lg md:text-xl font-bold text-slate-900">
          {isAm ? "የተቀናጀ የ4-ደረጃ የማዕድን ማበልፀጊያ ፍሰት" : "The 4-Stage Mineral Dressing Engineering Flowsheet"}
        </h2>
        <p className="text-sm text-slate-500">
          {isAm ? "ዝርዝር መረጃውን ለማየት በማናቸውም ደረጃ ላይ ጠቅ ያድርጉ።" : "Select a stage to inspect its parameters."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {flowsheetStages.map((stage, idx) => {
          const active = idx === activeStage;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(idx)}
              aria-pressed={active}
              className={`rounded-xl p-4 text-start flex flex-col gap-1.5 transition-colors ${
                active
                  ? "bg-slate-950 text-white"
                  : "bg-white border border-slate-200 text-slate-900 hover:border-primary/50"
              }`}
            >
              <span className={`font-mono text-xs ${active ? "text-amber-400" : "text-primary"}`}>
                {isAm ? "ደረጃ" : "STAGE"} {stage.stageNumber}
              </span>
              <span className="text-sm md:text-[15px] font-semibold leading-snug">{stage.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Selected stage */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">{currentStageData.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{currentStageData.tagline}</p>
            </div>
            <span className="font-mono text-xs text-slate-500 shrink-0">{activeStage + 1} / {flowsheetStages.length}</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{currentStageData.purpose}</p>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-700">
              <span className="text-slate-500">{isAm ? "የደረጃው ግብዓት" : "Feed"}: </span>
              {currentStageData.flowFeed}
            </span>
            <ArrowRight className="w-4 h-4 text-primary rtl:rotate-180" aria-hidden="true" />
            <span className="rounded-md bg-amber-50 px-2.5 py-1.5 text-amber-900">
              <span className="text-amber-800/80">{isAm ? "የደረጃው ምርት" : "Product"}: </span>
              {currentStageData.flowProduct}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStageData.parameters.map((param, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 px-4 py-3 flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{param.label}</span>
                <span className="text-sm font-semibold text-slate-900">{param.val}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-1">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              <Wrench className="w-4 h-4" />
              {isAm ? "የቴክኒክ የማማከር አገልግሎቶች" : "Technical Process Advisory"}
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              {isAm ? "የሂደት ጥናቶች እና ህትመቶች" : "Processing Studies & Publications"}
            </Link>
          </div>
        </div>

        {/* Separation methods */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-slate-900">
            {isAm ? "አካላዊ እና ኬሚካላዊ የማዕድን መለያ ቴክኒኮች" : "Physical & Physicochemical Separation Technologies"}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {separationMethods.map((method) => {
              const Icon = method.icon;
              const active = method.id === activeMethod;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setActiveMethod(method.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm font-semibold transition-colors ${
                    active ? "bg-amber-50 text-amber-900 ring-1 ring-primary/40" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-slate-400"}`} />
                  <span className="leading-snug">{method.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <MethodIcon className="w-4 h-4" />
              {currentMethodData.badge}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {isAm ? "ዋና ተጠቃሚ የማዕድን አይነቶች" : "Target Mineral Commodities"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{currentMethodData.commodities}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{currentMethodData.mechanism}</p>
            <dl className="grid grid-cols-2 gap-2">
              {currentMethodData.specs.map((spec, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 px-3 py-2">
                  <dt className="text-[11px] text-slate-500">{spec.key}</dt>
                  <dd className="text-xs font-semibold text-slate-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
