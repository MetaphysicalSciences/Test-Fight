const player = document.getElementById('player');
let currentAnim = 'idle';
let currentFrame = 0;
let direction = 1;       // +1 = facing right, -1 = facing left
let movementKeys = {};   // track W/A/S/D

// total frames
const frames = {
  idle:   60,
  walk:   76,
  punch: 100,
  secret: 16,
};

function updateBackground() {
  const n = String(currentFrame).padStart(3, '0');
  const folder = currentAnim === 'secret' ? 'test1' : currentAnim;
  player.style.backgroundImage = `url('${folder}/tile${n}.png')`;
  player.style.transform = `scaleX(${direction})`;
}

function stepAnim() {
  // advance frame
  currentFrame = (currentFrame + 1) % frames[currentAnim];
  updateBackground();
}

function handleMovement() {
  // if in secret or punch, only animate, no movement
  if (currentAnim === 'punch' || currentAnim === 'secret') {
    return;
  }

  // horizontal
  if (movementKeys['a']) {
    direction = -1;
    player.style.left = (player.offsetLeft - 5) + 'px';
    currentAnim = 'walk';
  } else if (movementKeys['d']) {
    direction = +1;
    player.style.left = (player.offsetLeft + 5) + 'px';
    currentAnim = 'walk';
  } else {
    currentAnim = 'idle';
  }

  // vertical (if you want to use W/S for up/down)
  if (movementKeys['w']) {
    player.style.top = (player.offsetTop - 5) + 'px';
  } else if (movementKeys['s']) {
    player.style.top = (player.offsetTop + 5) + 'px';
  }
}

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (['a','s','d','w'].includes(key)) {
    movementKeys[key] = true;
  }
  if (key === ' ') {
    currentAnim = 'punch';
    currentFrame = 0;
  }
  if (key === 'p') {
    currentAnim = 'secret';
    currentFrame = 0;
  }
});

document.addEventListener('keyup', e => {
  const key = e.key.toLowerCase();
  if (['a','s','d','w'].includes(key)) {
    movementKeys[key] = false;
  }
  // When punch or secret key is released, go back to idle
  if (key === ' ' && currentAnim === 'punch') {
    currentAnim = 'idle';
    currentFrame = 0;
  }
  if (key === 'p' && currentAnim === 'secret') {
    currentAnim = 'idle';
    currentFrame = 0;
  }
});

// main game loop: move + animate
setInterval(() => {
  handleMovement();
  stepAnim();
}, 100);
