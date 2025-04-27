const player = document.getElementById('player');
let currentAnim = 'idle'; // Default animation
let currentFrame = 0;
let movingRight = false;
let isPunching = false;
let isSecret = false;

// Define total frames per animation
const idleFrames = 60;
const walkFrames = 76;
const punchFrames = 100;
const secretFrames = 16;

// Helper function to update the image based on current animation and frame
function updatePlayerImage() {
    let frame = currentFrame.toString().padStart(3, '0');
    let animationFolder = '';

    if (currentAnim === 'idle') {
        animationFolder = 'idle';
    } else if (currentAnim === 'walk') {
        animationFolder = 'walk';
    } else if (currentAnim === 'punch') {
        animationFolder = 'punch';
    } else if (currentAnim === 'secret') {
        animationFolder = 'test1';
    }

    player.style.backgroundImage = `url('${animationFolder}/tile${frame}.png')`;
}

// Update the animation on keypress
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        currentAnim = 'walk';
        movingRight = event.key === 'ArrowRight';
        currentFrame = 0; // Reset animation
    } else if (event.key === ' ') {
        currentAnim = 'punch';
        currentFrame = 0; // Reset punch animation
    } else if (event.key === 'p') {
        currentAnim = 'secret';
        currentFrame = 0; // Reset secret animation
    }
});

// Update the character's position and flip when moving right
function movePlayer() {
    if (currentAnim === 'walk') {
        currentFrame = (currentFrame + 1) % walkFrames;

        if (movingRight) {
            player.style.transform = 'scaleX(1)';
            player.style.left = parseInt(player.style.left) + 5 + 'px';
        } else {
            player.style.transform = 'scaleX(-1)';
            player.style.left = parseInt(player.style.left) - 5 + 'px';
        }
    }

    // Loop through idle animation if not moving
    if (currentAnim === 'idle') {
        currentFrame = (currentFrame + 1) % idleFrames;
    }

    // Loop through punch animation when space is pressed
    if (currentAnim === 'punch') {
        currentFrame = (currentFrame + 1) % punchFrames;
    }

    // Loop through secret animation when P is pressed
    if (currentAnim === 'secret') {
        currentFrame = (currentFrame + 1) % secretFrames;
    }

    updatePlayerImage();
}

// Call movePlayer every 100ms
setInterval(movePlayer, 100);
