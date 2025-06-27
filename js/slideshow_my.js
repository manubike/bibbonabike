// slideshow_my.js

// ============================================================================
// DEFINIZIONI DI GALLERIE E DATI (DEVONO ESSERE GLOBALI)
// **IMPORTANTE**: Assicurati che i percorsi delle immagini siano corretti.
// ============================================================================

const galleriaPrincipaleImmagini = [
    { href: "https://bibbonabike.com/img/land1.webp", alt: "Tour Etrusco – Livello facile: Sentiero vista panoramica verso il mare" },
    { href: "https://bibbonabike.com/img/land2.webp", alt: "Tour Etrusco: Grotte scavate nel tufo – Tour Etrusco" },
    { href: "https://bibbonabike.com/img/land3.webp", alt: "Panorama dalla vetta: Vista mare tra boschi e vallate" },
    { href: "https://bibbonabike.com/img/land4.webp", alt: "Cascata: Sosta alla cascata naturale – Bagno rinfrescante" },
    { href: "https://bibbonabike.com/img/land5.webp", alt: "Street Art: My legs are my brakes, My legs are my gears" },
    { href: "https://bibbonabike.com/img/land6.webp", alt: "Panoramica: Lorenzana on Bikes" },
    { href: "https://bibbonabike.com/img/land7.webp", alt: "Team BibbonaBike Garage: La nostra crew!" }
];

const galleriaCollinareImmagini = [
    { href: "https://bibbonabike.com/img/tour2-1.webp", alt: "Vista sulla Val di Cecina: Salita tra colline" },
    { href: "https://bibbonabike.com/img/tour2-2.webp", alt: "Tra vigneti e oliveti: Strade bianche" },
    { href: "https://bibbonabike.com/img/tour2-3.jpeg", alt: "Tra vigneti e oliveti: Bibbona Kids" }
];

const galleriaPinetaImmagini = [
    { href: "https://bibbonabike.com/img/tour1-1.webp", alt: "Tour Pineta & Costa - Vista 1: Ciclisti nella pineta" },
    { href: "https://bibbonabike.com/img/tour1-2.webp", alt: "Tour Pineta & Costa - Vista 2: Spiaggia e mare con biciclette" },
    { href: "https://bibbonabike.com/img/tour1-3.webp", alt: "Tour Pineta & Costa - Vista 3: Ciclisti sulla spiaggia" }
];

const galleriaSunsetImmagini = [
    { href: "https://bibbonabike.com/img/tour3-1.webp", alt: "Sunset & Aperitivo - Immagine 1: Tramonto sulla campagna toscana" },
    { href: "https://bibbonabike.com/img/tour3-2.webp", alt: "Sunset & Aperitivo - Immagine 2: Aperitivo dopo il tour" },
    { href: "https://bibbonabike.com/img/tour3-3.webp", alt: "Sunset & Aperitivo - Immagine 3: Aperitivo dopo il tour" }
];

const galleriaRelaxImmagini = [
    { href: "https://bibbonabike.com/img/tour4-1.webp", alt: "Relax Day - Caselli - Immagine 1: Ciclisti in un'area relax" },
    { href: "https://bibbonabike.com/img/tour4-2.webp", alt: "Relax Day - Caselli - Immagine 2: Paesaggio rilassante con biciclette" },
    { href: "https://bibbonabike.com/img/tour4-3.webp", alt: "Relax Day - Caselli - Immagine 3: Paesaggio rilassante con biciclette" }
];

// Mappa tutti i set di immagini per un facile accesso dinamico
const allGalleriesData = {
    "principale": galleriaPrincipaleImmagini,
    "pineta": galleriaPinetaImmagini,
    "collinare": galleriaCollinareImmagini,
    "sunset": galleriaSunsetImmagini,
    "relax": galleriaRelaxImmagini
};

// Dichiarazione delle variabili DOM e di stato (DEVONO ESSERE GLOBALI)
let galleriaCorrente = []; // Variabile per tracciare il set di immagini attualmente caricato
let galleryElement; // Elemento DOM per la griglia delle miniature

// Variabili per il cambio tema
const themes = ['light', 'dark', 'dim', 'black'];
let currentThemeIndex = 0; // Inizia dal tema 'light' (indice 0)

// Mappa per i colori dei pulsanti del tema
const themeButtonColors = {
    'light': { bgColor: '#e0e0e0', textColor: '#333333' }, // Grigio chiaro per sfondo, testo scuro
    'dark': { bgColor: '#333333', textColor: '#ffffff' }, // Grigio scuro per sfondo, testo chiaro
    'dim': { bgColor: '#606060', textColor: '#ffffff' },  // Grigio medio scuro, testo chiaro
    'black': { bgColor: '#000000', textColor: '#ffffff' }  // Nero, testo chiaro
};

// ============================================================================
// FUNZIONI HELPER E DI LOGICA
// ============================================================================

/**
 * Funzione generica per popolare la griglia delle miniature.
 * Utilizza la nuova struttura { href, alt }.
 * @param {HTMLElement} container - L'elemento DOM che conterrà le miniature.
 * @param {Array<Object>} photos - L'array di oggetti immagine.
 */
