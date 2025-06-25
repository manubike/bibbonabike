// Definisci tutti i set di immagini per le tue gallerie
// È buona pratica averli qui, chiari e separati.
const galleriaPrincipaleImmagini = [
    { src: "img/land1.webp", alt: "Sentiero vista panoramica verso il mare", caption: "Tour Etrusco – Livello facile" },
    { src: "img/land2.webp", alt: "Grotte etrusche", caption: "Grotte scavate nel tufo – Tour Etrusco" },
    { src: "img/land3.webp", alt: "Panorama dalla vetta", caption: "Vista mare tra boschi e vallate" },
    { src: "img/land4.webp", alt: "Cascata", caption: "Sosta alla cascata naturale – Bagno rinfrescante" },
    { src: "img/land5.webp", alt: "Street Art", caption: "My legs are my brakes, My legs are my gears" },
    { src: "img/land6.webp", alt: "Panoramica", caption: "Lorenzana on Bikes" },
    { src: "img/land7.webp", alt: "Team BibbonaBike Garage", caption: "La nostra crew!" }
];

const galleriaCollinareImmagini = [
    { src: "img/tour2-1.webp", alt: "Salita tra colline", caption: "Vista sulla Val di Cecina" },
    { src: "img/tour2-2.webp", alt: "Strade bianche", caption: "Tra vigneti e oliveti" },
    { src: "img/tour2-3.jpeg", alt: "Bibbona Kids", caption: "Tra vigneti e oliveti" }

];

const galleriaPinetaImmagini = [
    { src: "img/tour1-1.webp", alt: "Ciclisti nella pineta", caption: "Tour Pineta & Costa - Vista 1" },
    { src: "img/tour1-2.webp", alt: "Spiaggia e mare con biciclette", caption: "Tour Pineta & Costa - Vista 2" }
];

const galleriaSunsetImmagini = [
    { src: "img/tour3-1.webp", alt: "Tramonto sulla campagna toscana", caption: "Sunset & Aperitivo - Immagine 1" },
    { src: "img/tour3-2.webp", alt: "Aperitivo dopo il tour", caption: "Sunset & Aperitivo - Immagine 2" }
];

const galleriaRelaxImmagini = [
    { src: "img/tour4-1.webp", alt: "Ciclisti in un'area relax", caption: "Relax Day - Caselli - Immagine 1" },
    { src: "img/tour4-2.webp", alt: "Paesaggio rilassante con biciclette", caption: "Relax Day - Caselli - Immagine 2" }
];

// Mappa i nomi delle gallerie alle loro funzioni di caricamento
const galleryLoaders = {
    "principale": caricaGalleriaPrincipale, // Aggiunto per coerenza
    "pineta": caricaGalleriaPineta,
    "collinare": caricaGalleriaCollinare,
    "sunset": caricaGalleriaSunset,
    "relax": caricaGalleriaRelax
};


let galleriaCorrente = []; // Variabile per tracciare il set di immagini attualmente caricato
const gallery = document.getElementById("photoGallery"); // Riferimento all'elemento della galleria
const backToMainGalleryBtn = document.getElementById("backToMainGalleryBtn"); // Riferimento al bottone "Torna alla Galleria Principale"


