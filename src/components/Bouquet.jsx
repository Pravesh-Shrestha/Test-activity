import React from 'react';
import { motion } from 'framer-motion';

const BOUQUET_IMG = import.meta.env.BASE_URL + 'rose.png';

export function Bouquet({ show }) {
  if (!show) return null;

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        initial={{ y: 70, opacity: 0, scale: 0.8, rotateX: -12 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.1, type: 'spring', bounce: 0.4 }}
        className="relative w-[320px] md:w-[430px]"
        whileHover={{ y: -4 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 0.8, -0.8, 0] }}
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

          <motion.div
            className="absolute inset-0 border-2 border-rose-200/0 rounded-3xl"
            whileHover={{ borderColor: 'rgba(251, 191, 204, 0.4)' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
