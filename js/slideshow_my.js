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
let backToMainGalleryBtn; // Bottone "Torna alla Galleria Principale"

// ============================================================================
// FUNZIONI HELPER E DI LOGICA
// ============================================================================

/**
 * Funzione helper per aggiornare la visibilità del bottone "Torna alla Galleria Principale".
 */
function updateBackButtonVisibility() {
    console.log("updateBackButtonVisibility: Avvio.");
    if (!backToMainGalleryBtn) {
        console.warn("updateBackButtonVisibility: Elemento backToMainGalleryBtn non trovato.");
        return;
    }

    // Confronta se l'array corrente è lo stesso dell'array principale
    const isMainGallery = galleriaCorrente === galleriaPrincipaleImmagini;
    console.log("updateBackButtonVisibility: È la galleria principale?", isMainGallery);

    if (!isMainGallery) {
        backToMainGalleryBtn.style.display = 'inline-block';
        console.log("updateBackButtonVisibility: Bottone 'Torna alla Galleria Principale' mostrato.");
    } else {
        backToMainGalleryBtn.style.display = 'none';
        console.log("updateBackButtonVisibility: Bottone 'Torna alla Galleria Principale' nascosto.");
    }
}

/**
 * Funzione generica per popolare la griglia delle miniature.
 * Utilizza la nuova struttura { href, alt }.
 * @param {HTMLElement} container - L'elemento DOM che conterrà le miniature.
 * @param {Array<Object>} photos - L'array di oggetti immagine.
 */
function renderGallery(container, photos) {
    console.log("renderGallery: Avvio. Numero di foto:", photos.length);
    if (!container) {
        console.error("renderGallery: Container per la galleria non trovato.");
        return;
    }
    // Utilizza p.href per src dell'immagine e p.alt per il testo alternativo e la didascalia
    container.innerHTML = photos.map((p, i) =>
        `<a href="${p.href}" class="go_gridItem" data-index="${i}">
            <img src="${p.href}" alt="${p.alt}" loading="lazy" width="300" height="200">
            <span class="go_caption go_caption-full">${p.alt}</span>
        </a>`
    ).join("");
    console.log("renderGallery: Miniature caricate nel DOM.");
}

/**
 * Controlla se la lightbox SSG è attualmente aperta.
 * Si basa sulla classe 'ssg-active' aggiunta al body da SSG.
 * @returns {boolean} True se la lightbox è aperta, false altrimenti.
 */
