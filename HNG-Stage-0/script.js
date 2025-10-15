document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.querySelector("[data-test-id='contact-btn']");
  
  contactBtn.addEventListener("click", () => {
    alert("Yes! Stage 0 Task Complete😊 !");
  });
});
