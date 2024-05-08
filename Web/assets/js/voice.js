const button = document.querySelector(".voice-button");
const message = new SpeechSynthesisUtterance();

button.addEventListener("click", () => {
  console.log(message);
});
