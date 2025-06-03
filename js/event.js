document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".eventi-slider");
  const drawer = document.getElementById("eventoDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("eventoDrawerClose");

  // Observer per animazione su scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Apertura drawer + overlay
  const openDrawer = () => {
    drawer.classList.remove("hidden");
    drawer.classList.add("visible");
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
    drawer.scrollTop = 0; // scrolla in alto ogni volta che si apre
  };

  // Chiusura drawer + overlay
  const closeDrawer = () => {
    drawer.classList.remove("visible");
    drawer.classList.add("hidden");
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
  };

  // Click su overlay o X per chiudere
  overlay.addEventListener("click", closeDrawer);
  closeBtn.addEventListener("click", closeDrawer);

  // Fetch eventi da eventi.json
  fetch("js/eventi.json")
    .then(res => res.json())
    .then(eventi => {
      eventi.forEach(ev => { // Rimosso 'i' dall'iterazione dato che non viene usato nella card.className che ora è fissa "evento-card"
        const card = document.createElement("div");
        card.className = "evento-card"; // Usa classe fissa come da tuo ultimo snippet

        card.innerHTML = `
          <div class="evento-inner">
            <div class="evento-tag evento-${ev.type}">${ev.type.toUpperCase()}</div>
            <img src="${ev.image}" alt="${ev.title}" />
            <div class="evento-info">
              <h3>${ev.title}</h3>
              <p><strong>Quando:</strong> ${ev.date} <br><strong>Orario:</strong> ${ev.time}</p>
              <p>${ev.description}</p>
              <div class="buttons">
                <a href="#noleggio" class="btn-primary scroll-btn event-card-book-btn" data-event-id="${ev.id}" data-event-title="${ev.title}">Prenota</a>
                <a href="#" class="info-btn"><i class="fas fa-info-circle"></i> Info</a>
              </div>
            </div>
          </div>
        `;

        slider.appendChild(card);
        observer.observe(card);

        // Effetto tilt su desktop
        if (window.innerWidth > 768) {
          const inner = card.querySelector(".evento-inner"); // Utilizza .evento-inner come nel tuo snippet
          card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * -10;
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            inner.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`;
          });
          card.addEventListener("mouseleave", () => {
            inner.style.transform = "rotateX(0deg) rotateY(0deg)";
            inner.style.background = "none";
          });
        }
        
        // Listener per il pulsante "Prenota" direttamente sulla card (se presente e necessario)
        // Se vuoi che il click su questo "Prenota" della card selezioni l'evento nel form,
        // devi duplicare parte della logica del drawerBook qui, ma SENZA aprire il drawer.
        // Ho aggiunto una classe specifica `event-card-book-btn` per questo.
        const cardBookBtn = card.querySelector(".event-card-book-btn");
        if (cardBookBtn) {
            cardBookBtn.addEventListener("click", (clickEvent) => {
                clickEvent.preventDefault();
                
                // Popola i campi dell'evento nel form di noleggio
                document.getElementById("eventSelected").value = ev.title;
                document.getElementById("eventIdHidden").value = ev.id;
                document.getElementById("eventField").style.display = "flex";
                
                // ✅ IMPORTANTE: Nascondi e svuota il campo del tour
                document.getElementById("tourSelected").value = "";
                document.getElementById("tourSelected").removeAttribute("data-tour-id");
                document.getElementById("tourField").style.display = "none";
                
                showSuccessMessage(`✅ Evento "${ev.title}" selezionato!`);
                
                // Scrolla al form di noleggio
                document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
                
                // Attiva l'aggiornamento del prezzo in booking.js
                const eventChangeEvent = new Event('change', { bubbles: true });
                document.getElementById("eventIdHidden").dispatchEvent(eventChangeEvent);
            });
        }


        // Mostra drawer
        const infoBtn = card.querySelector(".info-btn");
        infoBtn.addEventListener("click", e => {
          e.preventDefault();

          document.getElementById("drawerImage").src = ev.image;
          document.getElementById("drawerTitle").textContent = ev.title;
          document.getElementById("drawerDate").textContent = ev.date;
          document.getElementById("drawerTime").textContent = ev.time;
          document.getElementById("drawerPrice").textContent = ev.price || "–";
          document.getElementById("drawerDescription").textContent = ev.descriptionFull || ev.description;

          let drawerBook = document.getElementById("drawerBook");
          drawerBook.href = "#noleggio";

          // ** FIX CHIAVE **: Rimuove e ricrea il pulsante per eliminare listener duplicati
          // e assicura che un solo listener sia attivo per ogni apertura del drawer.
          const oldDrawerBook = drawerBook.cloneNode(true);
          drawerBook.parentNode.replaceChild(oldDrawerBook, drawerBook);
          const newDrawerBook = document.getElementById("drawerBook"); // Riferimento al nuovo elemento


          // Aggiungi un nuovo listener al pulsante "Prenota" del drawer
          newDrawerBook.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault(); // Previene il comportamento predefinito del link

            closeDrawer(); // Chiudi il drawer

            // Popola i campi dell'evento nel form di noleggio
            document.getElementById("eventSelected").value = ev.title; // Nome evento visibile
            document.getElementById("eventIdHidden").value = ev.id; // ID evento nascosto per il Worker
            document.getElementById("eventField").style.display = "flex"; // Mostra il campo evento
            
            // ✅ IMPORTANTE: Nascondi e svuota il campo del tour
            document.getElementById("tourSelected").value = "";
            document.getElementById("tourSelected").removeAttribute("data-tour-id"); // Rimuovi l'ID del tour
            document.getElementById("tourField").style.display = "none";
            
            showSuccessMessage(`✅ Evento "${ev.title}" selezionato!`);
            
            // Scrolla al form di noleggio
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
            
            // Attiva l'aggiornamento del prezzo in booking.js
            const eventChangeEvent = new Event('change', { bubbles: true });
            document.getElementById("eventIdHidden").dispatchEvent(eventChangeEvent); // Questo triggererà updateLivePrice in booking.js
          });


          document.getElementById("drawerWhatsApp").href =
            `https://wa.me/393313453207?text=${encodeURIComponent(ev.whatsapp)}`;
          document.getElementById("drawerEmail").href =
            `mailto:${ev.email || "info@bibbonabike.com"}?subject=Info evento: ${encodeURIComponent(ev.title)}`;

          openDrawer();
        });
      });
    })
    .catch(error => {
      console.error("Errore nel caricamento degli eventi:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Errore nel caricamento degli eventi. Riprova più tardi.";
      slider.appendChild(errorMessage);
    });
});

// Funzione helper per i messaggi di successo (se non è già presente in booking.js, ma è meglio averla qui per completezza)
function showSuccessMessage(message, duration = 3000) {
    const msg = document.createElement("div");
    msg.textContent = message;
    Object.assign(msg.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#28a745", // Green for success
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        zIndex: "9999",
        transition: "opacity 0.3s ease-in-out",
        opacity: "1"
    });
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 300);
    }, duration);
}