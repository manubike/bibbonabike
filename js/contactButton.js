document.addEventListener("DOMContentLoaded", () => {
  const phone = "+393313453207";

  const phoneLinkElement = document.getElementById("phoneLink");
  const whatsappLinkElement = document.getElementById("whatsappLink");

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

    phoneLinkElement.appendChild(callBtn);
    whatsappLinkElement.appendChild(waBtn);
  } else {
    console.warn("Elementi 'phoneLink' o 'whatsappLink' non trovati. I bottoni di contatto non saranno creati.");
  }
});