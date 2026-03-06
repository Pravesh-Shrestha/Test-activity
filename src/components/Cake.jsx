import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './ComponentStyles.css';

export function Cake({ onCut, dogBark }) {
  const [candles, setCandles] = useState([true, true, true, true, true]); 
  const [blown, setBlown] = useState(false);

  const handleStickClick = (index) => {
    if (!candles[index]) return;
    
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);
    
    // Play light sound?
    if (dogBark) dogBark();
    
    if (newCandles.every(c => c === false)) {
      setBlown(true);
      if (onCut) onCut();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-32 min-h-[400px]">
      {/* Container for absolute positioning aligned tiers */}
      <div className="relative flex flex-col items-center z-10 w-[400px]">
      
        {/* Tier Top: Candles sit here absolutely or relatively? */}
        <div className="tier tier-top relative">
          <div className="absolute -top-[65px] left-0 right-0 flex justify-center gap-[22px] z-50">
             {candles.map((isLit, i) => (
               <div 
                 key={i} 
                 className={`candle relative cursor-pointer hover:brightness-110 transition-all ${!isLit ? 'opacity-80' : ''}`}
                 onClick={() => handleStickClick(i)}
                 style={{ top: 0, left: 0 }} // Override component CSS absolute left
               >
                 <div className="wick"></div>
                 <div className={`flame ${!isLit ? 'out' : ''}`}></div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="tier tier-mid -mt-2"></div>
        <div className="tier tier-bottom -mt-2"></div>
      
      </div>

      {!blown && (
        <div className="mt-12 select-none pointer-events-none text-center text-white/90 font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse">
           Blow out all the candles! (Click)
        </div>
      )}
      
      {blown && (
        <div className="mt-12 pointer-events-none select-none text-center text-yellow-300 font-bold text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-bounce font-happy">
           MAKE A WISH!
        </div>
      )}
    </div>
  );
}
