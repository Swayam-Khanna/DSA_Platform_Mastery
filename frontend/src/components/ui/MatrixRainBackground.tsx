"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function MatrixRainBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // We'll use a 2D Canvas for the Matrix Rain effect as it's highly efficient for this specific text-based effect, 
    // blending it with the 3D-like glow required by the brand.
    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Characters - mix of Katakana, Latin, and Numerals
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";
    const chars = charset.split("");

    const fontSize = 14;
    const columns = width / fontSize;

    // Array of drops - one per column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start off screen randomly
    }

    // Brand colors
    const colors = [
      "#06b6d4", // Cyan
      "#8b5cf6", // Purple
      "#db2777", // Pink
      "#3b82f6", // Blue
    ];

    const draw = () => {
      // Translucent black background to create trail effect
      ctx.fillStyle = "rgba(5, 5, 16, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + "px 'JetBrains Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        // A random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Pick a random brand color with a slight glow effect
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Make the leading character bright white, trailing characters colored
        if (Math.random() > 0.95) {
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ffffff";
        } else {
            ctx.fillStyle = baseColor;
            ctx.shadowBlur = 5;
            ctx.shadowColor = baseColor;
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0; // Reset shadow

        // Sending the drop back to the top randomly after it has crossed the screen
        // Adding a randomness to the reset to make the rain scattered
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40); // 25fps for the classic feel

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Adjust drops array size
      const newColumns = width / fontSize;
      if (newColumns > drops.length) {
          for(let i = drops.length; i < newColumns; i++){
              drops[i] = Math.random() * -100;
          }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && canvas.parentNode) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{
        background: "var(--bg-primary)",
      }}
    />
  );
}
