"use client";

import { motion, Variants } from "framer-motion";

export function AlgorithmFlowLines() {
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5;
      return {
        pathLength: 1,
        opacity: [0, 1, 1, 0],
        transition: {
          pathLength: { delay, type: "spring", duration: 2, bounce: 0 },
          opacity: { delay, duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 },
        },
      };
    },
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
        type: "spring",
      },
    }),
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-40">
      <svg
        className="w-[800px] h-[600px] text-cyan-500 max-w-full"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Nodes */}
        <motion.circle cx="400" cy="150" r="8" fill="#06b6d4" custom={0} variants={nodeVariants} initial="hidden" animate="visible" />
        <motion.circle cx="200" cy="300" r="12" fill="#8b5cf6" custom={1} variants={nodeVariants} initial="hidden" animate="visible" />
        <motion.circle cx="600" cy="300" r="12" fill="#db2777" custom={2} variants={nodeVariants} initial="hidden" animate="visible" />
        <motion.circle cx="300" cy="450" r="8" fill="#3b82f6" custom={3} variants={nodeVariants} initial="hidden" animate="visible" />
        <motion.circle cx="500" cy="450" r="8" fill="#34d399" custom={4} variants={nodeVariants} initial="hidden" animate="visible" />
        <motion.circle cx="400" cy="550" r="10" fill="#f87171" custom={5} variants={nodeVariants} initial="hidden" animate="visible" />

        {/* Lines */}
        <motion.path
          d="M 400 150 Q 300 225 200 300"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 400 150 Q 500 225 600 300"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={1}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 200 300 Q 250 375 300 450"
          stroke="url(#gradient3)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={2}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 600 300 Q 550 375 500 450"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={3}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 300 450 Q 350 500 400 550"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={4}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 500 450 Q 450 500 400 550"
          stroke="url(#gradient3)"
          strokeWidth="3"
          strokeLinecap="round"
          custom={5}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Dynamic Nodes pulsing on top */}
        <motion.circle
          cx="400" cy="150" r="16" fill="transparent" stroke="#06b6d4" strokeWidth="2"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="200" cy="300" r="24" fill="transparent" stroke="#8b5cf6" strokeWidth="2"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
