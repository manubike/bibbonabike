// js/booking.js

// --- Helper Functions for User Feedback ---
// Queste funzioni forniscono messaggi a comparsa per successi ed errori.
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

function showErrorMessage(message, duration = 4000) {
    const msg = document.createElement("div");
    msg.textContent = message;
    Object.assign(msg.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#dc3545", // Red for error
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

// --- Price Calculation Logic ---
// Funzione asincrona per aggiornare il prezzo in tempo reale basato sulle selezioni del form.
// Invia i dati a un worker di Cloudflare per il calcolo del prezzo.
async function updateLivePrice() {
    const bikeTypeElement = document.getElementById("bikeType");
    const durationElement = document.getElementById("duration");
    const quantityElement = document.getElementById("quantity");
    const tourInputElement = document.getElementById("tourSelected"); // Input field for tour name
    const eventIdHiddenElement = document.getElementById("eventIdHidden"); // Hidden input for event ID
    const paypalPlaceholder = document.getElementById("paypalPlaceholder"); // Placeholder for PayPal button

    // Recupera i valori dai campi, fornendo valori predefiniti in caso di assenza
    const ownBike = document.getElementById("ownBikeCheckbox")?.checked;
    const bikeType = ownBike ? "NESSUNA" : (bikeTypeElement ? bikeTypeElement.value : '');
    const duration = durationElement ? parseFloat(durationElement.value) : 0;
    const quantity = quantityElement ? parseInt(quantityElement.value || '1') : 1;
    const tour = tourInputElement ? tourInputElement.value.trim() : null; // Tour name
    const eventId = eventIdHiddenElement ? eventIdHiddenElement.value.trim() : null; // Event ID

    // Se mancano dati essenziali per il calcolo del prezzo, resetta e esci
    if (!bikeType || isNaN(duration) || duration <= 0 || isNaN(quantity) || quantity <= 0) {
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = ""; // Pulisce il pulsante PayPal
            paypalPlaceholder.style.display = "none"; // Nasconde il placeholder
        }
        window.prezzoRisposta = null; // Pulisce la risposta del prezzo memorizzata
        return;
    }

    // Prepara i dati da inviare al worker di calcolo prezzo
    const data = {
        tipo: bikeType,
        giorni: duration,
        quantita: quantity,
    };
    // Aggiunta accessori selezionati
    const selectedAccessories = Array.from(document.querySelectorAll("input[name='accessories']:checked"))
    .map(el => el.value);
    if (selectedAccessories.length > 0) {
        data.accessories = selectedAccessories;
    }

    // Aggiungi tourId o eventId ai dati, assicurandoti che solo uno sia presente
    if (tour) {
        data.tour = tour; // Seleziona il tour per nome, o potresti usare un tourId se disponibile
        data.eventoId = null;
    } else if (eventId) {
        data.eventoId = eventId;
        data.tour = null;
    }

    try {
        // Chiama il worker di Cloudflare per calcolare il prezzo
        const response = await fetch("https://price-calculator.zonkeynet.workers.dev/calcola", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Aggiorna il display del prezzo se il calcolo ha avuto successo
        if (response.ok && result.status === "success") {
            document.getElementById("totalAmount").textContent = result.totale;
            document.getElementById("totalHidden").value = result.totale;
            window.prezzoRisposta = result; // Memorizza la risposta del worker per un uso successivo (es. PayPal HTML)

        } else {
            // Gestisce gli errori nel calcolo del prezzo dal worker
            showErrorMessage(`Errore nel calcolo del prezzo: ${result.message || 'Errore sconosciuto.'}`);
            document.getElementById("totalAmount").textContent = "0.00";
            document.getElementById("totalHidden").value = "0.00";
            if (paypalPlaceholder) {
                paypalPlaceholder.innerHTML = "";
                paypalPlaceholder.style.display = "none"; // Nasconde in caso di errore nel calcolo
            }
            window.prezzoRisposta = null;
        }
    } catch (error) {
        // Gestisce gli errori di rete o di risposta del server
        console.error("❌ Errore durante il calcolo del prezzo:", error.message);
        showErrorMessage(`Impossibile calcolare il prezzo: ${error.message}`);
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = "";
            paypalPlaceholder.style.display = "none";
        }
        window.prezzoRisposta = null;
    }
}

// --- Form Utility Functions ---
// Funzione per ottenere il valore di un input e scatenare eventi di input/change
function getInputValue(id) {
    const el = document.getElementById(id);
    if (el) {
        // Forziamo il dispatch degli eventi per assicurare che altri listener reagiscano
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return el.value.trim();
    }
    return '';
}

// Funzione per validare un campo e mostrare/nascondere lo stato di errore
function validateField(element) {
    if (!element) return;
    const formGroup = element.closest('.form-group');
    if (!formGroup) return;

    if (element.value.trim() === '') {
        formGroup.classList.add('error');
        return false;
    } else {
        formGroup.classList.remove('error');
        return true;
    }
}

// --- Main Initialization Function ---
// Inizializza tutti i listener e le logiche del form di prenotazione
function initializeBookingForm() {
    // Listener per i campi che influenzano il prezzo
    document.getElementById("bikeType")?.addEventListener("change", updateLivePrice);
    document.getElementById("duration")?.addEventListener("change", updateLivePrice);
    document.getElementById("quantity")?.addEventListener("input", updateLivePrice);
    // ✅ Listener per il cambio accessori
    const selectedAccessories = Array.from(document.querySelectorAll("input[name='accessories']:checked"))
    .map(el => el.value);


    // Listener per la validazione dei campi obbligatori
    document.getElementById("name")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("email")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("date")?.addEventListener("input", (e) => validateField(e.target));
    // Mostra accessori se clicco su SELEZIONA
    document.querySelectorAll(".bike-select").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const bikeType = btn.getAttribute("data-bike");
        const selectElement = document.getElementById("bikeType");
        if (selectElement) {
        selectElement.value = bikeType;
        showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
        }

        // Mostra gli accessori
        document.getElementById("accessoriesGroup").style.display = "block";
        updateLivePrice();
        document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    });

    // Aggiorna il prezzo se cambio accessorio
    document.querySelectorAll("input[name='accessories']").forEach(cb => {
    cb.addEventListener("change", updateLivePrice);
    });
    // Mostra accessori quando selezioni una bici dal menu a tendina
    document.getElementById("bikeType")?.addEventListener("change", (e) => {
    const value = e.target.value;
    const accessoriesGroup = document.getElementById("accessoriesGroup");
    if (value && value !== "NESSUNA") {
        accessoriesGroup.style.display = "block";
    } else {
        accessoriesGroup.style.display = "none";
    }
    updateLivePrice();
    });

    // Listener per i bottoni di selezione Tour
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".tour-book");
        if (!btn) return; // Non è un bottone tour-book

        e.preventDefault();

        const tourId = btn.getAttribute("data-tour-id");
        const tourName = btn.getAttribute("data-tour-name");

        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField"); // Container visibile del campo tour
        const eventInput = document.getElementById("eventSelected");
        const eventIdHidden = document.getElementById("eventIdHidden");
        const eventField = document.getElementById("eventField"); // Container visibile del campo evento

        if (tourInput && tourField) {
            tourInput.value = tourName;
            tourInput.setAttribute("data-tour-id", tourId); // Mantiene l'ID del tour
            tourField.style.display = "flex"; // Mostra il campo tour

            // Selezionando un tour, resetta e nascondi i campi dell'evento
            if (eventInput && eventField && eventIdHidden) {
                eventInput.value = "";
                eventIdHidden.value = "";
                eventField.style.display = "none";
            }

            showSuccessMessage(`✅ Tour "${tourName}" aggiunto!`);
            updateLivePrice(); // Aggiorna il prezzo
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // Aggiungi il bottone "rimuovi tour" se non esiste già
    const tourInputWrapper = document.querySelector(".tour-input-wrapper");
    if (tourInputWrapper && !document.getElementById("removeTourBtn")) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.id = "removeTourBtn";
        removeBtn.innerHTML = "✖";
        removeBtn.title = "Rimuovi tour selezionato";
        Object.assign(removeBtn.style, {
            marginLeft: "10px", background: "none", border: "none",
            fontSize: "1.3rem", cursor: "pointer", color: "#dc3545"
        });

        removeBtn.addEventListener("click", () => {
            const input = document.getElementById("tourSelected");
            const field = document.getElementById("tourField");
            if (input && field) {
                input.value = "";
                input.removeAttribute("data-tour-id");
                field.style.display = "none";
                showSuccessMessage("❌ Tour rimosso!", 2500);
                updateLivePrice(); // Aggiorna il prezzo dopo la rimozione
            }
        });
        tourInputWrapper.appendChild(removeBtn);
    }

    // Listener per il cambio dell'ID dell'evento (impostato da event.js)
    document.getElementById("eventIdHidden")?.addEventListener("change", (e) => {
        const eventId = e.target.value;
        const eventInput = document.getElementById("eventSelected");
        const eventField = document.getElementById("eventField");
        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField");

        if (eventId) {
            // Se un evento è selezionato, mostra il campo evento
            if (eventInput && eventField) {
                eventField.style.display = "flex";
                // eventInput.value è popolato da event.js
            }

            // E nasconde/resetta i campi del tour
            if (tourInput && tourField) {
                tourInput.value = "";
                tourInput.removeAttribute("data-tour-id");
                tourField.style.display = "none";
            }
            updateLivePrice(); // Aggiorna il prezzo con l'evento selezionato
        } else {
            // Se l'evento viene deselezionato, resetta e nascondi il campo evento
            if (eventInput && eventField) {
                eventInput.value = "";
                eventField.style.display = "none";
            }
            updateLivePrice(); // Aggiorna il prezzo
        }
    });

    // Aggiungi il bottone "rimuovi evento" se non esiste già
    const eventInputWrapper = document.querySelector(".event-input-wrapper"); // Assicurati di avere questo wrapper nel tuo HTML
    if (eventInputWrapper && !document.getElementById("removeEventBtn")) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.id = "removeEventBtn";
        removeBtn.innerHTML = "✖";
        removeBtn.title = "Rimuovi evento selezionato";
        Object.assign(removeBtn.style, {
            marginLeft: "10px", background: "none", border: "none",
            fontSize: "1.3rem", cursor: "pointer", color: "#dc3545"
        });

        removeBtn.addEventListener("click", () => {
            const input = document.getElementById("eventSelected");
            const idHidden = document.getElementById("eventIdHidden");
            const field = document.getElementById("eventField");
            if (input && idHidden && field) {
                input.value = "";
                idHidden.value = ""; // Pulisce anche l'ID nascosto
                field.style.display = "none";
                showSuccessMessage("❌ Evento rimosso!", 2500);
                updateLivePrice(); // Aggiorna il prezzo dopo la rimozione
            }
        });
        eventInputWrapper.appendChild(removeBtn);
    }


    // Listener per i bottoni di selezione del tipo di bici
    document.querySelectorAll(".bike-select").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const bikeType = btn.getAttribute("data-bike");
            const selectElement = document.getElementById("bikeType");
            if (selectElement) {
                selectElement.value = bikeType;
                updateLivePrice();
                showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
                document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // --- Form Submission Logic ---
    const rentalForm = document.getElementById("noleggioForm");
    if (!rentalForm) {
        console.error("❌ Form #noleggioForm non trovato!");
        return;
    }

    rentalForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const responseMessage = document.getElementById("responseMessage");
        const captchaToken = hcaptcha.getResponse();

        if (!captchaToken) {
            showErrorMessage("⚠️ Devi completare il captcha.");
            responseMessage.textContent = "❌ Verifica il captcha prima di inviare.";
            responseMessage.style.color = "#dc3545";
            return;
        }

        responseMessage.textContent = "⏳ Invio richiesta in corso...";
        responseMessage.style.color = "#000";
        // Rimuove eventuali stati di errore precedenti dai campi
        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

        // Recupera tutti i valori dei campi del form
        const name = getInputValue("name");
        const email = getInputValue("email");
        const ownBike = document.getElementById("ownBikeCheckbox")?.checked;
        const bikeType = ownBike ? "NESSUNA" : getInputValue("bikeType");
        const quantity = getInputValue("quantity") || "1";
        const date = getInputValue("date");
        const duration = getInputValue("duration") || "1";
        const notes = getInputValue("notes");
        const tourSelected = getInputValue("tourSelected");
        const eventIdHidden = getInputValue("eventIdHidden");
        const eventSelected = getInputValue("eventSelected");
        const total = getInputValue("totalHidden") || "0.00";

        // Validazione dei campi obbligatori
        let hasMissingFields = false;
        const requiredFields = [
            { id: "name", value: name, label: "Nome e Cognome" },
            { id: "email", value: email, label: "Email" },
            { id: "bikeType", value: ownBike ? "NESSUNA" : bikeType, label: "Tipo di bici" },
            { id: "date", value: date, label: "Data" }
        ];

        let missingLabels = [];
        requiredFields.forEach(field => {
            if (!field.value) {
                validateField(document.getElementById(field.id));
                hasMissingFields = true;
                missingLabels.push(field.label);
            }
        });

        // Se mancano campi obbligatori, mostra un errore e ferma l'invio
        if (hasMissingFields) {
            responseMessage.textContent = `❌ Errore: Compila tutti i campi obbligatori evidenziati. Mancanti: ${missingLabels.join(", ")}.`;
            responseMessage.style.color = "#dc3545";
            showErrorMessage("Completa tutti i campi richiesti.");
            const firstMissingField = document.getElementById(requiredFields.find(f => !f.value)?.id);
            if(firstMissingField) firstMissingField.focus(); // Porta il focus al primo campo mancante
            return;
        }

        // Prepara i dati per l'invio (FormData è utile per i worker)
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("bikeType", bikeType);
        formData.set("quantity", quantity);
        formData.set("date", date);
        formData.set("duration", duration);
        formData.set("notes", notes);
        formData.set("tourSelected", tourSelected);
        formData.set("eventSelected", eventSelected); // Invia il nome dell'evento visualizzato
        formData.set("eventIdHidden", eventIdHidden); // Invia l'ID dell'evento
        formData.set("total", total);
        const selectedAccessories = Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(el => el.value);
        formData.set("accessories", selectedAccessories.join(", "));
        formData.set("hcaptchaToken", captchaToken); 

        try {
            // Invia i dati al worker di Cloudflare per la gestione della prenotazione
            const response = await fetch("https://workers-bibbonabike.zonkeynet.workers.dev/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                responseMessage.textContent = "✅ Prenotazione inviata con successo!";
                responseMessage.style.color = "#28a745";

                // Resetta solo i campi di input rilevanti manualmente
                rentalForm.querySelectorAll("input, textarea, select").forEach(el => {
                    // Non resettare tutti i campi se alcuni devono mantenere un valore predefinito
                    if (["bikeType", "duration", "quantity", "notes", "name", "email", "date"].includes(el.id)) {
                        el.value = "";
                    }
                });

                // Visualizza il pulsante PayPal se la risposta del worker lo include
                const paypalPlaceholder = document.getElementById("paypalPlaceholder");
                if (window.prezzoRisposta?.paypalHtml) { // Controlla se il worker ha fornito l'HTML di PayPal
                    if (paypalPlaceholder) {
                        paypalPlaceholder.innerHTML = window.prezzoRisposta.paypalHtml;
                        paypalPlaceholder.style.display = "block"; // Assicurati che il div sia visibile

                        const paymentInstruction = document.createElement("p");
                        paymentInstruction.textContent = "Per completare la prenotazione, procedi al pagamento tramite PayPal:";
                        Object.assign(paymentInstruction.style, {
                            marginTop: "15px",
                            marginBottom: "10px",
                            color: "#333",
                            fontWeight: "bold",
                            textAlign: "center"
                        });
                        paypalPlaceholder.prepend(paymentInstruction); // Aggiunge le istruzioni sopra il pulsante
                    }
                }

                // Reset prezzo e campi tour/evento dopo l'invio della prenotazione
                document.getElementById("totalAmount").textContent = "0.00";
                document.getElementById("totalHidden").value = "0.00";
                document.getElementById("tourSelected").value = "";
                document.getElementById("tourSelected")?.removeAttribute("data-tour-id"); // Rimuovi l'attributo data-tour-id
                document.getElementById("tourField").style.display = "none";
                document.getElementById("eventSelected").value = "";
                document.getElementById("eventIdHidden").value = "";
                document.getElementById("eventField").style.display = "none";

                showSuccessMessage("✅ Prenotazione completata!", 4000);
            } else {
                // Gestisce gli errori nella sottomissione del form
                const errorMessage = result.message || "Qualcosa è andato storto sul server.";
                responseMessage.textContent = `❌ Errore: ${errorMessage}`;
                responseMessage.style.color = "#dc3545";
                showErrorMessage(`Errore di invio: ${errorMessage}`);
                const paypalPlaceholder = document.getElementById("paypalPlaceholder");
                if (paypalPlaceholder) {
                    paypalPlaceholder.innerHTML = "";
                    paypalPlaceholder.style.display = "none";
                }
            }
        } catch (error) {
            // Gestisce gli errori di rete durante l'invio del form
            responseMessage.textContent = "❌ Errore di rete o problema di risposta del server.";
            responseMessage.style.color = "#dc3545";
            console.error("❌ Errore di invio del form (blocco catch):", error);
            showErrorMessage("Errore di connessione. Controlla la tua rete.");
        }
    });

    // Aggiorna il prezzo iniziale al caricamento della pagina
    updateLivePrice();
}

// Avvia l'inizializzazione del form una volta che il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", initializeBookingForm);
document.getElementById("ownBikeCheckbox")?.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  const bikeTypeSelect = document.getElementById("bikeType");
  const quantityInput = document.getElementById("quantity");

  if (isChecked) {
    bikeTypeSelect.disabled = true;
    quantityInput.disabled = true;
  } else {
    bikeTypeSelect.disabled = false;
    quantityInput.disabled = false;
  }

  updateLivePrice(); // Ricalcola il prezzo
});