function renderGallery(container, photos) {
    if (!container) {
        console.error("renderGallery: Container per la galleria non trovato.");
        return;
    }
    container.innerHTML = photos.map((p, i) =>
        `<a href="${p.href}" class="go_gridItem" data-index="${i}">
            <img src="${p.href}" alt="${p.alt}" loading="lazy" width="300" height="200">
            <span class="go_caption go_caption-full">${p.alt}</span>
        </a>`
    ).join("");
}

/**
 * Controlla se la lightbox SSG è attualmente aperta.
 * Si basa sulla classe 'ssg-active' aggiunta al body da SSG.
 * @returns {boolean} True se la lightbox è aperta, false altrimenti.
 */
function isSsgLightboxOpen() {
    const ssgOpenClass = 'ssg-active';
    return document.body.classList.contains(ssgOpenClass);
}

/**
 * Funzione per aggiornare il colore del pulsante del tema in base al tema corrente.
 */
function updateThemeButtonColor(themeName) {
    const changeThemeBtn = document.getElementById("changeThemeButton");
    if (changeThemeBtn) {
        const colors = themeButtonColors[themeName];
        if (colors) {
            changeThemeBtn.style.backgroundColor = colors.bgColor;
            const label = changeThemeBtn.querySelector(".label");
            const icon = changeThemeBtn.querySelector("i");
            if (label) label.style.color = colors.textColor;
            if (icon) icon.style.color = colors.textColor;
        }
    }
}

/**
 * Funzione per cambiare il tema della lightbox SSG.
 * Cicla tra i temi disponibili (light, dark, dim, black).
 */
function changeLightboxTheme() {
    if (!window.SSG || !SSG.cfg) {
        console.warn("SSG non è disponibile o non è stato configurato per cambiare il tema.");
        return;
    }

    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];

    SSG.cfg.theme = newTheme;
    updateThemeButtonColor(newTheme); // Aggiorna il colore del pulsante

    if (isSsgLightboxOpen() && typeof SSG.close === 'function') {
        SSG.close();
        setTimeout(() => {
            // Se necessario, riaprire la lightbox qui con il nuovo tema.
            // Per questo caso, ci affidiamo che il tema verrà applicato al prossimo avvio.
        }, 300);
    }
}


// ============================================================================
// FUNZIONI DI CARICAMENTO GALLERIA
// ============================================================================

/**
 * Funzione generica per caricare e visualizzare una galleria.
 * Questa funzione gestisce l'aggiornamento del DOM principale
 * e avvia/riavvia la lightbox SSG con i nuovi dati.
 *
 * @param {Array<Object>} galleryData - L'array di oggetti immagine della nuova galleria.
 * @param {string} galleryName - Il nome logico della galleria (es. 'principale', 'collinare').
 * @param {boolean} [shouldRunSsgImmediately=false] - Indica se avviare SSG immediatamente dopo il caricamento.
 */
function caricaGalleria(galleryData, galleryName, shouldRunSsgImmediately = false) {
    const lightboxWasOpen = isSsgLightboxOpen();

    const proceedWithGalleryLoad = () => {
        galleriaCorrente = galleryData;
        renderGallery(galleryElement, galleriaCorrente);
        localStorage.setItem('lastSelectedGallery', galleryName);

        if (window.SSG && SSG.beforeRun) {
            SSG.beforeRun();
        }

        if (window.SSG && shouldRunSsgImmediately) {
            setTimeout(() => {
                SSG.run({
                    imgs: galleriaCorrente,
                    startIndex: 0
                });
            }, 100);
        } else if (!window.SSG) {
            console.warn("caricaGalleria: Story Show Gallery (SSG) non è disponibile.");
        }
    };

    if (lightboxWasOpen) {
        if (typeof SSG.close === 'function') {
            SSG.close();
            setTimeout(() => {
                proceedWithGalleryLoad();
            }, 300);
        } else {
            console.error("caricaGalleria: SSG.close non è una funzione. Procedo senza chiudere SSG.");
            proceedWithGalleryLoad();
        }
    } else {
        proceedWithGalleryLoad();
    }
}

// Funzioni wrapper per chiamare caricaGalleria con il nome corretto
function caricaGalleriaPrincipale() {
    caricaGalleria(galleriaPrincipaleImmagini, 'principale', true);
}
function caricaGalleriaCollinare() {
    caricaGalleria(galleriaCollinareImmagini, 'collinare', true);
}
function caricaGalleriaPineta() {
    caricaGalleria(galleriaPinetaImmagini, 'pineta', true);
}
function caricaGalleriaSunset() {
    caricaGalleria(galleriaSunsetImmagini, 'sunset', true);
}
function caricaGalleriaRelax() {
    caricaGalleria(galleriaRelaxImmagini, 'relax', true);
}

