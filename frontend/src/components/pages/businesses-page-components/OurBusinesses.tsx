"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue, Variants } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useGetBusinessOverviewQuery, useGetBusinessNodesQuery, BusinessNode } from '@/redux/api/businessApi';
import { OurBusinessesSkeleton } from "@/components/skeletons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Sub-component for animated lines to use hooks safely
const ConnectingLine = ({
  node,
  hoveredNode,
  yCenterTemplate,
  scrollYProgress
}: {
  node: BusinessNode;
  hoveredNode: string | null;
  yCenterTemplate: MotionValue<string>;
  scrollYProgress: MotionValue<number>;
}) => {
  const isHovered = hoveredNode === node.business_node_id;
  const isAnyHovered = hoveredNode !== null;

  const yNodes = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const yNodeTemplate = useTransform(yNodes, (y) => `calc(${node.position_y}% + ${y}px)`);

  return (
    <motion.line
      x1="50%"
      y1={yCenterTemplate as any}
      x2={`${node.position_x}%`}
      y2={yNodeTemplate as any}
      className={isHovered ? "stroke-primary" : "stroke-white/20"}
      strokeWidth={isHovered ? 2 : 1.5}
      strokeDasharray={isHovered ? "none" : "4 4"}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{
        pathLength: { duration: 1.2, delay: 0.5, ease: "easeOut" },
        opacity: { duration: 0.3 }
      }}
      animate={{
        opacity: isHovered ? 1 : (isAnyHovered ? 0.2 : 1)
      }}
    />
  );
};

