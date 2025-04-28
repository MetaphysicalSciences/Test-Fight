const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 4,
    vx: 0,
    vy: 0,
    facingLeft: false,
    currentAnimation: 'idle',
    currentFrame: 0,
    frameTimer: 0,
    frameInterval: 100, // 100ms per frame
};

const animations = {
    idle: { path: 'idle', frameCount: 60 },
    walk: { path: 'walk', frameCount: 76 },
    punch: { path: 'punch', frameCount: 88 },
    secret: { path: 'test1', frameCount: 16 },
};

const images = {};

for (let anim in animations) {
    images[anim] = [];
    for (let i = 0; i < animations[anim].frameCount; i++) {
        let img = new Image();
        let num = String(i).padStart(3, '0');
        img.src = `${animations[anim].path}/tile${num}.png`;
        images[anim].push(img);
    }
}

const keys = {};

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'p') {
        player.currentAnimation = 'secret';
        player.currentFrame = 0;
    }
});

document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousedown', () => {
    player.currentAnimation = 'punch';
    player.currentFrame = 0;
});

function updatePlayer() {
    player.vx = 0;
    player.vy = 0;

    if (keys['a']) {
        player.vx = -player.speed;
        player.facingLeft = true;
    }
    if (keys['d']) {
        player.vx = player.speed;
        player.facingLeft = false;
    }
    if (keys['w']) {
        player.vy = -player.speed;
    }
    if (keys['s']) {
        player.vy = player.speed;
    }

    player.x += player.vx;
    player.y += player.vy;

    // Change animation
    if (player.vx !== 0 || player.vy !== 0) {
        if (player.currentAnimation !== 'walk' && player.currentAnimation !== 'punch' && player.currentAnimation !== 'secret') {
            player.currentAnimation = 'walk';
            player.currentFrame = 0;
        }
    } else {
        if (player.currentAnimation !== 'idle' && player.currentAnimation !== 'punch' && player.currentAnimation !== 'secret') {
            player.currentAnimation = 'idle';
            player.currentFrame = 0;
        }
    }
}

function drawPlayer() {
    const anim = images[player.currentAnimation];
    const frame = anim[Math.floor(player.currentFrame) % anim.length];

    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.facingLeft) {
        ctx.scale(-1, 1);
    }
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();

    player.frameTimer += player.frameInterval;
    if (player.frameTimer >= player.frameInterval) {
        player.currentFrame += 1;
        player.frameTimer = 0;

        if (player.currentAnimation === 'punch' && player.currentFrame >= images['punch'].length) {
            player.currentAnimation = 'idle';
            player.currentFrame = 0;
        }
        if (player.currentAnimation === 'secret' && player.currentFrame >= images['secret'].length) {
            player.currentAnimation = 'idle';
            player.currentFrame = 0;
        }
    }

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
