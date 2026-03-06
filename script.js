const slice = document.getElementById('slice');
const cake = document.getElementById('cake');
const thickness = document.getElementById('thickness');
const cutButton = document.getElementById('cutButton');
const petalButton = document.getElementById('petalButton');
const petalField = document.getElementById('petalField');

function animateSlice() {
  if (!slice || !cake) return;
  const angle = Math.floor(Math.random() * 360);
  slice.style.setProperty('--slice-angle', `${angle}deg`);
  slice.classList.remove('active');
  void slice.offsetWidth; // restart animation
  slice.classList.add('active');
}

function updateThickness(event) {
  const value = event.target.value;
  slice?.style.setProperty('--slice-width', `${value}%`);
}

function dropPetals(count = 24) {
  if (!petalField) return;
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 1.5}s`;
    petal.style.animationDuration = `${3 + Math.random() * 2}s`;
    petalField.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
}

cutButton?.addEventListener('click', animateSlice);
thickness?.addEventListener('input', updateThickness);
petalButton?.addEventListener('click', () => dropPetals(30));

// initial state
slice?.style.setProperty('--slice-width', `${thickness?.value || 18}%`);
