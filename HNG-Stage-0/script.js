//Display current time in milliseconds
document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.querySelector('[data-testid="test-user-time"]');
  const timeButton = document.querySelector('[data-testid="time-btn"]');

  const updateTime = () => {
    const currentTime = Date.now();
    timeDisplay.innerHTML = `<span class="time-label">Time:</span> ${currentTime}`;
  };

  // Initialize immediately
  updateTime();

  // Update on button click
  timeButton.addEventListener("click", updateTime);
});