function isSsgLightboxOpen() {
    const ssgOpenClass = 'ssg-active';
    const isOpen = document.body.classList.contains(ssgOpenClass);
    console.log(`isSsgLightboxOpen: Verificando se <body> contiene la classe '${ssgOpenClass}'. Risultato: ${isOpen}`);
    return isOpen;
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
    console.log(`caricaGalleria: Avvio per la galleria: ${galleryName}. Avvio SSG immediato: ${shouldRunSsgImmediately}`);

    const lightboxWasOpen = isSsgLightboxOpen();

    const proceedWithGalleryLoad = () => {
        // 1. Aggiorna lo stato della galleria corrente
        galleriaCorrente = galleryData; // Assegna direttamente l'array di riferimento
        console.log("caricaGalleria: galleriaCorrente aggiornata. Prima immagine:", galleriaCorrente.length > 0 ? galleriaCorrente[0].alt : "Nessuna immagine");

        // 2. Aggiorna la visualizzazione delle miniature sulla home page.
        renderGallery(galleryElement, galleriaCorrente);
        updateBackButtonVisibility();

        // 3. Salva il nome della galleria nel localStorage
        localStorage.setItem('lastSelectedGallery', galleryName);
        console.log(`caricaGalleria: Salvato in localStorage: lastSelectedGallery = ${galleryName}`);

        // 4. Forza SSG a scansionare nuovamente le immagini dal DOM DOPO che è stato aggiornato da renderGallery.
        // Questo è CRUCIALE per SSG quando si cambiano dinamicamente le miniature.
        if (window.SSG && SSG.beforeRun) {
            SSG.beforeRun(); // Re-inizializza SSG.jQueryImgCollection dal DOM corrente
            console.log("caricaGalleria: SSG.beforeRun() chiamato per forzare la scansione delle nuove miniature.");
        } else if (window.SSG) {
             console.warn("caricaGalleria: SSG.beforeRun non è una funzione o SSG non è completamente inizializzato.");
        }

        // 5. Se SSG è disponibile e richiesto, avvia la lightbox con la nuova galleria.
        if (window.SSG && shouldRunSsgImmediately) {
            console.log("caricaGalleria: SSG è disponibile. Avvio SSG con la nuova galleria.");
            // Piccolo ritardo per assicurarsi che il DOM sia stabile e SSG abbia scansionato correttamente.
            setTimeout(() => {
                SSG.run({
                    imgs: galleriaCorrente, // Passa il nuovo set di immagini esplicitamente
                    startIndex: 0          // Inizia dalla prima immagine della nuova galleria
                });
                console.log("caricaGalleria: SSG.run() chiamato con successo per la nuova galleria dopo un ritardo.");
            }, 100); // Un breve ritardo è spesso necessario dopo manipolazioni DOM e re-scansioni
        } else if (!window.SSG) {
            console.warn("caricaGalleria: Story Show Gallery (SSG) non è disponibile.");
        }
    };

    if (lightboxWasOpen) {
        console.log("caricaGalleria: SSG lightbox è attualmente aperto, provo a chiuderlo prima di caricare la nuova galleria.");
        if (typeof SSG.close === 'function') {
            SSG.close();
            console.log("caricaGalleria: SSG.close() chiamato.");
            // Attendere che SSG si chiuda completamente prima di procedere.
            setTimeout(() => {
                if (isSsgLightboxOpen()) {
                    console.warn("caricaGalleria: SSG lightbox non si è chiuso completamente dopo SSG.close(). Procedo comunque.");
                } else {
                    console.log("caricaGalleria: SSG lightbox chiuso con successo.");
                }
                proceedWithGalleryLoad();
            }, 300); // Tempo sufficiente per la chiusura di SSG
        } else {
            console.error("caricaGalleria: SSG.close non è una funzione. Procedo senza chiudere SSG.");
            proceedWithGalleryLoad(); // Procedi senza chiudere se close non è una funzione
        }
    } else {
        console.log("caricaGalleria: SSG lightbox non era aperto, procedo direttamente.");
        proceedWithGalleryLoad();
    }
}

// Funzioni wrapper per chiamare caricaGalleria con il nome corretto
// Se vuoi che la lightbox si avvii immediatamente, il terzo parametro deve essere 'true'
function caricaGalleriaPrincipale() {
    console.log("caricaGalleriaPrincipale: Chiamata.");
    caricaGalleria(galleriaPrincipaleImmagini, 'principale', true); // Avvia la lightbox immediatamente
}
function caricaGalleriaCollinare() {
    console.log("caricaGalleriaCollinare: Chiamata.");
    caricaGalleria(galleriaCollinareImmagini, 'collinare', true); // Avvia la lightbox immediatamente
}
function caricaGalleriaPineta() {
    console.log("caricaGalleriaPineta: Chiamata.");
    caricaGalleria(galleriaPinetaImmagini, 'pineta', true); // Avvia la lightbox immediatamente
}
function caricaGalleriaSunset() {
    console.log("caricaGalleriaSunset: Chiamata.");
    caricaGalleria(galleriaSunsetImmagini, 'sunset', true); // Avvia la lightbox immediatamente
}
function caricaGalleriaRelax() {
    console.log("caricaGalleriaRelax: Chiamata.");
    caricaGalleria(galleriaRelaxImmagini, 'relax', true); // Avvia la lightbox immediatamente
}

/**
 * Funzione per tornare alla galleria principale.
 * Chiude la lightbox SSG se aperta e imposta la galleria principale come corrente.
 * Non avvia automaticamente SSG; l'utente dovrà cliccare sulle miniature per riaprire.
 */
