"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GlowingCTAProps {
  text?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function GlowingCTA({
  text = "Start Practicing",
  onClick,
  href,
  className = "",
}: GlowingCTAProps) {
  const ButtonContent = () => (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-lg tracking-wide">
        {text}
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </span>
      {/* Glow layers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-[2px] z-0 bg-bg-primary rounded-[10px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl" />
    </>
  );

  const baseStyles = `group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-xl text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${className}`;

  if (href) {
    return (
      <a href={href} className={baseStyles}>
        <ButtonContent />
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseStyles}>
      <ButtonContent />
    </button>
  );
}
