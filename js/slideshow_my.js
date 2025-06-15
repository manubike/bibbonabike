document.addEventListener("DOMContentLoaded", () => {
  const photos = [
    { src: "img/land1.jpg", alt: "Sentiero vista panoramica verso il mare", caption: "Tour Etrusco – Livello facile" },
    { src: "img/land2.jpg", alt: "Grotte etrusche", caption: "Grotte scavate nel tufo – Tour Etrusco" },
    { src: "img/land3.jpg", alt: "Panorama dalla vetta", caption: "Vista mare tra boschi e vallate" },
    { src: "img/land4.jpg", alt: "Cascata", caption: "Sosta alla cascata naturale – Bagno rinfrescante" },
    { src: "img/land5.jpg", alt: "My legs are my brakes, My legs are my gears", caption: "My legs are my brakes, My legs are my gears" },
    { src: "img/land6.png", alt: "Team BibbonaBike Garage", caption: "La nostra crew!" }
  ];

  const gallery = document.getElementById("photoGallery");

  // Popola la galleria dinamicamente
  gallery.innerHTML = photos.map((p, i) =>
    `<a href="${p.src}" class="go_gridItem" data-index="${i}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy">
        <span class="go_caption go_caption-full">${p.caption}</span>
    </a>`
  ).join("");

  // Configura SSG
  if (window.SSG) {
    SSG.cfg.theme = 'light';
    SSG.cfg.scrollDuration = 500;
    SSG.cfg.alwaysFullscreen = false;
    SSG.cfg.neverFullscreen = false;
    SSG.cfg.mobilePortraitFS = false;
    SSG.cfg.forceLandscapeMode = false;
    SSG.cfg.crossCursor = false;
    SSG.cfg.autorun = false;
    SSG.cfg.noautostart = true;

    // Watermark
    SSG.cfg.watermarkImage = 'img/icon_ai.png';
    SSG.cfg.watermarkText =  "BibbonaBike" ;  //  watermark text, use <br> tag for word wrap
    SSG.cfg.watermarkFontSize =  10 ; // font size in pixels  
    SSG.cfg.watermarkWidth = 100;
    SSG.cfg.watermarkOffsetX = 2;
    SSG.cfg.watermarkOffsetY = 2;
    SSG.cfg.watermarkOpacity = 0.45;

    // Layout
    SSG.cfg.fontSize = 100;
    SSG.cfg.bgOpacity = 100;
    SSG.cfg.rightClickProtection = true;
    SSG.cfg.imgBorderShadow = true;
    SSG.cfg.sharpenEnlargedImg = true;
    SSG.cfg.scaleLock1 = true;

    // Caption e autore
    SSG.cfg.hideImgCaptions = false;
    SSG.cfg.captionExif = 'none';
    SSG.cfg.preferedCaptionLocation = 3;
    SSG.cfg.sideCaptionforSmallerLandscapeImg = false;
    SSG.cfg.globalAuthorCaption = '<span style="color:green"> @ BibbonaBike</span>';

    // UX Mobile
    SSG.cfg.showLandscapeHint = true;
    SSG.cfg.landscapeHint = '<i>↻</i> Ruota il telefono per vedere meglio <span>📱</span>';

    // Traduzioni UI
    SSG.cfg.hint1 = "Naviga nella galleria con:";
    SSG.cfg.hint2 = "rotella del mouse <strong>⊚</strong> o frecce <strong>↓→↑←</strong>";
    SSG.cfg.hint3 = "oppure <strong>TOCCA</strong> in basso o in alto";
    SSG.cfg.hintTouch = "<strong>TOCCA</strong> in basso o in alto<br> per scorrere la galleria";
    SSG.cfg.hintFS = "Per un'esperienza migliore <br><a><abbr>⎚</abbr> attiva lo schermo intero</a>";
    SSG.cfg.toTheTop = "Torna all'inizio";
    SSG.cfg.exitLink = "Esci dalla galleria";
    SSG.cfg.imageLink = "Link all'immagine selezionata:";
    SSG.cfg.copyButton = "⎘ Copia il link";
    SSG.cfg.linkPaste = "…puoi incollarlo ovunque con ctrl+v";
    SSG.cfg.fileToLoad = null;
  }

  // Avvio SSG solo su click
  gallery.addEventListener("click", e => {
    const anchor = e.target.closest("a");
    if (!anchor || !gallery.contains(anchor)) return;
    e.preventDefault();

    const index = Number(anchor.dataset.index);
    if (!isNaN(index)) {
      SSG.run({
        images: photos,
        startIndex: index
      });
    }
  });

  // Bottone "Griglia / Flusso Libero"
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

  // 🔧 Fix warning: "key '' is not recognized"
  document.addEventListener("keydown", e => {
    if (!e.key || e.key === "") {
      e.preventDefault();
    }
  });
});
