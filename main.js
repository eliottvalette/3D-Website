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

function displayFrameByScroll(scrollProgress) { // This function calculates which frame to display based on how far the user has scrolled while is a number betwenn 0 and 1
  currentFrame = Math.min(Math.floor(scrollProgress * totalFrames), totalFrames - 1);
  animationContainer.innerHTML = '<a href="#" id="skip-animation" class="skip-animation">Skip the Animation</a>';  // Clear the previous frame
  animationContainer.appendChild(frames[currentFrame]);  // Show the current frame
}
document.addEventListener('DOMContentLoaded', () => {
  animationContainer.appendChild(frames[0])
});

// Listen to scroll event
window.addEventListener('scroll', () => {
  const containerRect = scrollContainer.getBoundingClientRect(); // Get the top and bottom coordinates
  const totalScrollHeight = scrollContainer.scrollHeight - window.innerHeight; // Dynamic calculation of the scrollable part of the animation

  if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
    const scrollProgress = Math.abs(containerRect.top) / totalScrollHeight;
    displayFrameByScroll(scrollProgress);
  }
})

/* 
How it works:
- The scrollContainer is a long element.
- Inside the scrollContainer, there's a sticky-frame-container, which will hold the images.
- As the user scrolls down through the scrollContainer, the sticky-frame-container remains fixed (sticky), filling the entire screen, while the displayed frame is updated based on the user's scroll position.
- The scrollProgress determines which frame is shown: at the top of the scroll, the first frame is shown, and at the bottom, the last frame is displayed, creating a smooth scroll-based animation.
*/

document.addEventListener('DOMContentLoaded', () => {
  const skipButton = document.getElementById('skip-animation');

  // Function to smooth scroll down to the bottom of the page quickly
  function smoothScrollToBottom() {
    const totalScrollHeight = document.body.scrollHeight; // Full height of the page
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth' // Enable smooth scrolling
    });
  }
  
  // Listen for the click event on the skip button
  skipButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    smoothScrollToBottom(); // Scroll to the bottom smoothly
  });
});

// Optionally, to speed up the animation frame rate while scrolling:
window.addEventListener('scroll', () => {
  const containerRect = scrollContainer.getBoundingClientRect();
  const totalScrollHeight = scrollContainer.scrollHeight - window.innerHeight;
  
  if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
    const scrollProgress = Math.abs(containerRect.top) / totalScrollHeight;
    displayFrameByScroll(scrollProgress);
  }
});
