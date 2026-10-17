import React from "react";
import Link from "next/link";
import { 
    FlaskConical, 
    GraduationCap, 
    TrendingUp, 
    Building2, 
    Hammer, 
    Layers, 
    Award, 
    Users, 
    CheckCircle2, 
    ArrowRight,
    Wrench,
    Gem,
    Atom,
    Database,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
    return {
        title: "MIDI - Mineral Industry Facility & Human Resource Development",
        description: "Official institutional overview and 5-Year Flagship Project of the Mineral Industry Development Institute (MIDI), Ministry of Mines, Ethiopia.",
    };
}

export default function MidiPage() {
    const strategicSectors = [
        {
            title: "Metallic & Energy Minerals",
            description: "Gold, iron ore, lithium, tantalum, nickel, coal, and geothermal energy resources driving industrial base.",
            icon: Hammer,
        },
        {
            title: "Agro-Minerals & Fertilizers",
            description: "Potash, phosphate, and agricultural lime supporting national food security and chemical processing.",
            icon: Atom,
        },
        {
            title: "Cement & Ceramic Industries",
            description: "Enhancing raw material formulation, kiln efficiency, and manufacturing standards for construction materials.",
            icon: Building2,
        },
        {
            title: "Glass & Dimensional Stones",
            description: "Commercial marble, granite, basalt, and silica sand extraction, precision cutting, and architectural finishes.",
            icon: Layers,
        },
        {
            title: "Gemstones & Value Addition",
            description: "Lapidary technology, cutting, polishing, and grading for opal, emerald, sapphire, and colored gemstones.",
            icon: Gem,
        },
        {
            title: "Basic Chemicals & Industrial Salts",
            description: "Sodium carbonate, caustic soda, industrial gypsum, and kaolin for domestic manufacturing self-reliance.",
            icon: FlaskConical,
        },
    ];

    const projectOutputs = [
        {
            number: "520+",
            label: "Trained Industry Professionals",
            sublabel: "Short, medium, and long-term MSc/PhD candidates in mining, metallurgy, and mineral economics",
        },
        {
            number: "500M",
            label: "ETB 5-Year Capital Budget",
            sublabel: "Financed by the Government of Ethiopia via the Ministry of Planning & Development (MoPD)",
        },
        {
            number: "5+",
            label: "Strategic R&D Workshops",
            sublabel: "Foundry, mold making, casting, heat treatment, and material characterization laboratories",
        },
        {
            number: "100%",
            label: "Value Chain Technical Support",
            sublabel: "Direct technical backing for Artisanal & Small-Scale Miners (ASM) and commercial enterprises",
        },
    ];

    const technicalDisciplines = [
        "Mineral & Mining Engineering",
        "Mineral Processing & Extractive Metallurgy",
        "Pyro-, Hydro- & Electro-Metallurgy",
        "Materials Science & Characterization",
        "Foundry, Mold Making & Casting Technology",
        "Heat Treatment & Quality Inspection",
        "Mineral Economics & Feasibility Profiling",
        "Environmental Impact Mitigation & ASM Support",
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* Hero Header */}
            <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-24 md:py-32 overflow-hidden border-b border-primary/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs md:text-sm font-semibold tracking-wide mb-6">
                        <Award className="w-4 h-4" />
                        Federal Democratic Republic of Ethiopia • Ministry of Mines
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Mineral Industry <br className="hidden md:inline" />
                        <span className="text-primary">Development Institute (MIDI)</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
                        Established under <span className="text-white font-semibold">Proclamation No. 1263/2014</span> and governed by <span className="text-white font-semibold">Regulation No. 508/2022</span>, MIDI is the national apex body dedicated to applied research & development, state-of-the-art training facilities, and technical excellence across Ethiopia's mineral industry.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href="#project-details">
                            <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-semibold px-8">
                                5-Year National Project <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button size="lg" variant="outline" className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-medium">
                                Laboratory & Consultancy Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Metrics Bar */}
            <section className="bg-white border-b border-slate-200 py-12 relative z-20 -mt-8 mx-4 md:mx-8 rounded-2xl shadow-xl max-w-7xl lg:mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {projectOutputs.map((item, idx) => (
                        <div key={idx} className={`${idx !== 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""}`}>
                            <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">
                                {item.number}
                            </div>
                            <div className="text-base font-bold text-slate-900 mb-1">
                                {item.label}
                            </div>
                            <div className="text-xs text-slate-500 leading-snug">
                                {item.sublabel}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Institutional Mandate Section */}
            <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7">
                        <span className="text-sm font-bold text-primary tracking-widest uppercase mb-3 block">
                            Our Legal Mandate & Institutional Purpose
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-snug">
                            Accelerating Import Substitution, Industrial Productivity & Job Creation
                        </h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                            <p>
                                The mineral sector has been designated as one of the <strong className="text-slate-900">five top priority economic pillars</strong> requiring speedy federal intervention. While Ethiopia is richly endowed with mineral deposits, the domestic processing sector has faced historical efficiency challenges.
                            </p>
                            <p>
                                Five-year industrial averages indicate significant room for productivity enhancement: cement manufacturing has operated at <strong>55%</strong> efficiency, ceramics at <strong>57%</strong>, dimensional stones at <strong>39.5%</strong>, glass at <strong>67%</strong>, and metals below <strong>20%</strong>.
                            </p>
                            <p>
                                MIDI is tasked with reversing these constraints through hands-on technical consultancy, modern material testing, pre-feasibility study document preparation, and building institutional bridges with academia and international research institutes.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" /> Key Institutional Powers
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                Collection, organization, and analytical archiving of mineral data.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                Preparation of detailed resource-oriented pre-feasibility studies for investors.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                Provision of laboratory, chemical, and product testing services.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                Technical assistance and formalization support for Artisanal & Small-Scale Miners (ASM).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                Performance monitoring and bottleneck remedy for active mining investment licenses.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Strategic Commodities */}
            <section className="py-20 bg-slate-100/70 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-bold text-primary tracking-widest uppercase mb-3 block">
                            Priority Commodities
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            Strategic Mineral Value Chains
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg">
                            MIDI delivers targeted technical interventions across the full spectrum of industrial and precious mineral operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {strategicSectors.map((sector, index) => {
                            const IconComponent = sector.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {sector.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {sector.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Flagship Project Details */}
            <section id="project-details" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-14 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <span className="text-sm font-bold text-primary tracking-widest uppercase mb-3 block">
                            National Flagship Project
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Mineral Industry Facility & Human Resource Development Project
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed">
                            Programmed for a 5-year implementation lifespan and submitted to the Ministry of Planning & Development (MoPD), this initiative establishes a world-class training center of excellence and workshop facilities across Addis Ababa and mining regional hubs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Technical Trainings */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Technical Disciplines & Higher Education
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                In collaboration with local and foreign universities, MIDI provides guidance and supervision for Master's and Doctoral (MSc/PhD) theses, producing experts to form an enduring legacy chain of knowledge:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {technicalDisciplines.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Workshop & Facilities */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Wrench className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Advanced Workshop & Tool Room Center
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                Overcoming the high capital cost barrier for individual operators, MIDI avails a central, self-contained workshop and facility:
                            </p>
                            <ul className="space-y-4 text-sm text-slate-700">
                                <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div>
                                        <strong>Mold Making & Foundry:</strong> Precision patterns, casting methodologies, and high-temp furnaces.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div>
                                        <strong>Heat Treatment & Inspection:</strong> Metallurgical testing, quenching, hardness evaluation, and flaw detection.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div>
                                        <strong>Information & Knowledge Database:</strong> Centralized digital archives of national mineral exploration and test data.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stakeholders & Beneficiaries */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-bold text-primary tracking-widest uppercase mb-3 block">
                            Shared National Prosperity
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Project Beneficiaries
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg">
                            The outputs of the MIDI development program benefit key stakeholders across the entire Ethiopian mineral ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Ministry & Regional Bureaus",
                                desc: "Upgraded technical oversight, automated mineral data, and trained regulatory personnel.",
                            },
                            {
                                title: "Artisanal & Small Miners (ASM)",
                                desc: "Access to modern recovery equipment, environmental training, and formal market linkages.",
                            },
                            {
                                title: "Private Mining Enterprises",
                                desc: "Access to certified testing labs, pre-feasibility documents, and skilled local engineers.",
                            },
                            {
                                title: "Universities & TVETs",
                                desc: "Curriculum co-development, joint research publications, and state-of-the-art student internships.",
                            },
                        ].map((b, i) => (
                            <div key={i} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold mb-4">
                                        0{i + 1}
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{b.title}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/contact">
                            <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-bold px-10">
                                Partner with MIDI Today
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
