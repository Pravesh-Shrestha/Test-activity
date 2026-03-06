import React from 'react';
import { motion } from 'framer-motion';

const ROSE_IMG = import.meta.env.BASE_URL + 'rose.png';

const RoseImage = ({ x, y, scale = 1, delay = 0, rotate = 0 }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0, y: 20 }}
    animate={{ scale, opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.7, type: 'spring', bounce: 0.45 }}
    style={{ transformOrigin: `${x}px ${y}px` }}
  >
    <motion.image
      href={ROSE_IMG}
      x={x - 36}
      y={y - 42}
      width="72"
      height="72"
      preserveAspectRatio="xMidYMid meet"
      transform={`rotate(${rotate} ${x} ${y})`}
      animate={{ filter: ['drop-shadow(0 0 0px rgba(255,255,255,0.0))', 'drop-shadow(0 0 10px rgba(244,63,94,0.45))', 'drop-shadow(0 0 0px rgba(255,255,255,0.0))'] }}
      transition={{ duration: 3.2, delay, repeat: Infinity }}
    />
  </motion.g>
);

const Stem = ({ x1, y1, x2, y2, delay = 0 }) => (
  <motion.path
    d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + 30} ${x2},${y2}`}
    stroke="#166534"
    strokeWidth="3"
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ delay, duration: 0.8 }}
  />
);

const Leaf = ({ x, y, rotate = 0, delay = 0 }) => (
  <motion.path
    d={`M${x},${y} q10,-18 20,0 q-10,8 -20,0 Z`}
    fill="#2f7a31"
    opacity="0.85"
    transform={`rotate(${rotate} ${x} ${y})`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 0.85 }}
    transition={{ delay, duration: 0.5 }}
  />
);

const FallingPetal = ({ delay }) => {
  const startX = 110 + Math.random() * 180;
  return (
    <motion.ellipse
      rx="4"
      ry="7"
      fill="#fb7185"
      opacity="0.7"
      initial={{ cx: startX, cy: 100, rotate: 0 }}
      animate={{
        cy: [100, 470],
        cx: [startX, startX + (Math.random() * 60 - 30)],
        rotate: [0, 420],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{ duration: 4.5 + Math.random() * 2.5, delay, repeat: Infinity, ease: 'linear' }}
      style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.45))' }}
    />
  );
};

export function Bouquet({ show }) {
  if (!show) return null;

  const roses = [
    { x: 200, y: 128, scale: 1.15, delay: 0.0, rotate: -8 },
    { x: 170, y: 154, scale: 1.03, delay: 0.12, rotate: -16 },
    { x: 230, y: 154, scale: 1.03, delay: 0.18, rotate: 10 },
    { x: 145, y: 182, scale: 0.95, delay: 0.26, rotate: -10 },
    { x: 255, y: 182, scale: 0.95, delay: 0.3, rotate: 12 },
    { x: 200, y: 182, scale: 1.0, delay: 0.22, rotate: 0 },
    { x: 125, y: 212, scale: 0.86, delay: 0.38, rotate: -12 },
    { x: 275, y: 212, scale: 0.86, delay: 0.42, rotate: 14 },
  ];

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        initial={{ y: 70, opacity: 0, scale: 0.86 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, type: 'spring', bounce: 0.25 }}
        className="relative w-[320px] h-[400px] md:w-[420px] md:h-[520px]"
      >
        <svg viewBox="0 0 400 500" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 32px rgba(127, 29, 29, 0.35))' }}>
          <defs>
            <linearGradient id="wrapGradDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="45%" stopColor="#fecdd3" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <linearGradient id="ribbonGradDark" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>

          {/* Wrapper */}
          <path d="M92,260 L308,260 L200,495 Z" fill="url(#wrapGradDark)" />
          <path d="M92,260 L200,495 L80,318 Z" fill="#fbcfe8" opacity="0.6" />
          <path d="M308,260 L200,495 L320,318 Z" fill="#fda4af" opacity="0.55" />

          {/* Stems */}
          {roses.map((r, i) => (
            <Stem key={`s-${i}`} x1={r.x} y1={r.y + 10} x2={195 + (i - 2) * 4} y2={462} delay={0.15 + i * 0.05} />
          ))}

          {/* Leaves */}
          <Leaf x={136} y={265} rotate={-26} delay={0.5} />
          <Leaf x={162} y={280} rotate={-14} delay={0.6} />
          <Leaf x={242} y={276} rotate={16} delay={0.55} />
          <Leaf x={266} y={262} rotate={28} delay={0.65} />

          {/* Rose images */}
          {roses.map((rose, i) => (
            <RoseImage key={`r-${i}`} {...rose} />
          ))}

          {/* Falling petals */}
          {Array.from({ length: 10 }).map((_, i) => (
            <FallingPetal key={`p-${i}`} delay={1.1 + i * 0.45} />
          ))}

          {/* Ribbon */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6, type: 'spring' }}
            style={{ transformOrigin: '200px 292px' }}
          >
            <path d="M138,278 Q200,312 262,278 L262,302 Q200,336 138,302 Z" fill="url(#ribbonGradDark)" />
            <ellipse cx="200" cy="290" rx="12" ry="8" fill="#7f1d1d" />
            <text x="200" y="297" textAnchor="middle" fill="#ffe4e6" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              HAPPY BIRTHDAY
            </text>
          </motion.g>

          {/* White sparkles */}
          {[{ x: 154, y: 116 }, { x: 246, y: 116 }, { x: 118, y: 186 }, { x: 282, y: 186 }].map((sp, i) => (
            <motion.g
              key={`sp-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 2.3 }}
            >
              <line x1={sp.x - 4} y1={sp.y} x2={sp.x + 4} y2={sp.y} stroke="#fff1f2" strokeWidth="1.5" />
              <line x1={sp.x} y1={sp.y - 4} x2={sp.x} y2={sp.y + 4} stroke="#fff1f2" strokeWidth="1.5" />
            </motion.g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
