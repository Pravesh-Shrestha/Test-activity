(function () {
  'use strict';

  // ── Elements ──
  var nameScreen   = document.getElementById('nameScreen');
  var wishScreen   = document.getElementById('wishScreen');
  var cakeScreen   = document.getElementById('cakeScreen');
  var letterScreen = document.getElementById('letterScreen');

  var nameInput    = document.getElementById('nameInput');
  var nameSubmit   = document.getElementById('nameSubmit');
  var wishTitle    = document.getElementById('wishTitle');
  var wishSub      = document.getElementById('wishSub');
  var goToCake     = document.getElementById('goToCake');

  var cakeArea     = document.getElementById('cakeArea');
  var knife        = document.getElementById('knife');
  var cutLine      = document.getElementById('cutLine');
  var cakeSlice    = document.getElementById('cakeSlice');
  var cakeInstruction = document.getElementById('cakeInstruction');

  var letterBody   = document.getElementById('letterBody');
  var restartBtn   = document.getElementById('restartBtn');
  var bouquetWrap  = document.getElementById('bouquetWrap');
  var thinkCloud   = document.getElementById('thinkCloud');

  var petalField   = document.getElementById('petalField');
  var heartsLayer  = document.getElementById('heartsLayer');

  var userName = '';
  var cakeCut = false;

  // ── Screen transitions ──
  function showScreen(target) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    target.classList.add('active');
    updateGuideForScreen(target.id);
  }

  function setGuideText(message) {
    if (!thinkCloud) return;
    thinkCloud.textContent = message;
  }

  function updateGuideForScreen(screenId) {
    if (screenId === 'nameScreen') {
      setGuideText('Hi! I am your birthday guide. Enter your name to begin.');
    } else if (screenId === 'wishScreen') {
      setGuideText('Nice! Tap "Time to Cut the Cake" to open the architect cake studio.');
    } else if (screenId === 'cakeScreen') {
      setGuideText('Move your mouse on the blueprint cake and click once to cut it.');
    } else if (screenId === 'letterScreen') {
      setGuideText('Read your letter, then enjoy a big bouquet from Pravesh.');
    }
  }

  // ════════════════════════════════════
  // 1. NAME ENTRY
  // ════════════════════════════════════
  function handleNameSubmit() {
    var val = nameInput.value.trim();
    if (!val) {
      nameInput.style.borderColor = '#ff4466';
      nameInput.focus();
      return;
    }
    userName = val;

    // Personalize wish screen
    wishTitle.textContent = 'Happy Birthday, ' + userName + '!';
    wishSub.textContent = 'Today is YOUR day, ' + userName + '. You deserve all the happiness in the world!';

    // Transition
    showScreen(wishScreen);

    // Burst confetti + roses
    setTimeout(function () {
      fireConfetti(4000);
      dropRoses(40);
      dropPetals(60);
    }, 400);
  }

  nameSubmit.addEventListener('click', handleNameSubmit);
  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleNameSubmit();
  });

  // ════════════════════════════════════
  // 2. GO TO CAKE SCREEN
  // ════════════════════════════════════
  goToCake.addEventListener('click', function () {
    cakeCut = false;
    cutLine.classList.remove('cutting');
    cakeSlice.classList.remove('visible');
    if (bouquetWrap) bouquetWrap.classList.remove('show');
    showScreen(cakeScreen);
  });

  // ════════════════════════════════════
  // 3. CAKE CUTTING — mouse interaction
  // ════════════════════════════════════
  // Knife follows mouse inside cake area
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

    // Animate cut line
    cutLine.classList.add('cutting');

    // Blow out candles
    document.querySelectorAll('.flame').forEach(function (f) {
      f.classList.add('out');
    });

    // Show slice after cut animation
    setTimeout(function () {
      cakeSlice.classList.add('visible');
      cakeInstruction.textContent = 'You cut the cake! 🎉';
      setGuideText('Great cut! Your motivational letter is opening now.');
      fireConfetti(3000);
      dropRoses(30);
    }, 900);

    // Transition to letter
    setTimeout(function () {
      buildLetter();
      showScreen(letterScreen);
      // Keep confetti softer on letter reveal.
      fireConfetti(1200, 1);
      dropRoses(25);
      setTimeout(showBouquet, 1300);
    }, 3500);
  });

  function showBouquet() {
    if (!bouquetWrap) return;
    bouquetWrap.classList.add('show');
    setGuideText('A big bouquet for you. From Pravesh.');
    dropRoses(12);
  }

  // ════════════════════════════════════
  // 4. BUILD MOTIVATIONAL LETTER
  // ════════════════════════════════════
  function buildLetter() {
    letterBody.innerHTML = '';
    var paragraphs = [
      'Dear ' + userName + ',',
      'On this beautiful day, I want you to know just how incredible you truly are. You light up every room you walk into, and the world is a better place because you exist.',
      'Life will throw challenges your way — that\'s just what it does. But I\'ve seen the fire in your eyes, the kindness in your heart, and the strength in your soul. You are unstoppable.',
      'Never forget: you are worthy of every dream you dare to dream. You are capable of achievements beyond your wildest imagination. Every setback is just a setup for an even greater comeback.',
      'This year, I hope you chase your passions fearlessly, love yourself unapologetically, and laugh until your cheeks hurt. You deserve nothing less than extraordinary.',
      'Here\'s to another year of growth, joy, adventure, and all the beautiful surprises life has in store for you. The best chapters of your story are still being written.',
      'Happy Birthday, ' + userName + '! Never stop being the amazing person you are. 🌹'
    ];

    paragraphs.forEach(function (text) {
      var p = document.createElement('p');
      p.textContent = text;
      letterBody.appendChild(p);
    });

    // Animate paragraphs in with GSAP if available
    if (typeof gsap !== 'undefined') {
      gsap.from('#letterCard', { opacity: 0, y: 60, duration: 1, ease: 'power2.out' });
      gsap.from('#letterBody p', {
        opacity: 0, y: 20, stagger: 0.15, duration: 0.6, delay: 0.5, ease: 'power2.out'
      });
      gsap.from('.letter-signature', { opacity: 0, y: 20, duration: 0.6, delay: 1.8, ease: 'power2.out' });
    }
  }

  // ════════════════════════════════════
  // 5. RESTART
  // ════════════════════════════════════
  restartBtn.addEventListener('click', function () {
    nameInput.value = '';
    cakeCut = false;
    cutLine.classList.remove('cutting');
    cakeSlice.classList.remove('visible');
    if (bouquetWrap) bouquetWrap.classList.remove('show');
    cakeInstruction.textContent = 'Move your mouse over the cake and click to cut!';
    document.querySelectorAll('.flame').forEach(function (f) {
      f.classList.remove('out');
    });
    showScreen(nameScreen);
    nameInput.focus();
  });

  // ════════════════════════════════════
  // EFFECTS — Confetti
  // ════════════════════════════════════
  function fireConfetti(duration, particleCount) {
    if (typeof confetti === 'undefined') return;
    var dur = duration || 3000;
    var count = particleCount || 4;
    var end = Date.now() + dur;
    (function frame() {
      confetti({
        particleCount: count,
        angle: 60 + Math.random() * 60,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#c62c48', '#f3c27f', '#ff7eb3', '#fff', '#ffd966', '#ff4466'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // ════════════════════════════════════
  // EFFECTS — Falling Roses (not just petals)
  // ════════════════════════════════════
  function dropRoses(count) {
    if (!petalField) return;
    var roseEmojis = ['🌹', '🥀', '🌷', '💐', '🌺'];
    for (var i = 0; i < count; i++) {
      var rose = document.createElement('span');
      rose.className = 'falling-rose';
      rose.textContent = roseEmojis[Math.floor(Math.random() * roseEmojis.length)];
      rose.style.left = Math.random() * 100 + '%';
      rose.style.top = '-40px';
      rose.style.animationDelay = Math.random() * 2.5 + 's';
      rose.style.animationDuration = 3 + Math.random() * 3 + 's';
      rose.style.fontSize = 22 + Math.random() * 20 + 'px';
      petalField.appendChild(rose);
      rose.addEventListener('animationend', function () { this.remove(); });
    }
  }

  // ════════════════════════════════════
  // EFFECTS — Falling Petals
  // ════════════════════════════════════
  var petalColors = [
    'radial-gradient(circle at 30% 30%, #ffd4de, #d22f4f 60%)',
    'radial-gradient(circle at 30% 30%, #ffb8d4, #e8608a 60%)',
    'radial-gradient(circle at 30% 30%, #ffe0e8, #ff7088 60%)',
    'radial-gradient(circle at 30% 30%, #ffccd5, #cc1133 60%)',
  ];

  function dropPetals(count) {
    if (!petalField) return;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.top = '-20px';
      petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      petal.style.animationDelay = Math.random() * 2.5 + 's';
      petal.style.animationDuration = 3.5 + Math.random() * 3 + 's';
      petal.style.width = 10 + Math.random() * 14 + 'px';
      petal.style.height = 8 + Math.random() * 10 + 'px';
      petalField.appendChild(petal);
      petal.addEventListener('animationend', function () { this.remove(); });
    }
  }

  // ════════════════════════════════════
  // EFFECTS — Floating Hearts (continuous)
  // ════════════════════════════════════
  function spawnHeart() {
    if (!heartsLayer) return;
    var heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.innerHTML = ['&#10084;', '&#9829;', '&#10085;'][Math.floor(Math.random() * 3)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-30px';
    heart.style.fontSize = 14 + Math.random() * 18 + 'px';
    heart.style.animationDuration = 5 + Math.random() * 4 + 's';
    heartsLayer.appendChild(heart);
    heart.addEventListener('animationend', function () { this.remove(); });
  }
  setInterval(spawnHeart, 1400);

  // ════════════════════════════════════
  // EFFECTS — Cursor sparkles
  // ════════════════════════════════════
  var sparkColors = ['#ff7eb3', '#f3c27f', '#c62c48', '#ffd966'];
  document.addEventListener('mousemove', function (e) {
    var sparkle = document.createElement('span');
    sparkle.style.cssText =
      'position:fixed;pointer-events:none;z-index:250;width:5px;height:5px;' +
      'border-radius:50%;background:' +
      sparkColors[Math.floor(Math.random() * sparkColors.length)] +
      ';left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
      'animation:sparkFade .5s ease forwards;';
    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', function () { this.remove(); });
  });

  // Inject sparkle keyframe
  var style = document.createElement('style');
  style.textContent = '@keyframes sparkFade{to{transform:translateY(-18px) scale(0);opacity:0;}}';
  document.head.appendChild(style);

  // Focus name input on start
  nameInput.focus();
  updateGuideForScreen('nameScreen');

})();