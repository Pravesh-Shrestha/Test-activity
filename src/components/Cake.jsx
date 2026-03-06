import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ─── Animated candle flame ─── */
const Flame = ({ isOn }) => (
  <AnimatePresence>
    {isOn && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-7 left-1/2 -translate-x-1/2"
      >
        <motion.svg
          width="16" height="24" viewBox="0 0 16 24"
          animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1], scaleY: [1, 1.1, 0.9, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,200,50,0.8))' }}
        >
          {/* Outer glow */}
          <ellipse cx="8" cy="18" rx="6" ry="4" fill="#fef08a" opacity="0.3" />
          {/* Outer flame */}
          <path d="M8,0 Q2,10 4,18 Q6,22 8,22 Q10,22 12,18 Q14,10 8,0 Z" fill="#fbbf24" />
          {/* Inner flame */}
          <path d="M8,6 Q5,12 6,18 Q7,20 8,20 Q9,20 10,18 Q11,12 8,6 Z" fill="#fef08a" />
          {/* Core */}
          <path d="M8,10 Q6.5,14 7,18 Q7.5,19 8,19 Q8.5,19 9,18 Q9.5,14 8,10 Z" fill="white" opacity="0.7" />
        </motion.svg>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Single candle with striped pattern ─── */
const Candle = ({ isOn, color1, color2, height = 52 }) => (
  <div className="relative flex flex-col items-center">
    <Flame isOn={isOn} />
    {/* Wick */}
    <div className="w-[1.5px] h-3 bg-gray-700 rounded-full" />
    {/* Candle body with stripes */}
    <div
      className="w-3 rounded-sm overflow-hidden border border-white/30"
      style={{
        height: `${height}px`,
        background: `repeating-linear-gradient(180deg, ${color1} 0px, ${color1} 4px, ${color2} 4px, ${color2} 8px)`,
        boxShadow: 'inset 1px 0 2px rgba(255,255,255,0.3), inset -1px 0 2px rgba(0,0,0,0.1)',
      }}
    />
  </div>
);

/* ─── Frosting drip shape ─── */
const FrostingDrip = ({ left, height, color = 'white' }) => (
  <div
    className="absolute"
    style={{
      left: `${left}%`,
      top: '-2px',
      width: '18px',
      height: `${height}px`,
      background: color,
      borderRadius: '0 0 50% 50%',
      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))',
    }}
  />
);

/* ─── Realistic Cake Component ─── */
export function Cake({ onCut, dogBark }) {
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    let audioContext;
    let analyser;
    let javascriptNode;

    const startListening = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;
          for (let i = 0; i < array.length; i++) values += array[i];
          const average = values / array.length;

          if (average > 50 && !allBlown) blowOutCandle();
        };
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    };

    startListening();

    return () => {
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      if (javascriptNode) {
        javascriptNode.disconnect();
        javascriptNode.onaudioprocess = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [allBlown]);

  const blowOutCandle = () => {
    setCandles(prev => {
      const active = prev.map((on, i) => on ? i : -1).filter(i => i !== -1);
      if (active.length === 0) return prev;

      const idx = active[Math.floor(Math.random() * active.length)];
      const next = [...prev];
      next[idx] = false;

      if (next.every(c => !c)) {
        setAllBlown(true);
        if (dogBark) dogBark();
        onCut();
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
        setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { y: 0.4, x: 0.3 } }), 300);
        setTimeout(() => confetti({ particleCount: 100, spread: 60, origin: { y: 0.4, x: 0.7 } }), 500);
      }
      return next;
    });
  };

  const candleColors = [
    ['#93c5fd', '#60a5fa'], ['#c4b5fd', '#a78bfa'],
    ['#fda4af', '#fb7185'], ['#86efac', '#4ade80'], ['#fde68a', '#fbbf24'],
  ];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      className="relative mx-auto w-full max-w-[320px] px-2"
    >
      {/* ─── Candles ─── */}
      <div className="relative flex justify-center gap-5 md:gap-8 mb-1 z-10">
        {candles.map((isOn, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Candle isOn={isOn} color1={candleColors[i][0]} color2={candleColors[i][1]} height={40 + (i % 2) * 12} />
          </motion.div>
        ))}
      </div>

      {/* ─── Cake Body ─── */}
      <div className="relative" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>

        {/* === Top Tier === */}
        <div className="relative mx-auto rounded-t-xl overflow-hidden w-[60%] md:w-[200px] h-[50px] md:h-[55px]">
          {/* Cake base color */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-300" />
          {/* Frosting top */}
          <div className="absolute top-0 left-0 right-0 h-5 bg-white rounded-b-lg" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.05))' }} />
          {/* Drips */}
          <FrostingDrip left={10} height={18} />
          <FrostingDrip left={25} height={24} />
          <FrostingDrip left={45} height={14} />
          <FrostingDrip left={62} height={28} />
          <FrostingDrip left={80} height={20} />
          {/* Strawberry decorations */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4 text-lg">
            <span>🍓</span><span>🫐</span><span>🍓</span>
          </div>
        </div>

        {/* === Middle Tier === */}
        <div className="relative mx-auto overflow-hidden w-[80%] md:w-[260px] h-[55px] md:h-[60px]">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-100 to-rose-200" />
          {/* Cream band */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-pink-50 to-transparent" />
          {/* Decorative piping dots */}
          <div className="absolute top-3 left-0 right-0 flex justify-around px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{
                background: i % 2 === 0 ? '#fbbf24' : '#f9a8d4',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }} />
            ))}
          </div>
          {/* Rose piping around middle */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
            {['🌹','🌸','🌹','🌸','🌹'].map((e, i) => (
              <span key={i} className="text-sm">{e}</span>
            ))}
          </div>
          {/* Drips */}
          <FrostingDrip left={5} height={16} color="#fff1f2" />
          <FrostingDrip left={20} height={22} color="#fff1f2" />
          <FrostingDrip left={38} height={12} color="#fff1f2" />
          <FrostingDrip left={55} height={26} color="#fff1f2" />
          <FrostingDrip left={72} height={18} color="#fff1f2" />
          <FrostingDrip left={88} height={14} color="#fff1f2" />
        </div>

        {/* === Bottom Tier === */}
        <div className="relative mx-auto rounded-b-2xl overflow-hidden w-[95%] md:w-[310px] h-[60px] md:h-[70px]">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200" />
          {/* Gold ribbon band */}
          <div className="absolute top-2 left-0 right-0 h-5 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 opacity-80" />
          {/* Pattern on band */}
          <div className="absolute top-2 left-0 right-0 h-5 flex items-center justify-center">
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
              ))}
            </div>
          </div>
          {/* Bottom decorative border */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-pink-300 to-transparent" />
          {/* Arch details */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-around px-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-6 h-3 border-t-2 border-pink-300/50 rounded-t-full" />
            ))}
          </div>
        </div>

        {/* === Cake Board === */}
        <div className="mx-auto rounded-full h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shadow-inner w-full md:w-[340px]" />
      </div>

      {/* ─── Prompt ─── */}
      <AnimatePresence>
        {!allBlown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-pink-100"
            >
              <span className="text-2xl">🎤</span>
              <span className="text-pink-700 font-semibold text-sm md:text-base">Blow into your mic to blow the candles!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Success message ─── */}
      <AnimatePresence>
        {allBlown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
          >
            <motion.p
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl md:text-2xl font-serif text-pink-600 font-bold"
            >
              Yay! Happy Birthday! 🎉
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
