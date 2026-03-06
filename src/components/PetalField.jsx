import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Simple SVG for a rose petal
const PetalSVG = () => (
  <svg viewBox="0 0 30 30" className="w-full h-full text-pink-300/60 mix-blend-multiply filter drop-shadow-sm">
    <path d="M15,0 C5,5 0,15 5,20 C10,25 20,25 25,20 C30,15 25,5 15,0 Z" fill="currentColor" />
  </svg>
);

export const PetalField = ({ count = 30 }) => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate initial petals
    const newPetals = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 10, // seconds
      duration: 5 + Math.random() * 5, // Fall speed
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ 
            y: -50, 
            opacity: 0, 
            x: `${petal.left}vw`, 
            rotate: petal.rotation 
          }}
          animate={{ 
            y: '110vh', 
            opacity: [0, 1, 1, 0],
            rotate: petal.rotation + 360 
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
            opacity: { duration: petal.duration, times: [0, 0.1, 0.9, 1] }
          }}
          style={{ 
            width: `${20 * petal.scale}px`, 
            height: `${20 * petal.scale}px`,
            position: 'absolute',
          }}
        >
          <PetalSVG />
        </motion.div>
      ))}
    </div>
  );
};