// ============================================================================
// CODICE ESEGUITO QUANDO IL DOM È COMPLETAMENTE CARICATO
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    galleryElement = document.getElementById("photoGallery");

    if (!galleryElement) {
        console.error("DOMContentLoaded: Elemento #photoGallery non trovato. La galleria non sarà inizializzata.");
        return;
    }

    galleriaCorrente = galleriaPrincipaleImmagini;
    renderGallery(galleryElement, galleriaCorrente);

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
            watermarkWidth: 60,
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
            captionExif: 'trim',
            preferedCaptionLocation: 3,
            sideCaptionforSmallerLandscapeImg: false,
            globalAuthorCaption: '<span style="color:green"> @ BibbonaBike</span>',
            showLandscapeHint: true,
            landscapeHint: '<i>↻</i> Ruota il telefono per vedere meglio <span>📱</span>',
            hint1: "Naviga nella galleria con:",
            hint2: "rotella del mouse <strong>⊚</strong> o frecce <strong>↓→↑←</strong>",
            hint3: "oppure <strong>TOCCA</strong> in basso o in alto",
            hintTouch: "<strong>TOCCA</strong> in basso o in alto<br> per scorrere la galleria",
            toTheTop: "Torna all'inizio",
            imageLink: "Link all'immagine selezionata:",
            copyButton: "⎘ Copia il link",
            linkPaste: "…puoi incollarlo ovunque con ctrl+v",
            fileToLoad: "ssg-loaded.html",
            exitLink: "Esci dalla galleria.",
            observeDOM: true,
            onImgLoad: function(data) {
                // Funzione onImgLoad lasciata vuota, rimuovendo riferimenti esterni non più necessari.
            }
        });
        // Imposta il colore iniziale del pulsante tema in base al tema di default di SSG
        updateThemeButtonColor(SSG.cfg.theme);
    } else {
        console.error("DOMContentLoaded: Story Show Gallery (SSG) non è disponibile. Assicurati che ssg.js sia caricato correttamente.");
    }

    galleryElement.addEventListener("click", e => {
        const anchor = e.target.closest("a");
        if (!anchor || !galleryElement.contains(anchor) || !anchor.querySelector('img')) {
            return;
        }
        e.preventDefault();

        const index = Number(anchor.dataset.index);
        if (!isNaN(index)) {
            if (window.SSG && SSG.beforeRun) {
                SSG.beforeRun();
            }
            
            SSG.run({
                imgs: galleriaCorrente,
                startIndex: index
            });
        } else {
            console.warn("EventListener (gallery click): Indice miniatura non valido (NaN).");
        }
    });

    // Toggle layout della griglia
    const toggleBtn = document.getElementById("toggleLayout");
    if (toggleBtn) {
        // Imposta lo stato iniziale del pulsante per riflettere che la galleria inizia in modalità libera (go-masonry)
        const isInitiallyMasonry = galleryElement.classList.contains("go-masonry");
        toggleBtn.classList.toggle("active", isInitiallyMasonry);
        toggleBtn.setAttribute("aria-pressed", isInitiallyMasonry);

        const label = toggleBtn.querySelector(".label");
        // Se la galleria è inizialmente in modalità libera, il pulsante deve offrire l'opzione "Griglia"
        if (label) label.textContent = isInitiallyMasonry ? "Griglia" : "Libero";

        const icon = toggleBtn.querySelector("i");
        // Se la galleria è inizialmente in modalità libera, il pulsante deve mostrare l'icona della griglia
        if (icon) icon.className = isInitiallyMasonry ? "fas fa-th" : "fas fa-border-all";


        toggleBtn.addEventListener("click", () => {
            // isActive sarà true se go-masonry è ora presente (modalità libera)
            const isActive = galleryElement.classList.toggle("go-masonry");

            toggleBtn.classList.toggle("active", isActive);
            toggleBtn.setAttribute("aria-pressed", isActive);

            // Se la galleria è ora in modalità libera (isActive è true), il pulsante deve offrire "Griglia"
            if (label) label.textContent = isActive ? "Griglia" : "Libero";

            // Se la galleria è ora in modalità libera (isActive è true), il pulsante deve mostrare l'icona della griglia
            if (icon) icon.className = isActive ? "fas fa-th" : "fas fa-border-all";
        });
    } else {
        console.warn("DOMContentLoaded: Elemento #toggleLayout non trovato.");
    }

    const changeThemeBtn = document.getElementById("changeThemeButton");
    if (changeThemeBtn) {
        changeThemeBtn.addEventListener("click", changeLightboxTheme);
    } else {
        console.warn("DOMContentLoaded: Elemento #changeThemeButton non trovato. Il pulsante di cambio tema non funzionerà.");
    }

    document.addEventListener("keydown", e => {
        if (!e.key || e.key === "") {
            e.preventDefault();
        }
    });
});

window.caricaGalleriaPrincipale = caricaGalleriaPrincipale;
window.caricaGalleriaCollinare = caricaGalleriaCollinare;
window.caricaGalleriaPineta = caricaGalleriaPineta;
window.caricaGalleriaSunset = caricaGalleriaSunset;
window.caricaGalleriaRelax = caricaGalleriaRelax;