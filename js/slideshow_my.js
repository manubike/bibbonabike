let galleriaCorrente = []; // ← memorizza le immagini correnti dinamicamente

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("photoGallery");
  if (!gallery) return;

  galleriaCorrente = [
    { src: "img/land1.jpg", alt: "Sentiero vista panoramica verso il mare", caption: "Tour Etrusco – Livello facile" },
    { src: "img/land2.jpg", alt: "Grotte etrusche", caption: "Grotte scavate nel tufo – Tour Etrusco" },
    { src: "img/land3.jpg", alt: "Panorama dalla vetta", caption: "Vista mare tra boschi e vallate" },
    { src: "img/land4.jpg", alt: "Cascata", caption: "Sosta alla cascata naturale – Bagno rinfrescante" },
    { src: "img/land5.jpg", alt: "My legs are my brakes, My legs are my gears", caption: "My legs are my brakes, My legs are my gears" },
    { src: "img/land6.png", alt: "Team BibbonaBike Garage", caption: "La nostra crew!" }
  ];

  renderGallery(gallery, galleriaCorrente);

  // Configura SSG
  if (window.SSG) {
    Object.assign(SSG.cfg, {
      theme: 'light',
      scrollDuration: 500,
      alwaysFullscreen: false,
      neverFullscreen: false,
      mobilePortraitFS: false,
      forceLandscapeMode: false,
      crossCursor: false,
      autorun: false,
      noautostart: true,
      watermarkImage: 'img/icon_ai.png',
      watermarkText: "BibbonaBike",
      watermarkFontSize: 10,
      watermarkWidth: 100,
      watermarkOffsetX: 2,
      watermarkOffsetY: 2,
      watermarkOpacity: 0.45,
      fontSize: 100,
      bgOpacity: 100,
      rightClickProtection: true,
      imgBorderShadow: true,
      sharpenEnlargedImg: true,
      scaleLock1: true,
      hideImgCaptions: false,
      captionExif: 'none',
      preferedCaptionLocation: 3,
      sideCaptionforSmallerLandscapeImg: false,
      globalAuthorCaption: '<span style="color:green"> @ BibbonaBike</span>',
      showLandscapeHint: true,
      landscapeHint: '<i>↻</i> Ruota il telefono per vedere meglio <span>📱</span>',
      hint1: "Naviga nella galleria con:",
      hint2: "rotella del mouse <strong>⊚</strong> o frecce <strong>↓→↑←</strong>",
      hint3: "oppure <strong>TOCCA</strong> in basso o in alto",
      hintTouch: "<strong>TOCCA</strong> in basso o in alto<br> per scorrere la galleria",
      hintFS: "Per un'esperienza migliore <br><a><abbr>⎚</abbr> attiva lo schermo intero</a>",
      toTheTop: "Torna all'inizio",
      exitLink: "Esci dalla galleria",
      imageLink: "Link all'immagine selezionata:",
      copyButton: "⎘ Copia il link",
      linkPaste: "…puoi incollarlo ovunque con ctrl+v",
      fileToLoad: "ssg-loaded.html"
    });
  }

  // Click generico sulla galleria → usa immagini correnti
  gallery.addEventListener("click", e => {
    const anchor = e.target.closest("a");
    if (!anchor || !gallery.contains(anchor)) return;
    e.preventDefault();

    const index = Number(anchor.dataset.index);
    if (!isNaN(index)) {
      SSG.run({
        images: galleriaCorrente,
        startIndex: index
      });
    }
  });

  // Toggle layout
  const toggleBtn = document.getElementById("toggleLayout");
  toggleBtn?.addEventListener("click", () => {
    const isActive = gallery.classList.toggle("go-masonry");
    toggleBtn.classList.toggle("active", isActive);
    toggleBtn.setAttribute("aria-pressed", isActive);

    const label = toggleBtn.querySelector(".label");
    if (label) label.textContent = isActive ? "Libero" : "Griglia";

    const icon = toggleBtn.querySelector("i");
    if (icon) icon.className = isActive ? "fas fa-border-all" : "fas fa-th";
  });

  // Fix warning: key ""
  document.addEventListener("keydown", e => {
    if (!e.key || e.key === "") e.preventDefault();
  });
});

// 🔁 Funzione generica per popolare la galleria
function renderGallery(container, photos) {
  container.innerHTML = photos.map((p, i) =>
    `<a href="${p.src}" class="go_gridItem" data-index="${i}">
      <img src="${p.src}" alt="${p.alt}" loading="lazy">
      <span class="go_caption go_caption-full">${p.caption}</span>
    </a>`
  ).join("");
}

// ✅ Esempio: carica nuova galleria
function caricaGalleriaCollinare() {
  galleriaCorrente = [
    { src: "img/tour2-1.jpg", alt: "Salita tra colline", caption: "Vista sulla Val di Cecina" },
    { src: "img/tour2-2.jpg", alt: "Strade bianche", caption: "Tra vigneti e oliveti" }
  ];
  SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true });
}
