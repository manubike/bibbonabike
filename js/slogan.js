    const slogans = [
      "Pedala la libertà tra i sentieri toscani",
      "Scopri la Toscana. Una pedalata alla volta.",
      "Dove finisce l’asfalto, inizia l’avventura",
      "Bike. Relax. Officina. Tutto in un solo posto.",
      "Magona Bike Garage: la tua sella in Toscana",
      "Bibbona su due ruote, 24 ore su 24"
    ];
  
    const title = document.getElementById("slideshow-title");
    let index = 0;
  
    function showNextSlogan() {
      title.classList.remove("visible");
      setTimeout(() => {
        index = (index + 1) % slogans.length;
        title.textContent = slogans[index];
        title.classList.add("visible");
      }, 500);
    }
  
    title.classList.add("visible");
    setInterval(showNextSlogan, 4000);

      const phrases = [
        "Chi siamo?",
        "Appassionati di bici, natura e avventura.",
        "Magona Bike Garage è più di un'officina.",
        "È un punto di ritrovo per chi ama pedalare tra i paesaggi toscani."
    ];

    const container = document.getElementById("footerCredits");

    phrases.forEach((text, i) => {
        const p = document.createElement("p");
        p.textContent = text;
        p.style.animationDelay = `${i * 2}s`;
        container.appendChild(p);
    });

    