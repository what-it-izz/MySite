// Function to generate random positions and animations for stars
function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
  
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
  
    // Random animation duration
    const duration = Math.random() * 2 + 1;
  
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDuration = `${duration}s`;
  
    document.body.appendChild(star);
  };


// Initialize stars
const numStars = 200;
for (let i = 0; i < numStars; i++) {
  createStar();
}
window.addEventListener('resize', () => {
  document.querySelectorAll('.star').forEach(star => star.remove());
  for (let i = 0; i < numStars; i++) {
    createStar();
  }
});