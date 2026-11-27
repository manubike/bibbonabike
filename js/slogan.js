// ====== SLOGAN ROTANTI IN TESTATA ======
const slogans = [
  "Pedala la libertà tra i sentieri toscani",
  "Scopri la Toscana. Una pedalata alla volta.",
  "Dove finisce l’asfalto, inizia l’avventura",
  "Bike. Relax. Officina. Tutto in un solo posto.",
  "Magona Bike Garage: la tua sella in Toscana",
  "Bibbona su due ruote, 24 ore su 24"
];

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("slideshow-title");
  let index = 0;

  if (title) {
    title.classList.add("visible");
    setInterval(() => {
      title.classList.remove("visible");
      setTimeout(() => {
        index = (index + 1) % slogans.length;
        title.textContent = slogans[index];
        title.classList.add("visible");
      }, 500);
    }, 4000);
  }

  // ====== FRASELLINE IN FONDO ALLA PAGINA (CREDITI) ======
  const phrases = [
    "Chi siamo?",
    "Appassionati di bici, natura e avventura.",
    "Magona Bike Garage è più di un'officina.",
    "È un punto di ritrovo per chi ama pedalare tra i paesaggi toscani."
  ];

  const container = document.getElementById("footerCredits");
  if (container) {
    phrases.forEach((text, i) => {
      const p = document.createElement("p");
      p.textContent = text;
      p.style.animationDelay = `${i * 2}s`;
      container.appendChild(p);
    });
  }
});
