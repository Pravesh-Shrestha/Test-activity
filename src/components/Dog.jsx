import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

/* ─── Bruno the Dog ─── */
const BRUNO_IMG = import.meta.env.BASE_URL + 'bruno.png';

/* ─── Bark Sound Effect ─── */
export const playBark = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const t = ctx.currentTime;

  // First bark - higher pitch
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(350, t);
  osc1.frequency.exponentialRampToValueAtTime(120, t + 0.12);
  gain1.gain.setValueAtTime(0.15, t);
  gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(t);
  osc1.stop(t + 0.15);

  // Second bark - slightly lower, delayed
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(300, t + 0.25);
  osc2.frequency.exponentialRampToValueAtTime(80, t + 0.38);
  gain2.gain.setValueAtTime(0.12, t + 0.25);
  gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.38);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(t + 0.25);
  osc2.stop(t + 0.4);
};

/* ─── Dog component with Bruno image ─── */
export function Dog({ show = true, isBarking = false }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      className="relative z-50 w-20 md:w-48"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
    >
      <motion.img
        src={BRUNO_IMG}
        alt="Bruno the Guide Dog"
        className="w-full h-auto object-contain rounded-full border-4 border-white/60 shadow-lg"
        animate={isBarking ? {
          rotate: [0, -5, 5, -3, 3, 0],
          scale: [1, 1.05, 1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
      />

      {/* Bark indicator bubbles */}
      <AnimatePresence>
        {isBarking && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 30, y: -20 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-0 right-[-10px] bg-white rounded-full px-2 py-1 text-xs font-bold text-pink-500 shadow-md border border-pink-100"
            >
              Woof!
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 35, y: -5 }}
              animate={{ scale: 0.8, opacity: 0.7 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 right-[-18px] bg-white rounded-full px-1.5 py-0.5 text-[10px] font-bold text-pink-400 shadow-sm border border-pink-50"
            >
              Woof!
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Guide component with speech bubble ─── */
export function Guide({ text, show = true, isBarking = false }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-2 md:left-4 z-50 flex flex-col items-start gap-2 pb-3 md:pb-4 max-w-[260px] md:max-w-[320px]">

      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ scale: 0.7, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(
            "relative bg-white/95 backdrop-blur-xl px-5 py-3.5 rounded-2xl rounded-bl-sm",
            "shadow-lg border border-pink-100/80 mb-1"
          )}
        >
          {/* Decorative arch pattern at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 rounded-t-2xl opacity-60" />

          <p className="text-gray-700 font-semibold text-xs md:text-base leading-relaxed font-sans">
            {text}
          </p>

          {/* Tail triangle */}
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-pink-100/80" />
        </motion.div>
      </AnimatePresence>

      {/* Bruno */}
      <Dog isBarking={isBarking} />
    </div>
  );
}
