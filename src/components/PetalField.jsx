import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─── Realistic Rose Petal shapes ─── */
const petalPaths = [
  "M15,0 C5,5 0,15 5,22 C10,28 20,28 25,22 C30,15 25,5 15,0 Z",
  "M12,0 C3,8 -2,18 4,25 C9,30 22,28 26,20 C29,13 22,3 12,0 Z",
  "M14,0 C6,4 1,14 3,23 C6,29 18,30 24,24 C28,17 24,6 14,0 Z",
];

const petalColors = [
  { fill: '#fca5a5', stroke: '#ef4444' },
  { fill: '#f87171', stroke: '#dc2626' },
  { fill: '#fb7185', stroke: '#be123c' },
  { fill: '#fecdd3', stroke: '#e11d48' },
  { fill: '#fda4af', stroke: '#b91c1c' },
  { fill: '#fee2e2', stroke: '#f43f5e' },
];

const Petal = ({ size, colorIndex = 0 }) => {
  const path = petalPaths[colorIndex % petalPaths.length];
  const colors = petalColors[colorIndex % petalColors.length];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
    >
      <path d={path} fill={colors.fill} stroke={colors.stroke} strokeWidth="0.3" opacity="0.85" />
      {/* Vein detail */}
      <path d="M15,2 Q14,14 13,25" stroke={colors.stroke} strokeWidth="0.3" fill="none" opacity="0.3" />
    </svg>
  );
};

export const PetalField = ({ count = 30 }) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      scale: 0.4 + Math.random() * 0.9,
      rotateStart: Math.random() * 360,
      swayAmount: 3 + Math.random() * 8,
      colorIndex: Math.floor(Math.random() * petalColors.length),
      flip: Math.random() > 0.5,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: -60,
            x: `${p.x}vw`,
            rotate: p.rotateStart,
            rotateY: p.flip ? 180 : 0,
            opacity: 0,
          }}
          animate={{
            y: '115vh',
            rotate: p.rotateStart + 540 + Math.random() * 360,
            rotateY: p.flip ? [180, 0, 180] : [0, 180, 0],
            x: [
              `${p.x}vw`,
              `${p.x + p.swayAmount}vw`,
              `${p.x - p.swayAmount * 0.5}vw`,
              `${p.x + p.swayAmount * 0.7}vw`,
              `${p.x}vw`,
            ],
            opacity: [0, 0.9, 0.9, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute top-0 left-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Petal size={28 * p.scale} colorIndex={p.colorIndex} />
        </motion.div>
      ))}
    </div>
  );
};
