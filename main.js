let startFrame = 40;
const totalFrames = 160;  // Total number of PNG frames
const frames = [];

// Preload images
for (let i = startFrame; i <= totalFrames; i++) {
  const img = new Image();
  img.src = `Outputs/${String(i).padStart(4, '0')}.png`;
  frames.push(img);
}

// Set up scroll-based animation
const scrollContainer = document.querySelector('.scroll-container');
const animationContainer = document.getElementById('animation-container');

// Function to display frame based on scroll progress
function displayFrameByScroll(scrollProgress) { 
  // Calculate the current frame based on scroll progress
  let currentFrame = Math.min(Math.floor(scrollProgress * (totalFrames - startFrame + 1)), totalFrames - startFrame);
  
  // Clear the previous frame and display the new one
  animationContainer.innerHTML = '<a href="#" id="skip-animation" class="skip-animation">Skip the Animation</a>'; 
  animationContainer.appendChild(frames[currentFrame]);  // Show the current frame
}

// DOM fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initially display the first frame
  animationContainer.appendChild(frames[0]);

  // Smooth scroll to the bottom when "Skip the Animation" is clicked
  skipButton.addEventListener('click', (e) => {
    e.preventDefault();
    const totalScrollHeight = document.body.scrollHeight;
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth'  // Enable smooth scrolling to the bottom
    });
  });
});

// Listen to scroll event and update animation frames
window.addEventListener('scroll', () => {
  const containerRect = scrollContainer.getBoundingClientRect(); // Get the top and bottom coordinates
  const totalScrollHeight = scrollContainer.scrollHeight - window.innerHeight; // Dynamic calculation of the scrollable part of the animation

  if (containerRect.top <= 0 && containerRect.bottom >= window.innerHeight) {
    const scrollProgress = Math.abs(containerRect.top) / totalScrollHeight;
    displayFrameByScroll(scrollProgress);  // Display the corresponding frame based on scroll position
  }
});

/* 
How it works:
- The scrollContainer is a long element.
- Inside the scrollContainer, there's a sticky-frame-container, which will hold the images.
- As the user scrolls down through the scrollContainer, the sticky-frame-container remains fixed (sticky), filling the entire screen, while the displayed frame is updated based on the user's scroll position.
- The scrollProgress determines which frame is shown: at the top of the scroll, the first frame is shown, and at the bottom, the last frame is displayed, creating a smooth scroll-based animation.
*/