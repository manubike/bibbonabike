document.addEventListener("DOMContentLoaded", () => {
  const phone = "+393313453207";
  const address = "Via del Mandorlo, 1, 57020 Bibbona LI"; // INDIRIZZO

  const phoneLinkElement = document.getElementById("phoneLink");
  const whatsappLinkElement = document.getElementById("whatsappLink");
  const mapLinkElement = document.getElementById("mapLink"); 
  // Controlla se gli elementi target esistono
  if (phoneLinkElement && whatsappLinkElement) {
    const callBtn = document.createElement("a");
    callBtn.href = `tel:${phone}`;
    callBtn.className = "btn-primary"; // O la classe CSS che usi per i bottoni
    callBtn.innerHTML = `<i class="fas fa-phone"></i> Chiama`; // Assicurati di avere Font Awesome o icona locale

    const waBtn = document.createElement("a");
    waBtn.href = `https://wa.me/${phone.replace("+", "")}`;
    waBtn.target = "_blank";
    waBtn.className = "btn-primary"; // O la classe CSS che usi per i bottoni
    waBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Chat su WhatsApp`; // Assicurati di avere Font Awesome o icona locale
    const mapBtn = document.createElement("a");
    // L'URL di Google Maps per le direzioni
    // 'q=' per una query generica o 'daddr=' per la destinazione se hai anche un punto di partenza
    mapBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    mapBtn.target = "_blank"; // Apre in una nuova scheda/finestra
    mapBtn.className = "btn-primary";
    mapBtn.innerHTML = `<i class="fas fa-map-marker-alt"></i> Indicazioni`; // Icona e testo per le direzioni

    phoneLinkElement.appendChild(callBtn);
    whatsappLinkElement.appendChild(waBtn);
    mapLinkElement.appendChild(mapBtn); 
  } else {
    console.warn("Elementi 'phoneLink' o 'whatsappLink' non trovati. I bottoni di contatto non saranno creati.");
  }
});