export default function OurBusinesses() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { data: overview, isLoading: isOverviewLoading } = useGetBusinessOverviewQuery();
  const { data: businessNodes = [], isLoading: isNodesLoading } = useGetBusinessNodesQuery();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yCenter = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const yNodes = useTransform(scrollYProgress, [0, 1], [35, -35]);

  const yCenterTemplate = useTransform(yCenter, (y) => `calc(50% + ${y}px)`);

  if (isOverviewLoading || isNodesLoading) {
      return <OurBusinessesSkeleton />;
  }

  if (!overview || businessNodes.length === 0) {
      return null;
  }

  const scrollToNext = () => {
    const nextSection = document.getElementById('business-overview');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden lg:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8">

          {/* Left Side: Content (45%) */}
          <motion.div
            className="w-full xl:w-[42%] flex flex-col items-start z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.span variants={itemVariants} className="text-primary font-semibold tracking-wider text-sm uppercase mb-4">

            </motion.span>

            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-heading leading-tight mb-6">
              {overview.title_part1}<br />
              <span className="text-secondary">{overview.title_part2}</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-body font-medium mb-4 max-w-xl">
              {overview.description1}
            </motion.p>

            <motion.p variants={itemVariants} className="text-muted text-base mb-10 max-w-xl leading-relaxed">
              {overview.description2}
            </motion.p>
          </motion.div>

          {/* Right Side: Ecosystem Diagram (55%) */}
          <div className="w-full xl:w-[58%] relative min-h-[750px] flex items-center justify-center">

            {/* Dark premium background panel */}
            <div className="absolute inset-0 bg-[#0F172A] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              {/* Subtle gradients and lines */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B]/60 via-transparent to-transparent"></div>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

              {/* Desktop Connecting Lines SVG */}
              <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
                {businessNodes.map((node) => (
                  <ConnectingLine
                    key={`line-${node.business_node_id}`}
                    node={node}
                    hoveredNode={hoveredNode}
                    yCenterTemplate={yCenterTemplate}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </svg>
            </div>

            {/* Desktop Layout Nodes */}
            <div className="hidden md:block absolute inset-0 pointer-events-none">
              {/* Central Element */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <motion.div
                  style={{ y: yCenter }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center w-48 h-48 bg-[#0F172A]/90 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_12s_linear_infinite]"></div>
                  <h3 className="text-white font-bold text-2xl text-center leading-none tracking-wider mb-2">
                    {(() => {
                      const centerTitle = businessNodes.find(n => n.id_string === 'center')?.title || "MIDI\nETHIOPIA";
                      return centerTitle.split('\\n').map((line, idx, arr) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    })()}
                  </h3>
                  <p className="text-primary text-[10px] uppercase font-semibold tracking-widest text-center w-3/4">
                    {businessNodes.find(n => n.id_string === 'center')?.description || "Mineral Industry Development"}
                  </p>
                </motion.div>
              </div>

              {businessNodes.filter(n => n.id_string !== 'center').map((node, i) => {
                const Icon = (LucideIcons as any)[node.icon || 'HelpCircle'] || LucideIcons.HelpCircle;
                return (
                <div key={node.business_node_id} className="absolute pointer-events-auto" style={{ left: `${node.position_x}%`, top: `${node.position_y}%`, transform: 'translate(-50%, -50%)' }}>
                  <motion.div
                    style={{ y: yNodes }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                  >
                    <motion.div
                      animate={{
                        scale: hoveredNode === node.business_node_id ? 1.05 : (hoveredNode !== null ? 0.95 : 1),
                        opacity: hoveredNode === node.business_node_id ? 1 : (hoveredNode !== null ? 0.5 : 1),
                      }}
                      onMouseEnter={() => setHoveredNode(node.business_node_id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`relative z-10 w-44 group flex flex-col items-center text-center p-4 rounded-xl backdrop-blur-md border transition-colors duration-300 cursor-default
                        ${hoveredNode === node.business_node_id ? 'bg-white/10 border-primary/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]' : 'bg-white/5 border-white/10'}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300
                        ${hoveredNode === node.business_node_id ? 'bg-primary' : 'bg-secondary/80'}
                      `}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className={`font-bold text-sm tracking-wide mb-1 transition-colors ${hoveredNode === node.business_node_id ? 'text-primary' : 'text-white'}`}>
                        {node.title}
                      </h4>
                      <p className="text-white/70 text-xs leading-snug">
                        {node.description}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              )})}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col w-full px-4 py-12 relative z-10 space-y-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center mb-6"
              >
                <div className="w-28 h-28 rounded-full border border-primary/30 flex items-center justify-center bg-[#0F172A] shadow-lg mb-4 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_12s_linear_infinite]"></div>
                  <h3 className="text-white font-bold text-sm leading-none tracking-wider">
                    {(() => {
                      const centerTitle = businessNodes.find(n => n.id_string === 'center')?.title || "MIDI\nETHIOPIA";
                      return centerTitle.split('\\n').map((line, idx, arr) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    })()}
                  </h3>
                </div>
                <p className="text-primary text-xs uppercase font-semibold tracking-widest">
                  {businessNodes.find(n => n.id_string === 'center')?.description || "Mineral Industry Development"}
                </p>
              </motion.div>

              <div className="flex flex-col space-y-4 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[2.25rem] top-4 bottom-8 w-px bg-gradient-to-b from-primary/50 via-white/20 to-transparent"></div>

                {[...businessNodes].filter(n => n.id_string !== 'center').sort((a, b) => a.mobile_order - b.mobile_order).map((node, index) => {
                  const Icon = (LucideIcons as any)[node.icon || 'HelpCircle'] || LucideIcons.HelpCircle;
                  return (
                    <motion.div
                      key={node.business_node_id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center space-x-4 pl-4 group relative"
                    >
                      {/* Node connector dot */}
                      <div className="absolute left-[2.25rem] w-2 h-2 rounded-full bg-primary/50 -translate-x-1/2"></div>

                      <div className="relative z-10 w-10 h-10 rounded-full bg-secondary/80 flex-shrink-0 flex items-center justify-center border border-white/10 group-active:bg-primary transition-colors">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <h4 className="text-white font-bold text-sm tracking-wide mb-1">{node.title}</h4>
                        <p className="text-white/70 text-xs leading-snug">{node.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
