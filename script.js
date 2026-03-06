(function () {
  'use strict';

  var nameScreen = document.getElementById('nameScreen');
  var wishScreen = document.getElementById('wishScreen');
  var cakeScreen = document.getElementById('cakeScreen');
  var letterScreen = document.getElementById('letterScreen');

  var nameInput = document.getElementById('nameInput');
  var nameSubmit = document.getElementById('nameSubmit');
  var wishTitle = document.getElementById('wishTitle');
  var wishSub = document.getElementById('wishSub');
  var goToCake = document.getElementById('goToCake');

  var cakeArea = document.getElementById('cakeArea');
  var knife = document.getElementById('knife');
  var cutLine = document.getElementById('cutLine');
  var cakeSlice = document.getElementById('cakeSlice');
  var cakeInstruction = document.getElementById('cakeInstruction');

  var letterBody = document.getElementById('letterBody');
  var bouquetWrap = document.getElementById('bouquetWrap');
  var restartBtn = document.getElementById('restartBtn');

  var thinkCloud = document.getElementById('thinkCloud');
  var guide = document.getElementById('guide');

  var petalField = document.getElementById('petalField');
  var heartsLayer = document.getElementById('heartsLayer');

  var userName = '';
  var cakeCut = false;

  function showScreen(target) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    target.classList.add('active');
    updateGuideForScreen(target.id);
  }

  function setGuideText(text) {
    if (!thinkCloud) return;
    thinkCloud.textContent = text;
  }

  function updateGuideForScreen(screenId) {
    if (screenId === 'nameScreen') {
      setGuideText('Woof! I am Bruno the golden retriever. Enter your name and lets celebrate.');
    } else if (screenId === 'wishScreen') {
      setGuideText('Beautiful! Tap Cut the Cake, I will guide you to the highlight scene.');
    } else if (screenId === 'cakeScreen') {
      setGuideText('Move your mouse to control the knife, then click once to cut the cake.');
    } else if (screenId === 'letterScreen') {
      setGuideText('Enjoy this letter and your bouquet of roses from Pravesh.');
    }
  }

  function barkSound() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    try {
      var ctx = new AC();
      if (ctx.state === 'suspended') {
        var unlock = function () {
          ctx.resume().then(function () { playBark(ctx); });
          document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        return;
      }
      playBark(ctx);
    } catch (err) {
      // audio can fail silently on some devices
    }
  }

  function playBark(ctx) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    var t = ctx.currentTime;
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  function introGuide() {
    if (typeof gsap === 'undefined') return;

    gsap.fromTo('#guide',
      { x: -150, opacity: 0, scale: 0.88 },
      { x: 0, opacity: 1, scale: 1, duration: 0.95, ease: 'back.out(1.5)' }
    );

    barkSound();

    setTimeout(function () {
      setGuideText('Woof woof! Welcome! I am Bruno and I will guide you through this celebration.');
    }, 850);

    setTimeout(function () {
      updateGuideForScreen('nameScreen');
    }, 2600);
  }

  function fireConfetti(duration, particleCount) {
    if (typeof confetti === 'undefined') return;

    var dur = duration || 2500;
    var count = particleCount || 4;
    var end = Date.now() + dur;

    (function frame() {
      confetti({
        particleCount: count,
        spread: 72,
        angle: 65 + Math.random() * 50,
        origin: { x: Math.random(), y: Math.random() * 0.45 },
        colors: ['#ffd082', '#ff7eac', '#d22758', '#fff', '#74b9ff']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function dropRoses(count) {
    if (!petalField) return;

    for (var i = 0; i < count; i++) {
      var rose = document.createElement('span');
      rose.className = 'falling-rose';
      rose.style.left = Math.random() * 100 + '%';
      rose.style.top = '-60px';
      rose.style.animationDuration = 3.8 + Math.random() * 2 + 's';
      rose.style.animationDelay = Math.random() * 1.8 + 's';
      rose.style.transform = 'rotate(' + (Math.random() * 40 - 20) + 'deg)';
      petalField.appendChild(rose);
      rose.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function dropPetals(count) {
    if (!petalField) return;

    var colors = [
      'radial-gradient(circle at 30% 30%, #ffdbe7, #de3d6f 60%)',
      'radial-gradient(circle at 30% 30%, #ffc3da, #cf2f59 60%)',
      'radial-gradient(circle at 30% 30%, #ffe5ee, #f26d93 60%)'
    ];

    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.top = '-18px';
      petal.style.width = 10 + Math.random() * 12 + 'px';
      petal.style.height = 8 + Math.random() * 8 + 'px';
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      petal.style.animationDuration = 3.8 + Math.random() * 2.5 + 's';
      petal.style.animationDelay = Math.random() * 2 + 's';
      petalField.appendChild(petal);
      petal.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function spawnHeart() {
    if (!heartsLayer) return;

    var h = document.createElement('span');
    h.className = 'floating-heart';
    h.innerHTML = ['&#10084;', '&#9829;', '&#10085;'][Math.floor(Math.random() * 3)];
    h.style.left = Math.random() * 100 + '%';
    h.style.bottom = '-24px';
    h.style.fontSize = 14 + Math.random() * 16 + 'px';
    h.style.animationDuration = 5 + Math.random() * 2.5 + 's';
    heartsLayer.appendChild(h);
    h.addEventListener('animationend', function () { this.remove(); });
  }

  setInterval(spawnHeart, 1300);

  function buildLetter() {
    letterBody.innerHTML = '';
    var lines = [
      'Dear ' + userName + ',',
      'Today is a reminder that your presence is a gift. Your kindness, your heart, and your strength are deeply special.',
      'You are capable of beautiful things. Keep believing in your dreams, even when the road gets difficult.',
      'May this year bring confidence, peace, growth, and memories that make you smile for years.',
      'Happy Birthday, ' + userName + '. Keep shining and keep going. The best is still ahead of you.'
    ];

    lines.forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      letterBody.appendChild(p);
    });

    if (typeof gsap !== 'undefined') {
      gsap.from('#letterCard', { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' });
      gsap.from('#letterBody p', { opacity: 0, y: 16, duration: 0.5, stagger: 0.14, delay: 0.3 });
    }
  }

  function showBouquet() {
    if (!bouquetWrap) return;
    bouquetWrap.classList.add('show');
    setGuideText('These roses are for you. From Pravesh.');
    dropRoses(16);
  }

  function resetCake() {
    cakeCut = false;
    cutLine.classList.remove('cutting');
    cakeSlice.classList.remove('visible');
    cakeInstruction.textContent = 'Click the cake area once to make a perfect cut.';
    document.querySelectorAll('.flame').forEach(function (f) {
      f.classList.remove('out');
    });
    if (bouquetWrap) bouquetWrap.classList.remove('show');
  }

  nameSubmit.addEventListener('click', function () {
    var val = nameInput.value.trim();
    if (!val) {
      nameInput.focus();
      nameInput.style.borderColor = '#ff4f85';
      return;
    }

    userName = val;
    wishTitle.textContent = 'Happy Birthday, ' + userName + '!';
    wishSub.textContent = 'May your day be filled with laughter, roses, and sweet moments.';

    showScreen(wishScreen);
    fireConfetti(2600, 4);
    dropRoses(34);
    dropPetals(40);
  });

  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') nameSubmit.click();
  });

  goToCake.addEventListener('click', function () {
    resetCake();
    showScreen(cakeScreen);
  });

  cakeArea.addEventListener('mousemove', function (e) {
    var rect = cakeArea.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    knife.style.left = x + 'px';
    knife.style.top = y + 'px';
  });

  cakeArea.addEventListener('click', function () {
    if (cakeCut) return;
    cakeCut = true;

    cutLine.classList.add('cutting');
    document.querySelectorAll('.flame').forEach(function (f) { f.classList.add('out'); });

    setTimeout(function () {
      cakeSlice.classList.add('visible');
      cakeInstruction.textContent = 'Perfect cut! This cake looks delicious.';
      setGuideText('Amazing cut! Opening your letter now.');
      fireConfetti(1800, 3);
      dropRoses(20);
    }, 900);

    setTimeout(function () {
      buildLetter();
      showScreen(letterScreen);
      fireConfetti(900, 1);
      setTimeout(showBouquet, 1100);
    }, 2900);
  });

  restartBtn.addEventListener('click', function () {
    nameInput.value = '';
    resetCake();
    showScreen(nameScreen);
    nameInput.focus();
  });

  if (typeof gsap !== 'undefined') {
    gsap.from('.intro-card', { opacity: 0, y: 36, duration: 0.8, ease: 'power2.out' });
  }

  document.addEventListener('mousemove', function (e) {
    var dot = document.createElement('span');
    dot.style.cssText =
      'position:fixed;pointer-events:none;z-index:80;width:4px;height:4px;border-radius:50%;' +
      'background:' + ['#ffd082', '#ff8cb7', '#9ed0ff'][Math.floor(Math.random() * 3)] + ';' +
      'left:' + e.clientX + 'px;top:' + e.clientY + 'px;animation:sparkFade .45s ease forwards;';
    document.body.appendChild(dot);
    dot.addEventListener('animationend', function () { this.remove(); });
  });

  var dyn = document.createElement('style');
  dyn.textContent = '@keyframes sparkFade{to{transform:translateY(-15px) scale(0);opacity:0}}';
  document.head.appendChild(dyn);

  nameInput.focus();
  introGuide();
  updateGuideForScreen('nameScreen');
})();
