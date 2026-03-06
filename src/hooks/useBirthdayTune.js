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
    // Piano-like timbre: layered harmonics + low-pass filtering + quick attack decay.
    const main = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    main.type = 'sine';
    harmonic.type = 'triangle';
    main.frequency.value = freq;
    harmonic.frequency.value = freq * 2;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.16, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.03, time + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    main.connect(gain);
    harmonic.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    main.start(time);
    harmonic.start(time);
    main.stop(time + duration);
    harmonic.stop(time + duration);
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
