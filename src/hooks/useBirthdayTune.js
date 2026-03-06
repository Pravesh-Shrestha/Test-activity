import { useEffect, useRef, useState } from 'react';

// Tune Data
const NOTES = {
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
  'F#5': 739.99, 'E5': 659.25
};

// Happy Birthday Melody (approximate durations)
const TUNE_SEQUENCE = [
  // Happy Birthday to You
  { note: 'G4', length: 0.3 }, { note: 'G4', length: 0.1 }, { note: 'A4', length: 0.4 }, { note: 'G4', length: 0.4 }, { note: 'C5', length: 0.4 }, { note: 'B4', length: 0.8 },
  // Happy Birthday to You
  { note: 'G4', length: 0.3 }, { note: 'G4', length: 0.1 }, { note: 'A4', length: 0.4 }, { note: 'G4', length: 0.4 }, { note: 'D5', length: 0.4 }, { note: 'C5', length: 0.8 },
  // Happy Birthday Dear [Name]
  { note: 'G4', length: 0.3 }, { note: 'G4', length: 0.1 }, { note: 'G5', length: 0.4 }, { note: 'E5', length: 0.4 }, { note: 'C5', length: 0.4 }, { note: 'B4', length: 0.4 }, { note: 'A4', length: 0.8 },
  // Happy Birthday to You
  { note: 'F5', length: 0.3 }, { note: 'F5', length: 0.1 }, { note: 'E5', length: 0.4 }, { note: 'C5', length: 0.4 }, { note: 'D5', length: 0.4 }, { note: 'C5', length: 0.8 }
];

export function useBirthdayTune() {
  const audioContextRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const playNote = (ctx, freq, time, duration) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // Soft, clear tone
    osc.frequency.value = freq;
    
    // Envelope to avoid clicking
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.1, time + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05); // Decay

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
  };

  const playMelody = () => {
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      let startTime = ctx.currentTime + 0.1; // Start smoothly
      
      TUNE_SEQUENCE.forEach((step) => {
          if (!isPlayingRef.current) return;
          const freq = NOTES[step.note];
          if (freq) {
             playNote(ctx, freq, startTime, step.length);
          }
          startTime += step.length + 0.05; // Gap between notes
      });

      // Loop
      const totalDuration = TUNE_SEQUENCE.reduce((acc, curr) => acc + curr.length + 0.05, 0);
      
      setTimeout(() => {
          if (isPlayingRef.current) playMelody();
      }, totalDuration * 1000);
  };

  const start = async () => {
    if (isPlaying) return;
    
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
    }

    setIsPlaying(true);
    isPlayingRef.current = true;
    playMelody();
  };

  const stop = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (audioContextRef.current) {
        audioContextRef.current.close().then(() => {
             audioContextRef.current = null;
        });
    }
  };

  useEffect(() => {
      return () => stop();
  }, []);

  return { start, stop, isPlaying };
}
