/* ═══════════════════════════════════════════════════════
   Birthday Celebration — Script
   Three.js · GSAP · tsParticles · AOS · Vanilla-Tilt
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────
     0. LOADER
     ──────────────────────────────────── */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('hidden'), 1800);
  });

  /* ────────────────────────────────────
     1. AOS — scroll-reveal animations
     ──────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 900, once: true, offset: 60 });
  }

  /* ────────────────────────────────────
     2. VANILLA TILT — on wish cards
     ──────────────────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(function (el) {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(el, {
        max: 12,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
      });
    }
  });

  /* ────────────────────────────────────
     3. GSAP — hero entrance timeline
     ──────────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    var tl = gsap.timeline({ delay: 2 });
    tl.from('.hero__text .eyebrow', { opacity: 0, y: 20, duration: 0.6 })
      .from('.hero__text h1', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.hero__sub', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.cta-row .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.2')
      .from('.hero__canvas', { opacity: 0, scale: 0.85, duration: 0.9 }, '-=0.6');

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.rose-card').forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%' },
          opacity: 0,
          y: 40,
          rotateX: 10,
          duration: 0.7,
          delay: i * 0.1,
        });
      });
    }
  }

  /* ────────────────────────────────────
     4. THREE.JS — 3D Birthday Cake
     ──────────────────────────────────── */
  var cakeCanvas = document.getElementById('cakeCanvas');
  var candlesLit = true;

  if (cakeCanvas && typeof THREE !== 'undefined') {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 1.5, 0);

    var renderer = new THREE.WebGLRenderer({ canvas: cakeCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    function resizeRenderer() {
      var size = Math.min(cakeCanvas.parentElement.clientWidth, 480);
      renderer.setSize(size, size);
    }
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    // Lighting
    var ambientLight = new THREE.AmbientLight(0xffe4e1, 0.6);
    scene.add(ambientLight);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xff6699, 0.5, 12);
    pointLight.position.set(-2, 5, 2);
    scene.add(pointLight);

    // Materials
    var creamMat = new THREE.MeshStandardMaterial({ color: 0xfff5e6, roughness: 0.4 });
    var pinkMat = new THREE.MeshStandardMaterial({ color: 0xe8506a, roughness: 0.35 });
    var roseMat = new THREE.MeshStandardMaterial({ color: 0xc62c48, roughness: 0.3 });
    var goldMat = new THREE.MeshStandardMaterial({ color: 0xf3c27f, roughness: 0.25, metalness: 0.5 });
    var candleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    var flameMat = new THREE.MeshStandardMaterial({ color: 0xffd966, emissive: 0xff6600, emissiveIntensity: 1.5 });

    // Cake group
    var cakeGroup = new THREE.Group();

    // Base layer
    var baseGeom = new THREE.CylinderGeometry(2.2, 2.3, 1.2, 48);
    var baseMesh = new THREE.Mesh(baseGeom, roseMat);
    baseMesh.position.y = 0.6;
    baseMesh.castShadow = true;
    cakeGroup.add(baseMesh);

    // Middle layer
    var midGeom = new THREE.CylinderGeometry(1.7, 1.8, 1.0, 48);
    var midMesh = new THREE.Mesh(midGeom, pinkMat);
    midMesh.position.y = 1.7;
    midMesh.castShadow = true;
    cakeGroup.add(midMesh);

    // Top layer
    var topGeom = new THREE.CylinderGeometry(1.2, 1.3, 0.8, 48);
    var topMesh = new THREE.Mesh(topGeom, creamMat);
    topMesh.position.y = 2.6;
    topMesh.castShadow = true;
    cakeGroup.add(topMesh);

    // Frosting rings
    var frostRingGeom = new THREE.TorusGeometry(2.2, 0.08, 8, 48);
    var frostRing1 = new THREE.Mesh(frostRingGeom, goldMat);
    frostRing1.rotation.x = Math.PI / 2;
    frostRing1.position.y = 1.2;
    cakeGroup.add(frostRing1);

    var frostRingGeom2 = new THREE.TorusGeometry(1.7, 0.07, 8, 48);
    var frostRing2 = new THREE.Mesh(frostRingGeom2, goldMat);
    frostRing2.rotation.x = Math.PI / 2;
    frostRing2.position.y = 2.2;
    cakeGroup.add(frostRing2);

    // Small roses on top
    var roseDecoGeom = new THREE.SphereGeometry(0.18, 16, 16);
    var roseColors = [0xff4466, 0xff9ec0, 0xcc1133, 0xffb8d4];
    for (var r = 0; r < 8; r++) {
      var angle = (r / 8) * Math.PI * 2;
      var rDeco = new THREE.Mesh(roseDecoGeom, new THREE.MeshStandardMaterial({
        color: roseColors[r % roseColors.length],
        roughness: 0.3
      }));
      rDeco.position.set(Math.cos(angle) * 0.8, 3.1, Math.sin(angle) * 0.8);
      cakeGroup.add(rDeco);
    }

    // Candles
    var candles = [];
    var flames = [];
    var candlePositions = [
      { x: 0, z: 0 },
      { x: 0.4, z: 0.4 },
      { x: -0.4, z: 0.4 },
      { x: 0.4, z: -0.4 },
      { x: -0.4, z: -0.4 },
    ];
    candlePositions.forEach(function (pos) {
      var candleGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
      var candle = new THREE.Mesh(candleGeom, candleMat);
      candle.position.set(pos.x, 3.3, pos.z);
      cakeGroup.add(candle);
      candles.push(candle);

      var flameGeom = new THREE.SphereGeometry(0.08, 8, 8);
      var flame = new THREE.Mesh(flameGeom, flameMat.clone());
      flame.position.set(pos.x, 3.65, pos.z);
      flame.scale.y = 1.6;
      cakeGroup.add(flame);
      flames.push(flame);
    });

    // Plate
    var plateGeom = new THREE.CylinderGeometry(2.8, 2.8, 0.12, 48);
    var plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.3 });
    var plate = new THREE.Mesh(plateGeom, plateMat);
    plate.position.y = -0.05;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // Slice group (hidden initially)
    var sliceGroup = new THREE.Group();
    sliceGroup.visible = false;

    var sliceShape = new THREE.Shape();
    sliceShape.moveTo(0, 0);
    sliceShape.lineTo(2.2, -0.6);
    sliceShape.lineTo(2.2, 0.6);
    sliceShape.closePath();

    var extrudeSettings = { depth: 3.0, bevelEnabled: false };
    var sliceGeom = new THREE.ExtrudeGeometry(sliceShape, extrudeSettings);
    var sliceMesh = new THREE.Mesh(sliceGeom, new THREE.MeshStandardMaterial({ color: 0xf6c87d, roughness: 0.5 }));
    sliceMesh.rotation.x = -Math.PI / 2;
    sliceMesh.position.set(0, 0, -1.5);
    sliceGroup.add(sliceMesh);

    // Inner layers on slice
    var innerSlice1 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.3, 1),
      new THREE.MeshStandardMaterial({ color: 0xe8506a, roughness: 0.5 })
    );
    innerSlice1.position.set(1, 1.0, 0);
    sliceGroup.add(innerSlice1);

    var innerSlice2 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.3, 1),
      new THREE.MeshStandardMaterial({ color: 0xc62c48, roughness: 0.5 })
    );
    innerSlice2.position.set(1, 1.8, 0);
    sliceGroup.add(innerSlice2);

    sliceGroup.position.set(3, 0, 0);
    scene.add(sliceGroup);

    scene.add(cakeGroup);

    // Orbit-like mouse rotation
    var isDragging = false;
    var prevX = 0;
    var rotationY = 0;

    cakeCanvas.addEventListener('mousedown', function (e) { isDragging = true; prevX = e.clientX; });
    cakeCanvas.addEventListener('touchstart', function (e) { isDragging = true; prevX = e.touches[0].clientX; });
    window.addEventListener('mouseup', function () { isDragging = false; });
    window.addEventListener('touchend', function () { isDragging = false; });
    cakeCanvas.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      rotationY += (e.clientX - prevX) * 0.008;
      prevX = e.clientX;
    });
    cakeCanvas.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      rotationY += (e.touches[0].clientX - prevX) * 0.008;
      prevX = e.touches[0].clientX;
    });

    // Animate
    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      if (!isDragging) {
        rotationY += 0.003;
      }
      cakeGroup.rotation.y = rotationY;

      // Flame flicker
      flames.forEach(function (flame, i) {
        if (candlesLit) {
          flame.visible = true;
          flame.scale.y = 1.4 + Math.sin(t * 8 + i) * 0.3;
          flame.scale.x = 1 + Math.sin(t * 6 + i * 2) * 0.15;
          flame.material.emissiveIntensity = 1.2 + Math.sin(t * 10 + i) * 0.5;
        } else {
          flame.visible = false;
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    // Cut cake handler
    var cutButton = document.getElementById('cutButton');
    if (cutButton) {
      cutButton.addEventListener('click', function () {
        sliceGroup.visible = true;
        sliceGroup.position.set(2.5, 0, 0);
        sliceGroup.rotation.y = cakeGroup.rotation.y;

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(sliceGroup.position, { x: 0 }, { x: 3.5, duration: 1, ease: 'power2.out' });
          gsap.fromTo(sliceGroup.position, { y: 0 }, { y: 0.3, duration: 0.6, ease: 'power2.out', yoyo: true, repeat: 1 });
        }

        // Confetti burst
        fireConfetti();
      });
    }

    // Blow candles
    var blowBtn = document.getElementById('blowCandles');
    if (blowBtn) {
      blowBtn.addEventListener('click', function () {
        candlesLit = !candlesLit;
        blowBtn.innerHTML = candlesLit
          ? '<i class="fa-solid fa-wind"></i> Blow!'
          : '<i class="fa-solid fa-fire"></i> Relight';

        if (!candlesLit) {
          // Smoke puff effect using petals
          dropPetals(15, ['#aaa', '#ccc', '#999']);
        }
      });
    }
  }

  /* ────────────────────────────────────
     5. PETAL / ROSE SHOWER
     ──────────────────────────────────── */
  var petalField = document.getElementById('petalField');
  var petalColors = [
    'radial-gradient(circle at 30% 30%, #ffd4de, #d22f4f 60%)',
    'radial-gradient(circle at 30% 30%, #ffb8d4, #e8608a 60%)',
    'radial-gradient(circle at 30% 30%, #ffe0e8, #ff7088 60%)',
    'radial-gradient(circle at 30% 30%, #ffccd5, #cc1133 60%)',
  ];

  function dropPetals(count, colors) {
    if (!petalField) return;
    var palette = colors || petalColors;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.top = '-20px';
      petal.style.background = palette[Math.floor(Math.random() * palette.length)];
      petal.style.animationDelay = Math.random() * 2 + 's';
      petal.style.animationDuration = 3 + Math.random() * 3 + 's';
      petal.style.width = 10 + Math.random() * 14 + 'px';
      petal.style.height = 8 + Math.random() * 10 + 'px';
      petal.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      petalField.appendChild(petal);
      petal.addEventListener('animationend', function () { this.remove(); });
    }
  }

  var petalButton = document.getElementById('petalButton');
  if (petalButton) petalButton.addEventListener('click', function () { dropPetals(50); });

  var roseRainBtn = document.getElementById('roseRainBtn');
  if (roseRainBtn) roseRainBtn.addEventListener('click', function () { dropPetals(80); });

  /* ────────────────────────────────────
     6. CONFETTI (tsParticles)
     ──────────────────────────────────── */
  function fireConfetti() {
    if (typeof confetti === 'undefined') return;
    var duration = 2500;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60 + Math.random() * 60,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#c62c48', '#f3c27f', '#ff7eb3', '#fff', '#ffd966'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  var confettiButton = document.getElementById('confettiButton');
  if (confettiButton) confettiButton.addEventListener('click', fireConfetti);

  /* ────────────────────────────────────
     7. FLOATING HEARTS
     ──────────────────────────────────── */
  var heartsLayer = document.getElementById('heartsLayer');
  function spawnHeart() {
    if (!heartsLayer) return;
    var heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.innerHTML = ['&#10084;', '&#10085;', '&#9829;'][Math.floor(Math.random() * 3)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-30px';
    heart.style.fontSize = 14 + Math.random() * 18 + 'px';
    heart.style.animationDuration = 5 + Math.random() * 4 + 's';
    heartsLayer.appendChild(heart);
    heart.addEventListener('animationend', function () { this.remove(); });
  }
  setInterval(spawnHeart, 1200);

  /* ────────────────────────────────────
     8. WISH SEALER
     ──────────────────────────────────── */
  var sealBtn = document.getElementById('sealWish');
  var wishInput = document.getElementById('wishInput');
  var sealedWish = document.getElementById('sealedWish');

  if (sealBtn && wishInput && sealedWish) {
    sealBtn.addEventListener('click', function () {
      var text = wishInput.value.trim();
      if (!text) return;
      var sanitized = document.createTextNode('\u2728 "' + text + '" \u2728');
      sealedWish.textContent = '';
      sealedWish.appendChild(sanitized);
      sealedWish.classList.add('visible');
      wishInput.value = '';
      dropPetals(20);
      fireConfetti();
    });
  }

  /* ────────────────────────────────────
     9. CURSOR SPARKLE TRAIL
     ──────────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    var sparkle = document.createElement('span');
    sparkle.style.cssText =
      'position:fixed;pointer-events:none;z-index:20;width:6px;height:6px;' +
      'border-radius:50%;background:' +
      ['#ff7eb3', '#f3c27f', '#c62c48', '#ffd966'][Math.floor(Math.random() * 4)] +
      ';left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
      'animation:sparkFade .6s ease forwards;';
    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', function () { this.remove(); });
  });

  // Inject sparkle keyframe
  var styleEl = document.createElement('style');
  styleEl.textContent = '@keyframes sparkFade{to{transform:translateY(-20px) scale(0);opacity:0;}}';
  document.head.appendChild(styleEl);

})();