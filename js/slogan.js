// ====== SLOGAN ROTANTI IN TESTATA ======

// Questi son 'i motti, 'e frasi fatte che scorrono su in cima, per far sognà la gente
const slogans = [
  "Pedala la libertà tra i sentieri toscani",          // come dire: 'un po’ d’ossigeno e via'
  "Scopri la Toscana. Una pedalata alla volta.",        // piano ma si va lontano
  "Dove finisce l’asfalto, inizia l’avventura",         // chi va in bici lo sa: l’asfalto è solo l’inizio
  "Bike. Relax. Officina. Tutto in un solo posto.",     // insomma, manca solo 'na braciata
  "Magona Bike Garage: la tua sella in Toscana",        // slogan serio, da cartellone
  "Bibbona su due ruote, 24 ore su 24"                  // perché dormire è per i deboli
];

// Prende il titolo grosso dove appariranno i motti
const title = document.getElementById("slideshow-title");
let index = 0;

// Questa funzione cambia 'i slogan ogni tot secondi
function showNextSlogan() {
  title.classList.remove("visible"); // lo leva di vista pe' fa' l'effetto dissolvenza
  setTimeout(() => {
    index = (index + 1) % slogans.length; // passa al prossimo, e ricomincia quando finisce
    title.textContent = slogans[index];   // cambia proprio il testo nel DOM
    title.classList.add("visible");       // riappare bello bello
  }, 500);
}

// Mostra il primo slogan appena carica la pagina
title.classList.add("visible");
// E ogni 4 secondi cambia frase, finché 'un si stanca il browser
setInterval(showNextSlogan, 4000);

// ====== FRASELLINE IN FONDO ALLA PAGINA (CREDITI) ======

// Frasi sentimentali da mettere giù in fondo, tipo 'chi siamo', ma senza esagerà
const phrases = [
  "Chi siamo?", // domanda retorica, giusto pe' partire
  "Appassionati di bici, natura e avventura.",
  "Magona Bike Garage è più di un'officina.",  // un po' di poesia
  "È un punto di ritrovo per chi ama pedalare tra i paesaggi toscani." // qui ci scappa la lacrimuccia
];

// Prende il contenitore del footer dove buttarci le frasi
const container = document.getElementById("footerCredits");

// Per ogni frase, la crea e la spara nel DOM con un ritardo animato, così appaiono una dopo l’altra
phrases.forEach((text, i) => {
  const p = document.createElement("p");             // crea un paragrafo
  p.textContent = text;                              // ci mette la frase dentro
  p.style.animationDelay = `${i * 2}s`;              // ritarda ogni frase un po’ di più, a effetto cascata
  container.appendChild(p);                          // la attacca giù nel footer
});
