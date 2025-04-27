// Define the variables to track the current frame, animation type, and image
let currentFrame = 0;
let isFlipped = false;  // Track whether the character is facing left or right
let animationType = 'idle'; // Default animation type
const totalIdleFrames = 60;
const totalWalkFrames = 76;  // From tile000.png to tile075.png
const totalPunchFrames = 100;  // From tile000.png to tile099.png
const totalSecretFrames = 16; // From tile000.png to tile015.png
const characterImage = document.getElementById("character"); // Get the character image element

// Function to change the image based on the current frame and animation type
function changeCharacterFrame() {
    let frameNumber = currentFrame.toString().padStart(3, "0");
    let animationFolder = animationType;

    // Flip the character if moving right
    if (isFlipped) {
        characterImage.style.transform = "scaleX(-1)"; // Flip image horizontally
    } else {
        characterImage.style.transform = "scaleX(1)"; // Set normal (non-flipped) view
    }

    // Determine the image source path based on the current animation and frame
    if (animationType === 'walk') {
        // Walking frames (tile000.png to tile075.png)
        characterImage.src = `walk/tile${frameNumber}.png`;
    } else if (animationType === 'punch') {
        // Punching frames (tile000.png to tile099.png)
        characterImage.src = `punch/tile${frameNumber}.png`;
    } else if (animationType === 'test1') {
        // Secret animation frames (tile000.png to tile015.png)
        characterImage.src = `test1/tile${frameNumber}.png`;
    } else {
        // Idle frames (tile000.png to tile059.png)
        characterImage.src = `idle/tile${frameNumber}.png`;
    }
}

// Function to handle walking (movement)
function walk(direction) {
    if (direction === 'right') {
        isFlipped = false;  // Facing right
    } else if (direction === 'left') {
        isFlipped = true;   // Facing left
    }

    animationType = 'walk';  // Switch to walking animation
    currentFrame = (currentFrame + 1) % totalWalkFrames;  // Loop through walk frames
    changeCharacterFrame();
}

// Function to handle punching
function punch() {
    animationType = 'punch';  // Switch to punch animation
    currentFrame = (currentFrame + 1) % totalPunchFrames;  // Loop through punch frames
    changeCharacterFrame();
}

// Function to handle the secret animation when 'P' is pressed
function secretAnimation() {
    animationType = 'test1';  // Switch to secret animation
    currentFrame = (currentFrame + 1) % totalSecretFrames;  // Loop through secret frames
    changeCharacterFrame();
}

// Listen for key presses to control movement and animations
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        walk('right');  // Move right when arrow right key is pressed
    } else if (event.key === 'ArrowLeft') {
        walk('left');   // Move left when arrow left key is pressed
    } else if (event.key === ' ') {
        punch();        // Punch when spacebar is pressed
    } else if (event.key === 'p' || event.key === 'P') {
        secretAnimation();  // Activate secret animation when 'P' is pressed
    }
});

// Start the idle animation when no key is pressed
setInterval(() => {
    if (animationType === 'idle') {
        currentFrame = (currentFrame + 1) % totalIdleFrames;  // Loop through idle frames
        changeCharacterFrame();
    }
}, 100);  // Adjust the speed of the idle animation here (lower is faster)
