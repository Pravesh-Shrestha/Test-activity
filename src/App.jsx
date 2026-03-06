import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Guide, Dog } from './components/Dog';
import { Cake } from './components/Cake';
import { PetalField } from './components/PetalField';
import './index.css';

// Gentle bark sound
const playBark = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.15);
  
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.15);
};

function App() {
  const [screen, setScreen] = useState('intro'); // intro, wish, cake, letter
  const [config, setConfig] = useState(null);
  const [name, setName] = useState('');
  const [guideText, setGuideText] = useState('Loading...');
  const [musicAllowed, setMusicAllowed] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
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
    if (screen === 'wish') {
      setGuideText(config.guideMessages.wishScreen);
      setShowPetals(true);
    }
    if (screen === 'cake') {
      setGuideText(config.guideMessages.cakeScreen);
      // Keep petals? Maybe reduce count.
    }
    if (screen === 'letter') {
      setGuideText(config.guideMessages.letterScreen);
      setShowPetals(true);
    }
    
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
    }, 2500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800 font-sans bg-pink-100/50 selection:bg-pink-300">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-blue-50 opacity-80 -z-20"></div>
      
      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-300/20 rounded-full blur-[80px] animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-yellow-200/30 rounded-full blur-[80px] animate-pulse delay-1000"></div>

      {/* Floating Petals */}
      <AnimatePresence>
        {showPetals && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             <PetalField count={25} />
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {screen === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <div className="bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/60 shadow-xl max-w-lg w-full">
              <span className="text-6xl mb-4 block">🎁</span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-pink-600 drop-shadow-sm">
                {config?.siteTitle || "Birthday Time!"}
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-light">A special surprise awaits you.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="What's your name?" 
                  className="px-6 py-4 rounded-xl bg-white/80 border-2 border-pink-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all text-center text-lg shadow-inner"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart(e.target.value)}
                  onChange={(e) => setName(e.target.value)}
                />
                <button 
                  onClick={() => handleStart(name)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-lg hover:shadow-lg hover:translate-y-[-2px] transition-all shadow-pink-200 flex items-center justify-center gap-2"
                >
                  Open Gift <Heart size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'wish' && (
          <motion.div 
            key="wish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-pink-700 mb-8 relative z-10">
                Make a Wish...
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-xl mx-auto font-hand leading-relaxed">
                "Close your eyes, take a deep breath, and think of your fondest dream."
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishMade}
                className="px-10 py-4 rounded-full bg-white text-pink-600 font-bold text-xl shadow-xl border border-pink-100 hover:bg-pink-50 transition-colors flex items-center gap-3 mx-auto"
              >
                <span>✨</span> I Wished!
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === 'cake' && (
          <motion.div 
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            <div className="scale-75 md:scale-100 transform transition-transform">
               <Cake onCut={handleCakeDone} dogBark={playBark} />
            </div>
          </motion.div>
        )}

        {screen === 'letter' && (
          <motion.div 
            key="letter"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 overflow-y-auto"
          >
            <div className="letter-paper bg-[#fdfbf7] p-8 md:p-16 max-w-2xl w-full shadow-2xl relative rotate-1 transform mx-auto my-10">
              {/* Paper Texture Effect */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
              
              {/* Tape */}
              <div className="absolute top-[-15px] left-[50%] translate-x-[-50%] w-32 h-8 bg-pink-200/40 rotate-[2deg] backdrop-blur-sm"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8 border-b-2 border-pink-100 pb-4">
                    <h2 className="text-4xl md:text-5xl font-hand font-bold text-pink-800">
                    Dear {name},
                    </h2>
                    <span className="text-4xl animate-bounce">💌</span>
                </div>
                
                <div className="space-y-6 text-xl md:text-2xl leading-loose font-hand text-gray-700">
                    {config?.letterTemplate ? (
                    config.letterTemplate.map((line, i) => (
                        <p key={i}>{line.replace('{name}', name)}</p>
                    ))
                    ) : (
                    <p>Writing your letter...</p>
                    )}
                </div>

                <div className="mt-16 text-right">
                    <p className="font-serif text-lg italic text-gray-500 mb-2">With love,</p>
                    <p className="font-hand text-3xl text-pink-600 font-bold -rotate-2 inline-block">
                    Your Secret Developer
                    </p>
                </div>
              </div>
            </div>
            
            <button 
                onClick={() => window.location.reload()}
                className="mb-10 px-6 py-2 bg-white/50 hover:bg-white rounded-full text-sm text-pink-400 font-bold transition-all"
            >
                Read Again ↻
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Elements */}
      <Guide text={guideText} show={true} />
      
      {/* Music Toggle (Visual only for now, could be hooked up) */}
      <button 
        className="fixed top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-pink-700 transition-colors z-50"
        onClick={() => setMusicAllowed(!musicAllowed)}
      >
        {musicAllowed ? <Music2 size={24} /> : <Music size={24} />}
      </button>

    </div>
  )
}

export default App
