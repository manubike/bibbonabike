document.addEventListener("DOMContentLoaded", () => {
  const phone = "+393313453207";
  const address = "Via del Mandorlo 1, Bibbona, Livorno";
  const coords = "43.2662098,10.594119";

  const phoneLinkElement = document.getElementById("phoneLink");
  const whatsappLinkElement = document.getElementById("whatsappLink");
  const mapLinkElement = document.getElementById("mapLink");

  if (!phoneLinkElement || !whatsappLinkElement || !mapLinkElement) {
    console.warn("Elementi di contatto mancanti (#phoneLink, #whatsappLink o #mapLink).");
    return;
  }

  const callBtn = document.createElement("a");
  callBtn.href = `tel:${phone}`;
  callBtn.className = "btn-primary";
  callBtn.innerHTML = `<i class="fas fa-phone"></i> Chiama`;

  const waBtn = document.createElement("a");
  waBtn.href = `https://wa.me/${phone.replace("+", "")}`;
  waBtn.target = "_blank";
  waBtn.rel = "noopener noreferrer";
  waBtn.className = "btn-primary";
  waBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Chat su WhatsApp`;

  const mapBtn = document.createElement("a");
  mapBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords)}`;
  mapBtn.target = "_blank";
  mapBtn.rel = "noopener noreferrer";
  mapBtn.className = "btn-primary";
  mapBtn.title = address;
  mapBtn.setAttribute("aria-label", `Indicazioni: ${address}`);
  mapBtn.innerHTML = `<i class="fas fa-map-marker-alt"></i> Indicazioni · ${address}`;

  phoneLinkElement.appendChild(callBtn);
  whatsappLinkElement.appendChild(waBtn);
  mapLinkElement.appendChild(mapBtn);
});
