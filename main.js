let currentFrame = 0;
const totalFrames = 160;  // Total number of PNG frames
const frames = [];

// Preload images
for (let i = 1; i <= totalFrames; i++) {
  const img = new Image();
  img.src = `Outputs/${String(i).padStart(4, '0')}.png`;
  frames.push(img);
}

// Set up scroll-based animation
const scrollContainer = document.querySelector('.scroll-container');
const animationContainer = document.getElementById('animation-container');

function displayFrameByScroll(scrollProgress) {
  currentFrame = Math.min(Math.floor(scrollProgress * totalFrames), totalFrames - 1);
  animationContainer.innerHTML = '';  // Clear the previous frame
  animationContainer.appendChild(frames[currentFrame]);  // Show the current frame
}

// Listen to scroll event
window.addEventListener('scroll', () => {
  const containerRect = scrollContainer.getBoundingClientRect();
  const totalScrollHeight = window.innerHeight * 2;  // Adjust this based on desired scroll area

  if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
    const scrollProgress = Math.abs(containerRect.top) / totalScrollHeight;
    displayFrameByScroll(scrollProgress);
  }
});
