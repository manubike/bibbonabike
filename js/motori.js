document.addEventListener('DOMContentLoaded', () => {
    
    // --- Logica Gestione Carosello Loghi ---
    const track = document.querySelector('.logo-carousel-track');
    
    // Mette in pausa l'animazione al passaggio del mouse
    if (track) { // Controlla che l'elemento esista
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        // Riprende l'animazione quando il mouse esce
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }


    // --- Logica Gestione Cookie (Consenso Granulare) ---
    const overlay = document.getElementById('cookie-banner-overlay');
    const acceptAllBtn = document.getElementById('accept-all-btn');
    const rejectAllBtn = document.getElementById('reject-all-btn');
    const savePrefsBtn = document.getElementById('save-prefs-btn');
    
    // Selettori per le checkbox
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const marketingCheckbox = document.getElementById('cookie-marketing');

    const STORAGE_KEY = 'bibbonabike_cookie_consent';

    function getConsent() {
        const consent = localStorage.getItem(STORAGE_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    function saveConsent(prefs) {
        prefs.necessary = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        if (overlay) overlay.style.display = 'none'; // Nasconde solo se esiste
        applyConsent(prefs);
    }

    function applyConsent(prefs) {
        console.log("Stato Consenso Applica:", prefs);
        
        if (prefs.analytics) {
            console.log("ANALISI: Il consenso per gli analytics è stato dato. Carica qui il codice di Google Analytics.");
            // Esempio: loadGoogleAnalyticsScript();
        } 

        if (prefs.marketing) {
            console.log("MARKETING: Il consenso per il marketing è stato dato. Carica qui i Pixel di Facebook/Ads.");
            // Esempio: loadFacebookPixel();
        } 
    }

    // Logica Iniziale: Controlla e mostra/nascondi
    const existingConsent = getConsent();

    if (existingConsent) {
        applyConsent(existingConsent);
    } else if (overlay) {
        overlay.style.display = 'flex';
    }

    // Event Listeners (aggiungi il controllo che i pulsanti esistano)
    if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => {
        const prefs = { analytics: true, marketing: true };
        saveConsent(prefs);
    });

    if (rejectAllBtn) rejectAllBtn.addEventListener('click', () => {
        const prefs = { analytics: false, marketing: false };
        saveConsent(prefs);
    });

    if (savePrefsBtn) savePrefsBtn.addEventListener('click', () => {
        const prefs = {
            analytics: analyticsCheckbox.checked,
            marketing: marketingCheckbox.checked
        };
        saveConsent(prefs);
    });
});