function tornaAllaGalleriaPrincipale() {
    console.log("tornaAllaGalleriaPrincipale: Avvio.");

    const proceedToMainGallery = () => {
        caricaGalleria(galleriaPrincipaleImmagini, 'principale', false); // False = non avvia SSG automaticamente
        localStorage.removeItem('lastSelectedGallery');
        console.log("tornaAllaGalleriaPrincipale: Galleria principale caricata e localStorage pulito.");
    };

    const wasSsgOpen = isSsgLightboxOpen();
    console.log("tornaAllaGalleriaPrincipale: Stato lightbox prima della chiusura (DOM check):", wasSsgOpen ? 'Aperta' : 'Chiusa');

    if (window.SSG && wasSsgOpen) {
        if (typeof SSG.close === 'function') {
            SSG.close();
            console.log("tornaAllaGalleriaPrincipale: SSG.close() chiamato.");
            // Aggiungi un ritardo per permettere a SSG di chiudersi completamente
            setTimeout(() => {
                if (isSsgLightboxOpen()) {
                    console.warn("tornaAllaGalleriaPrincipale: SSG lightbox non si è chiuso completamente dopo SSG.close(). Carico comunque la galleria principale.");
                } else {
                    console.log("tornaAllaGalleriaPrincipale: SSG lightbox chiuso con successo.");
                }
                proceedToMainGallery();
            }, 300); // Ritardo sufficiente per SSG
        } else {
            console.error("tornaAllaGalleriaPrincipale: SSG.close non è una funzione. Carico comunque la galleria principale.");
            proceedToMainGallery();
        }
    } else {
        console.log("tornaAllaGalleriaPrincipale: SSG non era aperto o non disponibile, caricata direttamente la galleria principale.");
        proceedToMainGallery();
    }
}


