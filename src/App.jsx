import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Heart, Star, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Guide } from './components/Dog';
import { Cake } from './components/Cake';
import { PetalField } from './components/PetalField';
import { Bouquet } from './components/Bouquet';
import { useBirthdayTune } from './hooks/useBirthdayTune';
import { cn } from './lib/utils';
import './index.css';

const BRUNO_IMG = import.meta.env.BASE_URL + 'bruno.png';
const BUILD_ID = '2026-03-06-ui-refresh-5';

const FloatingHearts = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => {
        const x1 = 8 + Math.random() * 84;
        const x2 = 8 + Math.random() * 84;
        const x3 = 8 + Math.random() * 84;
        return {
          id: i,
          x1,
          x2,
          x3,
          scale: 0.5 + Math.random() * 0.8,
          rotate: Math.random() * 30 - 15,
          duration: 10 + Math.random() * 8,
          delay: i * 0.55,
          size: 18 + Math.random() * 22,
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-red-300/45"
          initial={{ x: `${h.x1}vw`, y: '105vh', scale: h.scale, rotate: h.rotate, opacity: 0.2 }}
          animate={{ y: '-10vh', rotate: [h.rotate, h.rotate + 18, h.rotate - 10, h.rotate + 6], x: [`${h.x1}vw`, `${h.x2}vw`, `${h.x3}vw`], opacity: [0.2, 0.75, 0.35] }}
          transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: 'linear' }}
          style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))' }}
        >
          <Heart size={h.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const FloatingTreats = () => {
  const treats = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        emoji: ['🎈', '🍫', '🍬', '🍭', '🍬', '🍫', '🎉'][i % 7],
        x: 6 + Math.random() * 88,
        y: 6 + Math.random() * 82,
        duration: 3 + Math.random() * 3,
        delay: i * 0.2,
        size: 16 + Math.random() * 14,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {treats.map((t) => (
        <motion.span
          key={t.id}
          className="absolute select-none"
          style={{ left: `${t.x}%`, top: `${t.y}%`, fontSize: `${t.size}px` }}
          animate={{ y: [0, -8, 0], rotate: [0, 6, -6, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: t.duration, delay: t.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t.emoji}
        </motion.span>
      ))}
    </div>
  );
};

const BorderBalloons = () => {
  const balloons = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        color: ['#fb7185', '#fda4af', '#fecdd3', '#f43f5e'][i % 4],
        side: i < 8 ? 'top' : i < 13 ? 'left' : 'right',
        pos: i < 8 ? 8 + i * 11 : 14 + (i % 5) * 16,
        delay: i * 0.15,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden">
      {balloons.map((b) => {
        const baseClass =
          b.side === 'top'
            ? `top-2`
            : b.side === 'left'
              ? `left-2`
              : `right-2`;
        const style =
          b.side === 'top'
            ? { left: `${b.pos}%` }
            : { top: `${b.pos}%` };

        return (
          <motion.div
            key={b.id}
            className={`absolute ${baseClass}`}
            style={style}
            animate={{ y: [0, -5, 0], x: [0, b.side === 'top' ? 0 : b.side === 'left' ? 2 : -2, 0] }}
            transition={{ duration: 2.8 + (b.id % 3) * 0.6, repeat: Infinity, delay: b.delay }}
          >
            <div className="relative">
              <div
                className="w-5 h-6 md:w-6 md:h-8 rounded-full border border-white/30"
                style={{ background: `linear-gradient(145deg, ${b.color}, #be123c)` }}
              />
              <div className="w-[1px] h-3 bg-rose-200/60 mx-auto" />
            </div>
          </motion.div>
        );
      })}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2 + (i % 4) * 0.4, repeat: Infinity, delay: i * 0.12 }}
            className="w-4 h-6 rounded-full border border-white/25"
            style={{ background: `linear-gradient(145deg, ${['#fb7185', '#fda4af', '#f43f5e', '#fecdd3'][i % 4]}, #9f1239)` }}
          />
        ))}
      </div>
    </div>
  );
};

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
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/25 via-transparent to-black/45" />
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
            Perfect cut. Perfect celebration.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScreenCurtain = ({ screen }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={`curtain-${screen}`}
      className="fixed inset-0 z-[32] pointer-events-none"
      initial={{ x: '-120%' }}
      animate={{ x: '120%' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background:
          'linear-gradient(90deg, rgba(0,0,0,0), rgba(127,29,29,0.2), rgba(255,255,255,0.18), rgba(127,29,29,0.2), rgba(0,0,0,0))',
        backdropFilter: 'blur(1px)',
      }}
    />
  </AnimatePresence>
);

