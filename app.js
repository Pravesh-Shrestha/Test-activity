const { useEffect, useMemo, useRef, useState } = React;

function BirthdayApp() {
  const [config, setConfig] = useState(null);
  const [screen, setScreen] = useState('name');
  const [name, setName] = useState('');
  const [inputName, setInputName] = useState('');
  const [guideText, setGuideText] = useState('Loading...');
  const [cakeCut, setCakeCut] = useState(false);
  const [showBouquet, setShowBouquet] = useState(false);

  const cakeAreaRef = useRef(null);
  const knifeRef = useRef(null);
  const cutLineRef = useRef(null);
  const cakeSliceRef = useRef(null);
  const petalFieldRef = useRef(null);
  const heartsLayerRef = useRef(null);
  const letterBodyRef = useRef(null);

  useEffect(() => {
    fetch('data.json')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setGuideText(data.guideMessages.intro);
      })
      .catch(() => {
        setGuideText('Could not load data.json');
      });
  }, []);

  useEffect(() => {
    if (!config) return;
    if (screen === 'name') setGuideText(config.guideMessages.nameScreen);
    if (screen === 'wish') setGuideText(config.guideMessages.wishScreen);
    if (screen === 'cake') setGuideText(config.guideMessages.cakeScreen);
    if (screen === 'letter') setGuideText(config.guideMessages.letterScreen);
  }, [screen, config]);

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    gsap.fromTo('.guide',
      { x: -130, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.5)' }
    );
    barkSound();
  }, []);

  useEffect(() => {
    const id = setInterval(() => spawnHeart(), 1300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (screen !== 'cake') return;
    if (typeof anime === 'undefined') return;

    anime({
      targets: '.flame',
      scaleX: [0.96, 1.18],
      scaleY: [0.9, 1.2],
      rotate: [-2, 3],
      translateY: [0, -2],
      easing: 'easeInOutSine',
      direction: 'alternate',
      duration: 460,
      loop: true,
      delay: anime.stagger(80)
    });
  }, [screen]);

  const letterLines = useMemo(() => {
    if (!config || !name) return [];
    return config.letterTemplate.map((line) => line.replaceAll('{name}', name));
  }, [config, name]);

  useEffect(() => {
    if (!letterBodyRef.current || screen !== 'letter') return;
    letterBodyRef.current.innerHTML = '';
    letterLines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      letterBodyRef.current.appendChild(p);
    });

    if (typeof gsap !== 'undefined') {
      gsap.from('#letterCard', { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' });
      gsap.from('#letterBody p', { opacity: 0, y: 14, duration: 0.5, stagger: 0.14, delay: 0.25 });
    }
  }, [screen, letterLines]);

  function barkSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        const unlock = () => {
          ctx.resume().then(() => woof(ctx));
          document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        return;
      }
      woof(ctx);
    } catch (_) {
      // ignore audio failures
    }
  }

  function woof(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(128, t + 0.11);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  function fireConfetti(duration = 2500, particleCount = 4) {
    if (typeof confetti === 'undefined') return;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount,
        spread: 72,
        angle: 65 + Math.random() * 50,
        origin: { x: Math.random(), y: Math.random() * 0.45 },
        colors: ['#ffd082', '#ff7eac', '#d22758', '#fff', '#74b9ff']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function dropRoses(count) {
    const field = petalFieldRef.current;
    if (!field) return;
    for (let i = 0; i < count; i++) {
      const rose = document.createElement('span');
      rose.className = 'falling-rose';
      rose.style.left = Math.random() * 100 + '%';
      rose.style.top = '-62px';
      rose.style.animationDuration = 3.8 + Math.random() * 2 + 's';
      rose.style.animationDelay = Math.random() * 1.6 + 's';
      field.appendChild(rose);
      rose.addEventListener('animationend', () => rose.remove());
    }
  }

  function dropPetals(count) {
    const field = petalFieldRef.current;
    if (!field) return;
    const colors = [
      'radial-gradient(circle at 30% 30%, #ffdbe7, #de3d6f 60%)',
      'radial-gradient(circle at 30% 30%, #ffc3da, #cf2f59 60%)',
      'radial-gradient(circle at 30% 30%, #ffe5ee, #f26d93 60%)'
    ];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.top = '-16px';
      petal.style.width = 10 + Math.random() * 10 + 'px';
      petal.style.height = 8 + Math.random() * 7 + 'px';
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      petal.style.animationDuration = 3.8 + Math.random() * 2.5 + 's';
      field.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }
  }

  function spawnHeart() {
    const layer = heartsLayerRef.current;
    if (!layer) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.innerHTML = ['&#10084;', '&#9829;', '&#10085;'][Math.floor(Math.random() * 3)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-24px';
    heart.style.fontSize = 14 + Math.random() * 16 + 'px';
    heart.style.animationDuration = 5 + Math.random() * 2.5 + 's';
    layer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  function goNextFromName() {
    const trimmed = inputName.trim();
    if (!trimmed || !config) return;
    setName(trimmed);
    setScreen('wish');
    fireConfetti(2600, 4);
    dropRoses(config.effects.nameRoses);
    dropPetals(40);
  }

  function toCake() {
    setCakeCut(false);
    setShowBouquet(false);
    setScreen('cake');
    requestAnimationFrame(() => {
      if (cutLineRef.current) cutLineRef.current.classList.remove('cutting');
      if (cakeSliceRef.current) cakeSliceRef.current.classList.remove('visible');
      document.querySelectorAll('.flame').forEach((f) => f.classList.remove('out'));
    });
  }

  function onCakeMove(e) {
    if (!knifeRef.current || !cakeAreaRef.current) return;
    const rect = cakeAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    knifeRef.current.style.left = x + 'px';
    knifeRef.current.style.top = y + 'px';
  }

  function cutCake() {
    if (cakeCut || !config) return;
    setCakeCut(true);
    cutLineRef.current && cutLineRef.current.classList.add('cutting');
    document.querySelectorAll('.flame').forEach((f) => f.classList.add('out'));

    setTimeout(() => {
      cakeSliceRef.current && cakeSliceRef.current.classList.add('visible');
      fireConfetti(1700, 3);
      dropRoses(config.effects.cakeRoses);
    }, 850);

    setTimeout(() => {
      setScreen('letter');
      fireConfetti(900, config.effects.letterConfettiCount);
      setTimeout(() => {
        setShowBouquet(true);
        dropRoses(config.effects.letterRoses);
      }, 1100);
    }, 2900);
  }

  function restartAll() {
    setInputName('');
    setName('');
    setCakeCut(false);
    setShowBouquet(false);
    setScreen('name');
    requestAnimationFrame(() => {
      cutLineRef.current && cutLineRef.current.classList.remove('cutting');
      cakeSliceRef.current && cakeSliceRef.current.classList.remove('visible');
      document.querySelectorAll('.flame').forEach((f) => f.classList.remove('out'));
    });
  }

  if (!config) {
    return <div style={{ padding: '24px', color: '#fff' }}>Loading celebration...</div>;
  }

  return (
    <>
      <div className="bg-orb orb-a" aria-hidden="true"></div>
      <div className="bg-orb orb-b" aria-hidden="true"></div>
      <div className="bg-grid" aria-hidden="true"></div>

      <div className="petal-field" ref={petalFieldRef} aria-hidden="true"></div>
      <div className="hearts-layer" ref={heartsLayerRef} aria-hidden="true"></div>

      <aside className="guide" aria-live="polite">
        <div className="think-cloud">{guideText}</div>
        <div className="guide-dog" aria-hidden="true">
          <div className="dog-ear left"></div>
          <div className="dog-ear right"></div>
          <div className="dog-head"></div>
          <div className="dog-snout"></div>
          <div className="dog-eye left"></div>
          <div className="dog-eye right"></div>
          <div className="dog-nose"></div>
          <div className="dog-mouth"></div>
          <div className="dog-tongue"></div>
          <div className="dog-body"></div>
          <div className="dog-collar"></div>
          <div className="dog-tag"></div>
          <div className="dog-paw left"></div>
          <div className="dog-paw right"></div>
          <div className="dog-tail"></div>
        </div>
      </aside>

      <section className={`screen name-screen ${screen === 'name' ? 'active' : ''}`}>
        <div className="card intro-card">
          <p className="eyebrow"><i className="fa-solid fa-sparkles"></i> {config.site.title}</p>
          <h1>{config.texts.nameTitle}</h1>
          <p className="sub">{config.texts.nameSubtitle}</p>
          <div className="name-form">
            <input
              className="name-input"
              type="text"
              maxLength="40"
              placeholder="Your beautiful name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goNextFromName()}
            />
            <button className="btn btn-rose" onClick={goNextFromName}><i className="fa-solid fa-arrow-right"></i> Start</button>
          </div>
        </div>
      </section>

      <section className={`screen wish-screen ${screen === 'wish' ? 'active' : ''}`}>
        <div className="card wish-card">
          <div className="rose-corners" aria-hidden="true">
            <span className="corner-rose tl"></span>
            <span className="corner-rose tr"></span>
            <span className="corner-rose bl"></span>
            <span className="corner-rose br"></span>
          </div>
          <p className="eyebrow"><i className="fa-solid fa-wand-magic-sparkles"></i> Special Greeting</p>
          <h1>{name ? `Happy Birthday, ${name}!` : 'Happy Birthday!'}</h1>
          <p className="sub">{config.texts.wishSubtitle}</p>
          <button className="btn btn-gold" onClick={toCake}><i className="fa-solid fa-cake-candles"></i> Cut the Cake</button>
        </div>
      </section>

      <section className={`screen cake-screen ${screen === 'cake' ? 'active' : ''}`}>
        <div className="card cake-card">
          <p className="eyebrow"><i className="fa-solid fa-compass-drafting"></i> Architect Theme Cake</p>
          <h2>{config.texts.cakeTitle}</h2>
          <p className="sub mini">{config.texts.cakeSubtitle}</p>

          <div className="cake-area" ref={cakeAreaRef} onMouseMove={onCakeMove} onClick={cutCake}>
            <div className="blueprint-lines" aria-hidden="true"></div>

            <div className="candles-row">
              <div className="candle"><div className="wick"></div><div className="flame" id="flame1"></div></div>
              <div className="candle"><div className="wick"></div><div className="flame" id="flame2"></div></div>
              <div className="candle"><div className="wick"></div><div className="flame" id="flame3"></div></div>
              <div className="candle"><div className="wick"></div><div className="flame" id="flame4"></div></div>
              <div className="candle"><div className="wick"></div><div className="flame" id="flame5"></div></div>
            </div>

            <div className="cake3d">
              <div className="tier tier-top"><div className="tier-face"></div><div className="tier-icing"></div><span className="rose-deco r1"></span><span className="rose-deco r2"></span></div>
              <div className="tier tier-mid"><div className="tier-face"></div><div className="tier-icing"></div><span className="rose-deco r3"></span><span className="rose-deco r4"></span><span className="rose-deco r5"></span></div>
              <div className="tier tier-bottom"><div className="tier-face"></div><div className="tier-icing"></div><span className="rose-deco r6"></span><span className="rose-deco r7"></span><span className="rose-deco r8"></span><span className="rose-deco r9"></span></div>
              <div className="cake-base"></div>
            </div>

            <div className="knife" ref={knifeRef}><div className="knife-handle"></div><div className="knife-blade"></div></div>
            <div className="cut-line" ref={cutLineRef}></div>

            <div className="cake-slice" ref={cakeSliceRef}>
              <div className="slice sl-top"></div>
              <div className="slice sl-mid"></div>
              <div className="slice sl-bottom"></div>
              <div className="slice-cream"></div>
            </div>
          </div>

          <p className="cake-instruction">{cakeCut ? 'Perfect cut! This cake looks delicious.' : config.texts.cakeInstruction}</p>
        </div>
      </section>

      <section className={`screen letter-screen ${screen === 'letter' ? 'active' : ''}`}>
        <div className="card letter-card" id="letterCard">
          <span className="letter-rose-top" aria-hidden="true"></span>
          <h2>{config.texts.letterTitle}</h2>
          <div className="letter-body" id="letterBody" ref={letterBodyRef}></div>
          <div className="letter-signature">
            <p>With warmth and wishes,</p>
            <h3>{config.site.signature}</h3>
          </div>
        </div>

        <div className={`bouquet-wrap ${showBouquet ? 'show' : ''}`} aria-live="polite">
          <p className="bouquet-title">A Bouquet Of Roses For You</p>
          <div className="bouquet">
            <span className="big-rose-bq b1"></span>
            <span className="big-rose-bq b2"></span>
            <span className="big-rose-bq b3"></span>
            <span className="big-rose-bq b4"></span>
            <span className="big-rose-bq b5"></span>
            <span className="big-rose-bq b6"></span>
            <span className="bouquet-ribbon"></span>
          </div>
          <p className="bouquet-note">From Pravesh</p>
        </div>

        <button className="btn btn-rose" onClick={restartAll}><i className="fa-solid fa-rotate-right"></i> Celebrate Again</button>
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BirthdayApp />);
