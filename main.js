const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};

const player = {
    x: 400,
    y: 300,
    width: 100,
    height: 100,
    speed: 3,
    flip: false,
    anim: 'idle',
    frame: 0,
    frameTimer: 0,
    frameDelay: 100,
    punching: false,
    secret: false
};

const animations = {
    idle: { path: 'idle', frames: 60 },
    walk: { path: 'walk', frames: 76 },
    punch: { path: 'punch', frames: 88 },
    secret: { path: 'secret', frames: 16 }
};

const images = {};

// Load all images
function loadImages(callback) {
    let total = 0;
    let loaded = 0;

    for (let anim in animations) {
        images[anim] = [];
        for (let i = 0; i < animations[anim].frames; i++) {
            total++;
            const img = new Image();
            img.src = `${animations[anim].path}/tile${i.toString().padStart(3, '0')}.png`;
            img.onload = () => {
                loaded++;
                if (loaded === total) callback();
            };
            img.onerror = () => {
                console.error(`Failed to load ${img.src}`);
            };
            images[anim].push(img);
        }
    }
}

// Controls
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === 'p') {
        player.secret = true;
        player.anim = 'secret';
        player.frame = 0;
        player.frameTimer = 0;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

document.addEventListener('mousedown', () => {
    if (!player.secret) {
        player.punching = true;
        player.anim = 'punch';
        player.frame = 0;
        player.frameTimer = 0;
    }
});

document.addEventListener('mouseup', () => {
    player.punching = false;
});

// Update
function update(delta) {
    let moving = false;
    if (!player.secret && !player.punching) {
        player.anim = 'idle';
    }

    if (!player.secret) {
        if (keys['a']) {
            player.x -= player.speed;
            player.flip = true;
            moving = true;
        }
        if (keys['d']) {
            player.x += player.speed;
            player.flip = false;
            moving = true;
        }
        if (keys['w']) {
            player.y -= player.speed;
            moving = true;
        }
        if (keys['s']) {
            player.y += player.speed;
            moving = true;
        }
    }

    if (moving && !player.punching && !player.secret) {
        player.anim = 'walk';
    }

    player.frameTimer += delta;
    if (player.frameTimer > player.frameDelay) {
        player.frameTimer = 0;
        player.frame++;
        if (player.frame >= animations[player.anim].frames) {
            player.frame = 0;
            if (player.secret) {
                player.secret = false;
                player.anim = 'idle';
            }
            if (player.punching) {
                player.punching = false;
                player.anim = 'idle';
            }
        }
    }
}

// Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (player.flip) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            images[player.anim][player.frame],
            -player.x - player.width, player.y,
            player.width, player.height
        );
    } else {
        ctx.drawImage(
            images[player.anim][player.frame],
            player.x, player.y,
            player.width, player.height
        );
    }
    ctx.restore();
}

// Main loop
let lastTime = 0;
function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    update(delta);
    draw();

    requestAnimationFrame(loop);
}

// Start after loading images
loadImages(() => {
    requestAnimationFrame(loop);
});