// Funzione helper per aggiornare la visibilità del bottone "Torna alla Galleria Principale"
function updateBackButtonVisibility() {
    // Il confronto JSON.stringify è un modo semplice per confrontare array di oggetti
    // Se la galleria corrente non è la galleria principale, mostra il bottone
    if (JSON.stringify(galleriaCorrente) !== JSON.stringify(galleriaPrincipaleImmagini)) {
        if (backToMainGalleryBtn) {
            backToMainGalleryBtn.style.display = 'inline-block'; // O 'block', 'flex' a seconda del tuo CSS
        }
    } else {
        if (backToMainGalleryBtn) {
            backToMainGalleryBtn.style.display = 'none';
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    if (!gallery) {
        console.warn("Elemento #photoGallery non trovato. La galleria non sarà inizializzata.");
        return;
    }

    // Collega l'event listener al bottone "Torna alla Galleria Principale"
    if (backToMainGalleryBtn) {
        backToMainGalleryBtn.addEventListener("click", () => {
            tornaAllaGalleriaPrincipale();
        });
    }

    // Inizializza la galleria con le immagini principali all'avvio
    galleriaCorrente = [...galleriaPrincipaleImmagini]; 
    renderGallery(gallery, galleriaCorrente);
    updateBackButtonVisibility(); // Aggiorna la visibilità del bottone all'inizio


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
            imageLink: "Link all'immagine selezionata:",
            copyButton: "⎘ Copia il link",
            linkPaste: "…puoi incollarlo ovunque con ctrl+v",
            // *** PUNTO CRUCIALE PER LA DOCUMENTAZIONE UFFICIALE ***
            fileToLoad: "ssg-loaded.html", // Assicurati che questo sia il percorso corretto al tuo file
            // Aggiungi un link di uscita per tornare alla galleria principale
            exitLink: "Esci dalla galleria <a onclick='tornaAllaGalleriaPrincipale();' style='cursor:pointer; color:#71a7b7;'>Torna alla galleria principale</a>"
        });
    }

    // Gestione del click sulla galleria per avviare SSG (funziona con la galleriaCorrente)
    gallery.addEventListener("click", e => {
        const anchor = e.target.closest("a");
        if (!anchor || !gallery.contains(anchor)) return;
        e.preventDefault();

        const index = Number(anchor.dataset.index);
        if (!isNaN(index)) {
            SSG.run({
                images: galleriaCorrente, // SSG userà sempre l'array di immagini attualmente in galleriaCorrente
                startIndex: index
            });
        }
    });

    // NUOVO: Gestore eventi tramite Event Delegation per i link in ssg-loaded.html
    // Ascolta i clic su tutto il body per intercettare i clic sui link caricati dinamicamente
    document.body.addEventListener("click", e => {
      const link = e.target.closest("#SSG_lastone .SSG_icell a"); 
      if (link) {
        const galleryType = link.dataset.gallery;
        if (galleryType && galleryLoaders[galleryType]) {
          e.preventDefault();
          if (window.SSG && SSG.isOpen) SSG.hide();

          // Forza lo scroll in alto e reset della galleria
          setTimeout(() => {
            window.scrollTo(0, gallery.offsetTop - 100);
            galleryLoaders[galleryType]();
          }, 400);
        }
      }
    });


    // Toggle layout della griglia (esistente)
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

    // Fix warning: key "" (esistente e corretto)
    document.addEventListener("keydown", e => {
        if (!e.key || e.key === "") e.preventDefault();
    });
});


// ---
// 🔁 Funzione generica per popolare la griglia delle miniature (rimane invariata)
// ---
function renderGallery(container, photos) {
    container.innerHTML = photos.map((p, i) =>
        `<a href="${p.src}" class="go_gridItem" data-index="${i}">
            <img src="${p.src}" alt="${p.alt}" loading="lazy">
            <span class="go_caption go_caption-full">${p.caption}</span>
        </a>`
    ).join("");
}

// ---
// ✅ Funzioni per caricare le diverse gallerie e aggiornare SSG
// ---

/**
 * Carica e visualizza la galleria principale.
 */
function caricaGalleriaPrincipale() {
    galleriaCorrente = [...galleriaPrincipaleImmagini]; // Aggiorna l'array corrente
    renderGallery(gallery, galleriaCorrente); // Aggiorna la visualizzazione a griglia
    SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true }); // Riavvia SSG
    updateBackButtonVisibility(); // Aggiorna la visibilità del bottone
}

/**
 * Carica e visualizza la galleria "Avventura Collinare".
 */
function caricaGalleriaCollinare() {
    galleriaCorrente = [...galleriaCollinareImmagini]; 
    renderGallery(gallery, galleriaCorrente); 
    SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true });
    updateBackButtonVisibility();
}

/**
 * Carica e visualizza la galleria "Tour Pineta & Costa".
 */
function caricaGalleriaPineta() {
    galleriaCorrente = [...galleriaPinetaImmagini]; 
    renderGallery(gallery, galleriaCorrente); 
    SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true });
    updateBackButtonVisibility();
}

/**
 * Carica e visualizza la galleria "Sunset & Aperitivo".
 */
function caricaGalleriaSunset() {
    galleriaCorrente = [...galleriaSunsetImmagini]; 
    renderGallery(gallery, galleriaCorrente); 
    SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true });
    updateBackButtonVisibility();
}

/**
 * Carica e visualizza la galleria "Relax Day - Caselli".
 */
function caricaGalleriaRelax() {
    galleriaCorrente = [...galleriaRelaxImmagini]; 
    renderGallery(gallery, galleriaCorrente); 
    SSG.restart({ images: galleriaCorrente, startIndex: 0, fs: true });
    updateBackButtonVisibility();
}

/**
 * Funzione per tornare alla galleria principale.
 * Chiusa la lightbox SSG e ricarica la galleria principale.
 */
function tornaAllaGalleriaPrincipale() {
    if (window.SSG && SSG.isOpen) {
        SSG.hide();
    }
    // Piccolo ritardo per consentire la chiusura fluida di SSG
    setTimeout(() => {
        caricaGalleriaPrincipale(); // Questa funzione imposta galleriaCorrente e ri-renderizza
    }, 300); 
}