//Display current time in milliseconds with continuous updates
document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.querySelector('[data-testid="test-user-time"]');
  
  const updateTime = () => {
    const currentTime = Date.now();
    timeDisplay.textContent = `${currentTime} ms`;
    
    // Add subtle animation on update
    timeDisplay.classList.add('updating');
    setTimeout(() => {
      timeDisplay.classList.remove('updating');
    }, 1000);
  };
  updateTime();

  // Updates continuously every 100ms for smooth real-time feel
  setInterval(updateTime, 100);
});