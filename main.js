const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Settings
const frameRates = {
    idle: 10,
    walk: 12,
    punch: 15,
    secret: 15
};

const animations = {
    idle: { path: "idle", frames: 60 },
    punch: { path: "punch", frames: 88 },
    walk: { path: "walk", frames: 76 },
    secret: { path: "secret", frames: 16 }
};

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100,
    height: 100,
    speed: 3,
    vx: 0,
    vy: 0,
    flip: false,
    currentAnimation: "idle",
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 1000 / frameRates.idle,
};

let keys = {};
let punching = false;
let secretMode = false;

// Preload images
let imageCache = {};

for (let anim in animations) {
    imageCache[anim] = [];
    for (let i = 0; i < animations[anim].frames; i++) {
        let img = new Image();
        img.src = `${animations[anim].path}/tile${i.toString().padStart(3, '0')}.png`;
        imageCache[anim].push(img);
    }
}

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === 'p') {
        secretMode = true;
        player.currentAnimation = 'secret';
        player.frameIndex = 0;
        player.frameTimer = 0;
        player.frameInterval = 1000 / frameRates.secret;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

window.addEventListener('mousedown', () => {
    punching = true;
});

window.addEventListener('mouseup', () => {
    punching = false;
});

function update(deltaTime) {
    player.vx = 0;
    player.vy = 0;
    player.flip = false;

    if (!secretMode) {
        if (keys['w']) player.vy = -player.speed;
        if (keys['s']) player.vy = player.speed;
        if (keys['a']) {
            player.vx = -player.speed;
            player.flip = true;
        }
        if (keys['d']) player.vx = player.speed;
        
        if (punching) {
            player.currentAnimation = "punch";
            player.frameInterval = 1000 / frameRates.punch;
        } else if (player.vx !== 0 || player.vy !== 0) {
            player.currentAnimation = "walk";
            player.frameInterval = 1000 / frameRates.walk;
        } else {
            player.currentAnimation = "idle";
            player.frameInterval = 1000 / frameRates.idle;
        }
    }

    player.x += player.vx;
    player.y += player.vy;

    // Animation frame update
    player.frameTimer += deltaTime;
    if (player.frameTimer > player.frameInterval) {
        player.frameTimer = 0;
        player.frameIndex++;
        if (player.frameIndex >= animations[player.currentAnimation].frames) {
            player.frameIndex = 0;
            if (secretMode) {
                secretMode = false;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (player.flip) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            imageCache[player.currentAnimation][player.frameIndex],
            -player.x - player.width, player.y,
            player.width, player.height
        );
    } else {
        ctx.drawImage(
            imageCache[player.currentAnimation][player.frameIndex],
            player.x, player.y,
            player.width, player.height
        );
    }
    ctx.restore();
}

let lastTime = 0;
function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
