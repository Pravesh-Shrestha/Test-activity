import React from 'react';
import { motion } from 'framer-motion';

const BOUQUET_IMG = import.meta.env.BASE_URL + 'rose.png';

export function Bouquet({ show }) {
  if (!show) return null;

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.86 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, type: 'spring', bounce: 0.35 }}
        className="relative w-[320px] md:w-[430px]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-3xl overflow-hidden border border-red-300/30 shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(244, 63, 94, 0.28)' }}
        >
          <img
            src={BOUQUET_IMG}
            alt="Bouquet"
            className="w-full h-auto object-cover"
          />

          {/* Subtle cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-red-300/10" />

          {/* Shine pass */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-16deg]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