function App() {
  const [screen, setScreen] = useState('intro');
  const [config, setConfig] = useState(null);
  const [name, setName] = useState('');
  const [guideText, setGuideText] = useState('Loading...');
  const [showCakeCelebration, setShowCakeCelebration] = useState(false);

  const { start: startMusic, stop: stopMusic, isPlaying } = useBirthdayTune();

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setGuideText("Hi, I'm Bruno. Welcome to your birthday celebration.");
      })
      .catch((err) => console.error('Could not load data.json', err));
  }, []);

  useEffect(() => {
    if (!config) return;

    const messages = {
      intro: "Bruno is here to celebrate your special day.",
      greeting: `Happy Birthday, ${name}!`,
      wish: 'Make a wish from your heart.',
      cake: 'Blow the candles, then cut your cake.',
      letter: 'A heartfelt letter for you.',
      bouquet: 'A bouquet to end your celebration.',
    };

    setGuideText(messages[screen] || '');
  }, [screen, config, name]);

  const toggleMusic = () => {
    if (isPlaying) stopMusic();
    else startMusic();
  };

  const handleStart = (inputName) => {
    if (!inputName.trim()) return;
    setName(inputName.trim());
    setScreen('greeting');
    startMusic();
  };

  const handleGreetingDone = () => setScreen('wish');
  const handleWishMade = () => setScreen('cake');
  const handleCakeDone = () => {
    setShowCakeCelebration(true);
    confetti({ particleCount: 220, spread: 95, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 140, spread: 80, origin: { x: 0.2, y: 0.55 } }), 250);
    setTimeout(() => confetti({ particleCount: 140, spread: 80, origin: { x: 0.8, y: 0.55 } }), 450);

    setTimeout(() => setShowCakeCelebration(false), 1800);
    setTimeout(() => setScreen('letter'), 2300);
  };
  const handleLetterDone = () => setScreen('bouquet');

  return (
    <div data-build={BUILD_ID} className="relative min-h-screen overflow-hidden text-gray-100 font-sans bg-[#120609] selection:bg-red-300/50">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#120507] via-[#350a16] to-[#050305]" />
        <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(251,113,133,0.7) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
        />
      </div>

      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-[-15%] left-[-10%] w-[55vw] h-[55vw] bg-red-500/20 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-pink-400/15 rounded-full blur-[100px] -z-10"
      />

      <FloatingHearts />
      <FloatingTreats />
      <BorderBalloons />
      <PetalField count={40} />
      <CelebrationOverlay active={showCakeCelebration} name={name} />
      <ScreenCurtain screen={screen} />

      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-10"
          >
            {/* Mobile Bruno centered intro */}
            <div className="md:hidden mb-6 w-full max-w-[320px]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-auto bg-[#190b10] border border-rose-300/25 rounded-3xl p-4 shadow-2xl"
              >
                <motion.img
                  src={BRUNO_IMG}
                  alt="Bruno"
                  className="w-28 h-28 object-cover rounded-full mx-auto border-4 border-rose-200/30"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <p className="mt-3 text-rose-100 text-sm leading-relaxed">
                  Hi, I&apos;m Bruno. This is your birthday celebration space.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="w-full max-w-lg rounded-3xl border border-rose-300/30 bg-[#1a0a10] p-6 md:p-10 shadow-2xl"
              whileHover={{ y: -3, boxShadow: '0 22px 40px rgba(0,0,0,0.35)' }}
            >
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 text-white">
                {config?.siteTitle || 'Birthday Magic'}
              </h1>
              <p className="text-rose-100/90 mb-8 text-base md:text-lg">
                Enter your name and start the celebration.
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Type your name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart(name)}
                  className="w-full rounded-2xl border border-rose-300/40 bg-[#2a0f18] px-5 py-4 text-white placeholder:text-rose-200/70 text-lg outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-300/35 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ x: [0, -1.5, 1.5, -1, 1, 0] }}
                  transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 2.4 }}
                  onClick={() => handleStart(name)}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-7 py-4 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  Start Celebration
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 cursor-pointer"
            onClick={handleGreetingDone}
          >
            <motion.h1
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="text-6xl md:text-8xl font-serif font-bold text-white mb-3"
              style={{ textShadow: '0 0 20px rgba(251,113,133,0.55)' }}
            >
              Happy Birthday!
            </motion.h1>
            <h2 className="text-4xl md:text-6xl font-serif text-rose-200 font-bold mb-6">{name}</h2>
            <p className="text-base md:text-xl text-rose-100/90 mb-6 max-w-xl">
              Balloons up, petals glowing, hearts flowing. This celebration is all yours.
            </p>
            <p className="text-rose-100/90 text-base md:text-lg">Tap anywhere to continue</p>
          </motion.div>
        )}

        {screen === 'wish' && (
          <motion.div
            key="wish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10"
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-rose-300/25 bg-[#1a0a10] p-6 md:p-10 shadow-2xl"
              whileHover={{ y: -2, boxShadow: '0 18px 35px rgba(0,0,0,0.35)' }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Make a Wish</h2>
              <p className="text-rose-100/90 text-lg md:text-2xl italic mb-10">
                Close your eyes and make a wish that matters.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 16px rgba(251,113,133,0.45)', '0 0 0 rgba(0,0,0,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={handleWishMade}
                className="rounded-full bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-10 py-4 text-white font-bold text-xl"
              >
                I Made My Wish
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {screen === 'cake' && (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
          >
            <h2 className="text-2xl md:text-4xl font-serif text-center text-rose-100 mb-4 md:mb-6">
              Blow Candles, Then Cut The Cake
            </h2>
            <p className="text-rose-200 text-sm md:text-base mb-5 md:mb-7 text-center max-w-xl">
              First blow the candles. Then cut the cake to unlock the next wish above.
            </p>
            <Cake onCut={handleCakeDone} />
          </motion.div>
        )}

        {screen === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 overflow-y-auto"
          >
            <div className="w-full max-w-2xl rounded-2xl border border-rose-300/25 bg-[#f7f1f3] p-6 md:p-12 shadow-2xl text-gray-800">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-rose-700 mb-6">Dear {name},</h2>
              <div className="space-y-4 text-base md:text-lg leading-relaxed">
                {config?.letterTemplate ? (
                  config.letterTemplate.map((line, i) => (
                    <p key={i}>{line.replace('{name}', name)}</p>
                  ))
                ) : (
                  <p>Writing your letter...</p>
                )}
              </div>
              <div className="mt-10 text-right">
                <p className="italic text-gray-500">With love & admiration,</p>
                <p className="font-serif text-2xl text-rose-600 font-bold">Your Secret Developer</p>
              </div>
            </div>

            <button
              onClick={handleLetterDone}
              className="mt-6 rounded-full bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-8 py-3 text-white font-bold"
            >
              One More Gift
            </button>
          </motion.div>
        )}

        {screen === 'bouquet' && (
          <motion.div
            key="bouquet"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 text-center">
              For You, {name}
            </h2>
            <p className="text-rose-100/85 mb-4 text-center">A special bouquet for your special day.</p>
            <Bouquet show={true} />

            <button
              onClick={() => window.location.reload()}
              className="mt-7 text-rose-200 hover:text-white underline text-sm"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Guide text={guideText} show={screen !== 'intro'} />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'fixed top-5 right-5 p-3 rounded-full transition-all z-50 border',
          isPlaying
            ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-400/30'
            : 'bg-black/45 text-rose-100 border-rose-300/30'
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
