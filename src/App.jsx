import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Heart, Star, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Guide, Dog, playBark } from './components/Dog';
import { Cake } from './components/Cake';
import { PetalField } from './components/PetalField';
import { Bouquet } from './components/Bouquet';
import { useBirthdayTune } from './hooks/useBirthdayTune';
import { cn } from './lib/utils';
import './index.css';

/* ─── Flowing hearts decoration ─── */
const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-red-300/45"
        initial={{
          x: `${10 + Math.random() * 80}vw`,
          y: '105vh',
          scale: 0.5 + Math.random() * 0.8,
          rotate: Math.random() * 30 - 15,
        }}
        animate={{
          y: '-10vh',
          rotate: [0, 18, -12, 14, -8, 0],
          x: [
            `${10 + Math.random() * 80}vw`,
            `${20 + Math.random() * 60}vw`,
            `${12 + Math.random() * 76}vw`,
          ],
          opacity: [0.25, 0.7, 0.35],
        }}
        transition={{
          duration: 10 + Math.random() * 8,
          repeat: Infinity,
          delay: i * 0.8,
          ease: 'linear',
        }}
        style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))' }}
      >
        <Heart size={20 + Math.random() * 20} fill="currentColor" />
      </motion.div>
    ))}
  </div>
);

const CelebrationOverlay = ({ active, name }) => {
  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[35] pointer-events-none flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/25 via-transparent to-black/40" />
        <motion.div
          initial={{ scale: 0.7, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="text-center px-4"
        >
          <motion.p
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-3xl md:text-6xl font-serif font-bold text-white"
            style={{ textShadow: '0 0 22px rgba(248, 113, 113, 0.75)' }}
          >
            Happy Birthday, {name}!
          </motion.p>
          <p className="mt-2 text-sm md:text-lg text-rose-100/95 tracking-wide">
            Candles blown. Celebration unlocked.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Sparkle burst effect ─── */
const SparkleOverlay = ({ active }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[3]">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            repeatDelay: 1 + Math.random() * 3,
          }}
        >
          <Sparkles size={12} className="text-yellow-300/60" />
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Decorative arch border element ─── */
const ArchBorder = ({ className = '' }) => (
  <div className={cn("flex justify-center gap-0 overflow-hidden", className)}>
    {Array.from({ length: 16 }).map((_, i) => (
      <div
        key={i}
        className="w-8 h-4 border-b-2 border-pink-200/50 rounded-b-full"
      />
    ))}
  </div>
);

/* ─── Column decoration ─── */
const ArchColumn = ({ side = 'left' }) => (
  <div className={cn(
    "fixed top-0 bottom-0 w-6 z-[1] hidden md:flex flex-col items-center",
    side === 'left' ? 'left-0' : 'right-0'
  )}>
    <div className="w-full h-full bg-gradient-to-b from-pink-100/40 via-rose-50/20 to-pink-100/40 border-x border-pink-100/30" />
    {/* Arch top cap */}
    <div className="absolute top-0 w-8 h-8">
      <div className="w-full h-full bg-pink-200/30 rounded-b-full" />
    </div>
    {/* Repeating arch pattern */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="absolute w-5 h-3 border-b-2 border-pink-200/30 rounded-b-full"
        style={{ top: `${12 + i * 12}%` }}
      />
    ))}
  </div>
);

