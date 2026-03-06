import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Music } from 'lucide-react';
import { Howl } from 'howler';
import confetti from 'canvas-confetti';

import { Guide, Dog } from './components/Dog';
import { Cake } from './components/Cake';
import './index.css';

// Simple fallback sound logic if Howl assets aren't present
const playBark = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

function App() {
  const [screen, setScreen] = useState('intro'); // intro, wish, cake, letter
  const [config, setConfig] = useState(null);
  const [name, setName] = useState('');
  const [guideText, setGuideText] = useState('Loading...');
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  // Background music ref (placeholder)
  const bgMusic = useRef(null);

  useEffect(() => {
    fetch('data.json')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setGuideText(data.guideMessages?.intro || "Welcome!");
      })
      .catch(err => console.error("Could not load data.json", err));
  }, []);

  useEffect(() => {
    if (!config) return;
    if (screen === 'intro') setGuideText(config.guideMessages.intro);
    if (screen === 'wish') setGuideText(config.guideMessages.wishScreen);
    if (screen === 'cake') setGuideText(config.guideMessages.cakeScreen);
    if (screen === 'letter') setGuideText(config.guideMessages.letterScreen);
    
    playBark();
  }, [screen, config]);

  const handleStart = (inputName) => {
    if (!inputName.trim()) return;
    setName(inputName);
    setScreen('wish');
    playBark();
  };

  const handleWishMade = () => {
    setScreen('cake');
    playBark();
  };

  const handleCakeDone = () => {
    setTimeout(() => {
        setScreen('letter');
        playBark();
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white font-happy bg-gradient-to-br from-[#120d22] to-[#161f34]">
      {/* Background decorations */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse delay-1000"></div>

      <AnimatePresence mode="wait">
        
        {screen === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-fraunces text-pink-200 drop-shadow-lg">
              {config?.siteTitle || "Birthday Time!"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100/80">Are you ready?</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Name" 
                className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 backdrop-blur-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleStart(e.target.value)}
                onChange={(e) => setName(e.target.value)}
              />
              <button 
                onClick={() => handleStart(name)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 font-bold hover:scale-105 transition-transform shadow-lg shadow-pink-500/30"
              >
                Start
              </button>
            </div>
          </motion.div>
        )}

        {screen === 'wish' && (
          <motion.div 
            key="wish"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-bold font-fraunces text-yellow-300 mb-6 neon-text">
                Make a Wish...
              </h2>
              <p className="text-lg md:text-xl text-pink-100 mb-8 leading-relaxed">
                Close your eyes, think of something beautiful, and let the magic begin.
              </p>
              <button 
                onClick={handleWishMade}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-500/30"
              >
                I Wished! ✨
              </button>
            </div>
          </motion.div>
        )}

        {screen === 'cake' && (
          <motion.div 
            key="cake"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            <Cake onCut={handleCakeDone} dogBark={playBark} />
          </motion.div>
        )}

        {screen === 'letter' && (
          <motion.div 
            key="letter"
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 overflow-y-auto"
          >
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl my-auto">
              {/* Rose Icon or similar decoration */}
              <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-pink-500/40">
                <span className="text-3xl">🌹</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold font-fraunces text-center mb-8 text-pink-200">
                Dear {name},
              </h2>
              
              <div className="space-y-4 text-lg md:text-xl leading-relaxed text-pink-50/90 font-nunito text-left">
                {config?.letterTemplate ? (
                   config.letterTemplate.map((line, i) => (
                     <p key={i}>{line.replace('{name}', name)}</p>
                   ))
                ) : (
                   <p>Happy Birthday! May your day be filled with joy and laughter.</p>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 text-center">
                 <p className="font-caveat text-4xl text-yellow-300 rotate-[-2deg]">
                   From, Your Developer Friend
                 </p>
              </div>
              
              <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 text-sm opacity-50 hover:opacity-100 underline pb-20"
              >
                  Replay
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Guide Dog Overlay (Always present) */}
      <Guide text={guideText} show={true} />

    </div>
  )
}

export default App