// ============================================================================
// CODICE ESEGUITO QUANDO IL DOM È COMPLETAMENTE CARICATO
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded: Evento DOMContentLoaded scattato.");

    // Inizializza le variabili DOM qui
    // ASSICURATI CHE GLI ID NEL TUO HTML SIANO ESATTAMENTE 'photoGallery' E 'backToMainGalleryBtn'
    galleryElement = document.getElementById("photoGallery");
    backToMainGalleryBtn = document.getElementById("backToMainGalleryBtn");

    if (!galleryElement) {
        console.error("DOMContentLoaded: Elemento #photoGallery non trovato. La galleria non sarà inizializzata.");
        return;
    }
    console.log("DOMContentLoaded: Elemento #photoGallery trovato.");

    if (backToMainGalleryBtn) {
        backToMainGalleryBtn.addEventListener("click", () => {
            console.log("DOMContentLoaded: Click su 'Torna alla Galleria Principale'.");
            tornaAllaGalleriaPrincipale();
        });
        console.log("DOMContentLoaded: Event listener per backToMainGalleryBtn aggiunto.");
    } else {
        console.warn("DOMContentLoaded: Elemento #backToMainGalleryBtn non trovato.");
    }

    // Carica la galleria principale come default all'avvio
    galleriaCorrente = galleriaPrincipaleImmagini;
    renderGallery(galleryElement, galleriaCorrente);
    updateBackButtonVisibility();
    console.log("DOMContentLoaded: Pagina inizializzata con galleria di default (Principale).");


    // Configura SSG
    // Questo blocco di configurazione deve essere eseguito dopo che SSG è stato caricato.
    // L'ideal è che il tag <script src="ssg.js"></script> sia prima di questo script.
    if (window.SSG) {
        Object.assign(SSG.cfg, {
            theme: 'light',
            scrollDuration: 500,
            alwaysFullscreen: false,
            neverFullscreen: false,
            mobilePortraitFS: false,
            forceLandscapeMode: false,
            crossCursor: false,
            autorun: false, // Importante: non avviare SSG automaticamente al caricamento della pagina
            noautostart: true, // Importante: non avviare SSG automaticamente al caricamento della pagina
            watermarkImage: 'img/icon_ai.png', // Assicurati che questo percorso sia corretto
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
            // L'exitLink punta alla funzione globale `tornaAllaGalleriaPrincipale` nel parent (index.html)
            exitLink: "Esci dalla galleria <a onclick='parent.tornaAllaGalleriaPrincipale();' style='cursor:pointer; color:#71a7b7;'>Torna alla galleria principale</a>",
            observeDOM: true, // Lascialo a true per permettere a SSG di rilevare cambiamenti DOM
            onImgLoad: function(data) {
                // Funzione onImgLoad lasciata vuota, rimuovendo riferimenti esterni non più necessari.
            }
        });
        console.log("DOMContentLoaded: Configurazione SSG completata.");
    } else {
        console.error("DOMContentLoaded: Story Show Gallery (SSG) non è disponibile. Assicurati che ssg.js sia caricato correttamente.");
    }

    // Gestione del click sulla galleria per avviare SSG
    galleryElement.addEventListener("click", e => {
        console.log("EventListener (gallery click): Click rilevato sulla galleria.");
        const anchor = e.target.closest("a");
        // Verifica che il click sia su un link che contiene un'immagine e che sia all'interno di galleryElement
        if (!anchor || !galleryElement.contains(anchor) || !anchor.querySelector('img')) {
            console.log("EventListener (gallery click): Click non su un link valido della galleria, ignorato.");
            return;
        }
        e.preventDefault(); // Impedisce il comportamento predefinito del link (es. navigazione)
        console.log("EventListener (gallery click): Prevenuta l'azione di default del link.");

        const index = Number(anchor.dataset.index);
        if (!isNaN(index)) {
            console.log(`EventListener (gallery click): Indice miniatura cliccata: ${index}.`);
            console.log("EventListener (gallery click): Chiamata SSG.run() con galleriaCorrente. Prima immagine:", galleriaCorrente.length > 0 ? galleriaCorrente[0].alt : "Nessuna immagine");

            // Prima di avviare SSG, assicuriamoci che sia stato correttamente ri-scansionato il DOM
            if (window.SSG && SSG.beforeRun) {
                SSG.beforeRun();
                console.log("EventListener (gallery click): SSG.beforeRun() chiamato prima di SSG.run().");
            }
            
            // Avvia SSG con l'array corrente e l'indice cliccato
            SSG.run({
                imgs: galleriaCorrente, // Utilizza l'array galleriaCorrente attuale
                startIndex: index
            });
            console.log("EventListener (gallery click): SSG avviato. Verifico lo stato lightbox dopo un breve ritardo.");
            setTimeout(() => {
                console.log("EventListener (gallery click): Stato lightbox dopo SSG.run():", isSsgLightboxOpen() ? 'Aperta' : 'Chiusa');
            }, 100);
        } else {
            console.warn("EventListener (gallery click): Indice miniatura non valido (NaN).");
        }
    });
    console.log("DOMContentLoaded: Event listener per la galleria aggiunto.");

    // Toggle layout della griglia
    const toggleBtn = document.getElementById("toggleLayout");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            console.log("EventListener (toggleLayout): Click su bottone toggle layout.");
            const isActive = galleryElement.classList.toggle("go-masonry");
            toggleBtn.classList.toggle("active", isActive);
            toggleBtn.setAttribute("aria-pressed", isActive);

            const label = toggleBtn.querySelector(".label");
            if (label) label.textContent = isActive ? "Libero" : "Griglia";

            const icon = toggleBtn.querySelector("i");
            if (icon) icon.className = isActive ? "fas fa-border-all" : "fas fa-th";
            console.log("EventListener (toggleLayout): Layout della galleria cambiato a:", isActive ? "Masonry" : "Griglia standard");
        });
        console.log("DOMContentLoaded: Event listener per toggleLayout aggiunto.");
    } else {
        console.warn("DOMContentLoaded: Elemento #toggleLayout non trovato.");
    }

    // Fix warning: key "" per eventi keydown (non correlato al warning jQuery/SSG)
    document.addEventListener("keydown", e => {
        if (!e.key || e.key === "") {
            e.preventDefault();
            console.log("EventListener (keydown): Prevenuto keydown con chiave vuota.");
        }
    });
    console.log("DOMContentLoaded: Event listener per keydown aggiunto.");
});

// Aggiungi queste funzioni al contesto globale se sono chiamate da HTML (es. onclick)
// Questo è necessario se i tuoi bottoni HTML hanno `onclick="caricaGalleriaPineta()"`
window.caricaGalleriaPrincipale = caricaGalleriaPrincipale;
window.caricaGalleriaCollinare = caricaGalleriaCollinare;
window.caricaGalleriaPineta = caricaGalleriaPineta;
window.caricaGalleriaSunset = caricaGalleriaSunset;
window.caricaGalleriaRelax = caricaGalleriaRelax;
window.tornaAllaGalleriaPrincipale = tornaAllaGalleriaPrincipale;