function App() {
  const [screen, setScreen] = useState('intro');
  const [config, setConfig] = useState(null);
  const [name, setName] = useState('');
  const [guideText, setGuideText] = useState('Loading...');
  const [showPetals, setShowPetals] = useState(false);
  const [isBrunoBarking, setIsBrunoBarking] = useState(false);
  const [hasBarkedOnEntry, setHasBarkedOnEntry] = useState(false);
  const [showCakeCelebration, setShowCakeCelebration] = useState(false);

  const { start: startMusic, stop: stopMusic, isPlaying } = useBirthdayTune();

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setGuideText("Woof! I'm Bruno! Tell me your name and let's celebrate!");
      })
      .catch(err => console.error("Could not load data.json", err));
  }, []);

  const toggleMusic = () => {
    if (isPlaying) stopMusic();
    else startMusic();
  };

  /* ─── Bruno barks twice on system entry ─── */
  const doBrunoDoubleBark = useCallback(() => {
    setIsBrunoBarking(true);
    playBark();
    setTimeout(() => {
      setIsBrunoBarking(false);
      setTimeout(() => {
        setIsBrunoBarking(true);
        playBark();
        setTimeout(() => setIsBrunoBarking(false), 500);
      }, 300);
    }, 500);
  }, []);

  /* ─── Screen transition guide messages ─── */
  useEffect(() => {
    if (!config) return;

    const messages = {
      intro: "Woof! I'm Bruno! Tell me your name and let's celebrate!",
      greeting: `Happy Birthday, ${name}! 🎉 Click anywhere to continue!`,
      wish: "Close your eyes, make a wish... the stars are listening!",
      cake: "Now blow into your mic to blow out the candles! 🎤",
      letter: "Someone special wrote this just for you... 💌",
      bouquet: `A beautiful bouquet for the beautiful ${name}! 🌹`,
    };

    setGuideText(messages[screen] || '');
    setShowPetals(screen !== 'intro');
  }, [screen, config, name, doBrunoDoubleBark]);

  /* ─── Handlers ─── */
  const handleStart = (inputName) => {
    if (!inputName.trim()) return;
    setName(inputName);
    setScreen('greeting');
    startMusic();

    // Entry double bark
    if (!hasBarkedOnEntry) {
      setHasBarkedOnEntry(true);
      doBrunoDoubleBark();
    }
  };

  const handleGreetingDone = () => setScreen('wish');
  const handleWishMade = () => setScreen('cake');
  const handleCakeDone = () => {
    setShowCakeCelebration(true);
    confetti({ particleCount: 220, spread: 95, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 140, spread: 80, origin: { x: 0.2, y: 0.55 } }), 250);
    setTimeout(() => confetti({ particleCount: 140, spread: 80, origin: { x: 0.8, y: 0.55 } }), 450);

    setTimeout(() => setShowCakeCelebration(false), 1800);
    setTimeout(() => setScreen('letter'), 2400);
  };
  const handleLetterDone = () => setScreen('bouquet');

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100 font-sans bg-[#13070a] selection:bg-red-300/50">

      {/* ═══ ARCHITECTURAL THEME BACKGROUND ═══ */}
      <div className="fixed inset-0 -z-20">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#120507] via-[#350a16] to-[#050305]" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(251,113,133,0.6) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Soft glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-[-15%] left-[-10%] w-[55vw] h-[55vw] bg-red-500/20 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-pink-400/15 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="fixed top-[30%] right-[10%] w-[30vw] h-[30vw] bg-white/10 rounded-full blur-[80px] -z-10"
      />

      {/* Architectural columns */}
      <ArchColumn side="left" />
      <ArchColumn side="right" />

      {/* Top arch border */}
      <div className="fixed top-0 left-0 right-0 z-[1]">
        <div className="h-1.5 bg-gradient-to-r from-transparent via-pink-200/60 to-transparent" />
        <ArchBorder />
      </div>

      {/* Bottom arch border */}
      <div className="fixed bottom-0 left-0 right-0 z-[1] rotate-180">
        <ArchBorder />
      </div>

      {/* Floating hearts */}
      <FloatingHearts />

      {/* Sparkle effects on special screens */}
      <SparkleOverlay active={screen === 'greeting' || screen === 'bouquet' || showCakeCelebration} />

      {/* Floating Petals */}
      <AnimatePresence>
        {showPetals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PetalField count={35} />
          </motion.div>
        )}
      </AnimatePresence>

      <CelebrationOverlay active={showCakeCelebration} name={name} />

      {/* ═══ SCREENS ═══ */}
      <AnimatePresence mode="wait">

        {/* ─── INTRO ─── */}
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 60 }}
              className="bg-white/50 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/60 shadow-2xl max-w-lg w-full relative overflow-hidden"
            >
              {/* Arch decoration at top */}
              <div className="absolute top-0 left-0 right-0">
                <div className="h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
                <div className="flex justify-center gap-0 mt-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-6 h-3 border-b border-pink-200/40 rounded-b-full" />
                  ))}
                </div>
              </div>

              {/* Bruno paw print */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6 flex justify-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white/60">
                  🐾
                </div>
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                {config?.siteTitle || "Birthday Magic"}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base text-gray-500 mb-8 font-light italic"
              >
                "Someone special brought magic just for you..."
              </motion.p>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="What's your name?"
                  className="px-6 py-4 rounded-2xl bg-white/80 border-2 border-pink-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100/50 transition-all text-center text-lg shadow-inner font-sans"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart(e.target.value)}
                  onChange={(e) => setName(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStart(name)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-200/50 flex items-center justify-center gap-2 group transition-all"
                >
                  Let's Celebrate!
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight size={20} />
                  </motion.span>
                </motion.button>
              </div>

              {/* Bottom arch */}
              <div className="absolute bottom-0 left-0 right-0 rotate-180">
                <div className="flex justify-center gap-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-6 h-3 border-b border-pink-200/40 rounded-b-full" />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─── GREETING ─── */}
        {screen === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center z-10 cursor-pointer"
            onClick={handleGreetingDone}
          >
            {/* Decorative rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[280px] md:w-[400px] h-[280px] md:h-[400px] border-2 border-dashed border-pink-200/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] border border-dashed border-rose-100/20 rounded-full"
            />

            <motion.h1
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-5xl md:text-8xl font-hand font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-4"
            >
              Happy Birthday!
            </motion.h1>

            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
              className="text-3xl md:text-6xl font-serif text-amber-500 font-bold mb-8"
              style={{ textShadow: '0 2px 8px rgba(245,158,11,0.3)' }}
            >
              {name}
            </motion.h2>

            {/* Decorative stars */}
            {[
              { x: '20%', y: '25%', delay: 0.5 },
              { x: '75%', y: '20%', delay: 0.7 },
              { x: '15%', y: '70%', delay: 0.9 },
              { x: '80%', y: '65%', delay: 1.1 },
            ].map((star, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300/50"
                style={{ left: star.x, top: star.y }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0.8, 1], rotate: 360 }}
                transition={{ delay: star.delay, duration: 3, repeat: Infinity }}
              >
                <Star size={28} fill="currentColor" />
              </motion.div>
            ))}

            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg text-pink-400 mt-4 flex items-center gap-2"
            >
              <Heart size={16} /> Click anywhere to continue <Heart size={16} />
            </motion.p>
          </motion.div>
        )}

        {/* ─── WISH ─── */}
        {screen === 'wish' && (
          <motion.div
            key="wish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <div className="relative max-w-xl">
              {/* Floating sparkles around wish */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300/40"
                  style={{
                    left: `${-10 + Math.random() * 120}%`,
                    top: `${-10 + Math.random() * 120}%`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.5, 1.2, 0.5],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                >
                  <Sparkles size={18} />
                </motion.div>
              ))}

              <motion.h2
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-4xl md:text-6xl font-serif font-medium bg-gradient-to-r from-pink-700 via-rose-600 to-pink-700 bg-clip-text text-transparent mb-8"
              >
                Make a Wish...
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-lg mb-10"
              >
                {/* Arch detail */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-300/50 to-transparent rounded-t-3xl" />

                <p className="text-lg md:text-2xl text-gray-600 font-serif italic leading-relaxed">
                  "Close your eyes, take a deep breath, and let your heart speak its deepest desire..."
                </p>

                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 text-3xl"
                >
                  ✨
                </motion.div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(244,63,94,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishMade}
                className="px-10 py-4 rounded-full bg-white/90 backdrop-blur-sm text-pink-600 font-bold text-xl shadow-xl border-2 border-pink-100 hover:bg-pink-50 transition-colors flex items-center gap-3 mx-auto"
              >
                <Sparkles size={22} className="text-amber-400" /> I Made My Wish!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ─── CAKE ─── */}
        {screen === 'cake' && (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 md:p-6"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-4xl font-serif text-center text-pink-700 mb-4 md:mb-6"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              A Cake Made with Love 🎂
            </motion.h2>
            <Cake onCut={handleCakeDone} dogBark={playBark} />
          </motion.div>
        )}

        {/* ─── LETTER ─── */}
        {screen === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-3 md:p-4 z-20 overflow-y-auto"
          >
            <motion.div
              initial={{ rotate: 2 }}
              animate={{ rotate: [2, 0.5, 2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-[#fdfbf7] p-6 md:p-14 max-w-2xl w-full shadow-2xl relative mx-auto my-6 md:my-10 border border-gray-100/80 rounded-lg"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)' }}
            >
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Decorative tape */}
              <div className="absolute top-[-12px] left-[50%] translate-x-[-50%] w-28 h-7 bg-pink-200/50 rotate-[1deg] backdrop-blur-sm shadow-sm rounded-sm" />

              {/* Arch border on letter */}
              <div className="absolute top-3 left-4 right-4 flex justify-center gap-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-5 h-2.5 border-b border-pink-200/30 rounded-b-full" />
                ))}
              </div>

              <div className="relative z-10 mt-4">
                <div className="flex justify-between items-start mb-6 md:mb-8 border-b-2 border-pink-100/80 pb-4">
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-pink-800">
                    Dear {name},
                  </h2>
                  <motion.span
                    animate={{ y: [0, -6, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    💌
                  </motion.span>
                </div>

                <div className="space-y-4 md:space-y-5 text-base md:text-lg leading-relaxed font-sans text-gray-700">
                  {config?.letterTemplate ? (
                    config.letterTemplate.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                      >
                        {line.replace('{name}', name)}
                      </motion.p>
                    ))
                  ) : (
                    <p>Writing your letter...</p>
                  )}
                </div>

                {/* ─── Signature: Your Secret Developer ─── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-10 md:mt-14 text-right"
                >
                  <p className="font-serif text-sm md:text-base italic text-gray-400 mb-1">With love & admiration,</p>
                  <p className="font-serif text-2xl md:text-3xl text-pink-600 font-bold -rotate-1 inline-block">
                    Your Secret Developer
                  </p>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block ml-2 text-xl"
                  >
                    💕
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLetterDone}
              className="mb-10 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 shadow-lg shadow-pink-200/50 rounded-full text-white font-bold transition-all flex items-center gap-2"
            >
              Wait, one last surprise...
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎁
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {/* ─── BOUQUET ─── */}
        {screen === 'bouquet' && (
          <motion.div
            key="bouquet"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4 md:p-6 overflow-y-auto"
          >
            <motion.h2
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-3xl md:text-5xl font-serif font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent mb-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
            >
              For You, {name}! 🌹
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 font-sans text-base md:text-lg mb-4 italic"
            >
              A bouquet of roses, just like how special you are
            </motion.p>

            <Bouquet show={true} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => window.location.reload()}
              className="mt-6 text-gray-400 hover:text-pink-500 underline text-sm transition-colors"
            >
              Start Over
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ═══ PERSISTENT ELEMENTS ═══ */}

      {/* Bruno Guide */}
      <Guide text={guideText} show={true} isBarking={isBrunoBarking} />

      {/* Music Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed top-6 right-6 p-3 rounded-full backdrop-blur-xl transition-all z-50 border hover:shadow-lg",
          isPlaying
            ? "bg-pink-500 text-white shadow-pink-200/50 border-pink-400 shadow-lg"
            : "bg-white/50 text-pink-600 hover:bg-white/70 border-pink-100"
        )}
        onClick={toggleMusic}
      >
        {isPlaying ? (
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            <Music size={22} />
          </motion.div>
        ) : (
          <Music2 size={22} />
        )}
      </motion.button>

    </div>
  );
}

export default App;
