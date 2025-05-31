function showTourMessage(message, duration = 3000) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#2b2";
  msg.style.color = "#fff";
  msg.style.padding = "12px 20px";
  msg.style.borderRadius = "8px";
  msg.style.fontWeight = "bold";
  msg.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  msg.style.zIndex = "9999";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), duration);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("noleggioForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const msg = document.getElementById("responseMessage");
      msg.textContent = "⛔ Le prenotazioni saranno disponibili da luglio.";
      msg.style.color = "red";

      showTourMessage("⛔ Prenotazioni disponibili da luglio!", 4000);

      // Blocca invio reale
      return;
    });
  }
});
