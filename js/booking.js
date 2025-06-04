// js/booking.js

// --- Helper Functions for User Feedback ---

// Show success popup message
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

// Show error popup message
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

async function updateLivePrice() {
    const bikeTypeElement = document.getElementById("bikeType");
    const durationElement = document.getElementById("duration");
    const quantityElement = document.getElementById("quantity");
    const tourInputElement = document.getElementById("tourSelected");
    const eventInputElement = document.getElementById("eventSelected"); // Nuovo: Evento selezionato
    const eventIdHiddenElement = document.getElementById("eventIdHidden"); // Nuovo: ID evento nascosto
    const paypalPlaceholder = document.getElementById("paypalPlaceholder"); // <- QUESTA RIGA È CORRETTA

    // Get values, provide defaults if elements are not found or values are empty
    const bikeType = bikeTypeElement ? bikeTypeElement.value : '';
    const duration = durationElement ? parseFloat(durationElement.value) : 0;
    const quantity = quantityElement ? parseInt(quantityElement.value || '1') : 1;
    const tour = tourInputElement ? tourInputElement.value.trim() : null; // null if empty string
    const eventId = eventIdHiddenElement ? eventIdHiddenElement.value.trim() : null; // Nuovo: ID evento

    // Validate inputs for price calculation
    if (!bikeType || isNaN(duration) || duration <= 0 || isNaN(quantity) || quantity <= 0) {
        console.warn("⚠️ Invalid bike type, duration, or quantity for price calculation.");
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) { // <- QUESTA PARTE È CORRETTA
            paypalPlaceholder.innerHTML = ""; // Clear PayPal button
            paypalPlaceholder.style.display = "none"; // Hide placeholder
        }
        window.prezzoRisposta = null; // Clear stored price response
        return;
    }

    // Prepare data based on whether a tour or event is selected
    const data = {
        tipo: bikeType,
        giorni: duration,
        quantita: quantity,

    };

    if (tour) {
        data.tour = tour; // Se c'è un tour, includilo
        data.eventoId = null; // Assicurati che l'evento non sia incluso se c'è un tour
    } else if (eventId) {
        data.eventoId = eventId; // Se c'è un evento, includilo
        data.tour = null; // Assicurati che il tour non sia incluso se c'è un evento
    }


    try {
        const response = await fetch("https://price-calculator.zonkeynet.workers.dev/calcola", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            document.getElementById("totalAmount").textContent = result.totale;
            document.getElementById("totalHidden").value = result.totale;
            window.prezzoRisposta = result; // <- AGGIUNGI O RIPRISTINA QUESTA RIGA

            // ❌ Non mostrare subito il bottone PayPal
            if (paypalPlaceholder) { // <- AGGIUNGI QUESTO CONTROLLO E LE DUE RIGHE SOTTO
                paypalPlaceholder.innerHTML = "";
                paypalPlaceholder.style.display = "none";
            }
          } else {
            showErrorMessage(`Error calculating price: ${result.message || 'Errore sconosciuto.'}`);
            document.getElementById("totalAmount").textContent = "0.00";
            document.getElementById("totalHidden").value = "0.00";
            if (paypalPlaceholder) { // <- AGGIUNGI QUESTO CONTROLLO E LE DUE RIGHE SOTTO
                paypalPlaceholder.innerHTML = "";
                paypalPlaceholder.style.display = "none";
            }
            window.prezzoRisposta = null;

        }
    } catch (error) {
        console.error("❌ Error during price calculation:", error.message);
        showErrorMessage(`Could not calculate price: ${error.message}`);
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        document.getElementById("paypalPlaceholder").innerHTML = ""; // Non hai il controllo if qui!
        window.prezzoRisposta = null;
    }
}

// --- Form Utility Functions ---

// Robustly get input value, dispatching events to help with autofill sync
function getInputValue(id) {
    const el = document.getElementById(id);
    if (el) {
        // Dispatch 'input' and 'change' events to ensure browser's internal value
        // is synced with the DOM element's .value property, especially useful for autofill.
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return el.value.trim();
    }
    return '';
}

// Visual validation for form fields (adds/removes 'error' class)
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

function initializeBookingForm() {
    // Event listeners for live price calculation
    document.getElementById("bikeType")?.addEventListener("change", updateLivePrice);
    document.getElementById("duration")?.addEventListener("change", updateLivePrice);
    document.getElementById("quantity")?.addEventListener("input", updateLivePrice);

    // Event listeners for real-time validation feedback on required fields
    document.getElementById("name")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("email")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("date")?.addEventListener("input", (e) => validateField(e.target));

    // --- Tour Selection Logic ---
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".tour-book");
        if (!btn) return;

        e.preventDefault();

        const tourId = btn.getAttribute("data-tour-id"); // Assicurati che tour.js passi anche l'ID
        const tourName = btn.getAttribute("data-tour-name");

        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField");
        const eventInput = document.getElementById("eventSelected"); // Nuovo
        const eventIdHidden = document.getElementById("eventIdHidden"); // Nuovo
        const eventField = document.getElementById("eventField"); // Nuovo


        if (tourInput && tourField) {
            tourInput.value = tourName;
            tourInput.setAttribute("data-tour-id", tourId); // Salva l'ID del tour
            tourField.style.display = "flex";

            // ✅ Clear and hide event fields if a tour is selected
            if (eventInput && eventField && eventIdHidden) {
                eventInput.value = "";
                eventIdHidden.value = "";
                eventField.style.display = "none";
            }

            showSuccessMessage(`✅ Tour "${tourName}" aggiunto!`);
            updateLivePrice();
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // Aggiungi il pulsante 'Rimuovi Tour' dinamicamente se non già presente
    const tourInputWrapper = document.querySelector(".tour-input-wrapper");
    if (tourInputWrapper && !document.getElementById("removeTourBtn")) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.id = "removeTourBtn";
        removeBtn.innerHTML = "✖";
        removeBtn.title = "Remove tour";
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
                field.style.display = "none"; // Hide the tour field
                showSuccessMessage("❌ Tour rimosso!", 2500);
                updateLivePrice(); // Recalculate price without tour
            }
        });
        tourInputWrapper.appendChild(removeBtn);
    }

    // --- Event Selection Logic (from event.js interaction) ---
    // Listen for changes on the hidden eventIdHidden field
    document.getElementById("eventIdHidden")?.addEventListener("change", (e) => {
        // This listener is primarily for when event.js updates eventIdHidden
        // and needs booking.js to react (e.g., update price, clear tour).
        const eventId = e.target.value;
        const eventInput = document.getElementById("eventSelected");
        const eventField = document.getElementById("eventField");
        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField");

        if (eventId) {
            // An event has been selected
            if (eventInput && eventField) {
                eventField.style.display = "flex";
            }

            // ✅ Clear and hide tour fields if an event is selected
            if (tourInput && tourField) {
                tourInput.value = "";
                tourInput.removeAttribute("data-tour-id");
                tourField.style.display = "none";
            }
            updateLivePrice(); // Recalculate price with the selected event
        } else {
            // Event has been removed (or initially empty)
            if (eventInput && eventField) {
                eventInput.value = "";
                eventField.style.display = "none";
            }
            updateLivePrice(); // Recalculate price without an event
        }
    });


    // Aggiungi il pulsante 'Rimuovi Evento' dinamicamente
// Collega l'event listener al pulsante 'Rimuovi Evento' esistente nell'HTML
    const removeEventBtn = document.getElementById("removeEventBtn");
    if (removeEventBtn) { // Controlla se il pulsante esiste
        removeEventBtn.addEventListener("click", () => {
            const input = document.getElementById("eventSelected");
            const idHidden = document.getElementById("eventIdHidden");
            const field = document.getElementById("eventField");
            if (input && idHidden && field) {
                input.value = "";
                idHidden.value = ""; // Pulisci anche l'ID nascosto
                field.style.display = "none"; // Nascondi il campo dell'evento
                showSuccessMessage("❌ Evento rimosso!", 2500);
                updateLivePrice(); // Ricalcola il prezzo senza evento
            }
        });
    }

    // --- Bike Type Selection from Buttons ---
    document.querySelectorAll(".bike-select").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const bikeType = btn.getAttribute("data-bike");
            const selectElement = document.getElementById("bikeType");
            if (selectElement) {
                selectElement.value = bikeType;
                updateLivePrice();
                showSuccessMessage(`🚲 ${bikeType} selected!`, 2000);
                // Scroll to the rental form section
                document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // --- Form Submission Logic ---
    const rentalForm = document.getElementById("noleggioForm");
    if (!rentalForm) {
        console.error("❌ Form #noleggioForm not found!");
        return;
    }

    rentalForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const responseMessage = document.getElementById("responseMessage");
        responseMessage.textContent = "⏳ Invio richiesta in corso...";
        responseMessage.style.color = "#000";

        // Remove previous error styling from all fields
        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

        // Retrieve field values using the robust helper function
        const name = getInputValue("name");
        const email = getInputValue("email");
        const bikeType = getInputValue("bikeType");
        const quantity = getInputValue("quantity") || "1";
        const date = getInputValue("date");
        const duration = getInputValue("duration") || "1";
        const notes = getInputValue("notes");
        const tourSelected = getInputValue("tourSelected"); // Nome del tour
        const eventIdHidden = getInputValue("eventIdHidden"); // ID dell'evento
        const eventSelected = getInputValue("eventSelected"); // Nome dell'evento (per info)
        const total = getInputValue("totalHidden") || "0.00";

        // Client-side validation for mandatory fields
        let hasMissingFields = false;
        const requiredFields = [
            { id: "name", value: name, label: "Nome e Cognome" },
            { id: "email", value: email, label: "Email" },
            { id: "bikeType", value: bikeType, label: "Tipo di bici" },
            { id: "date", value: date, label: "Data" }
        ];

        let missingLabels = [];
        requiredFields.forEach(field => {
            if (!field.value) {
                validateField(document.getElementById(field.id)); // Apply 'error' class
                hasMissingFields = true;
                missingLabels.push(field.label);
            }
        });

        if (hasMissingFields) {
            responseMessage.textContent = `❌ Error: Please fill in all highlighted mandatory fields. Missing: ${missingLabels.join(", ")}.`;
            responseMessage.style.color = "#dc3545";
            showErrorMessage("Please complete all required fields.");
            // Focus on the first missing field for better UX
            const firstMissingField = document.getElementById(requiredFields.find(f => !f.value)?.id);
            if(firstMissingField) firstMissingField.focus();
            return;
        }

        // Construct FormData for submission to the Worker
        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("bikeType", bikeType);
        formData.set("quantity", quantity);
        formData.set("date", date);
        formData.set("duration", duration);
        formData.set("notes", notes);
        formData.set("tourSelected", tourSelected);
        formData.set("eventSelected", eventSelected); // Nuovo
        formData.set("eventIdHidden", eventIdHidden); // Nuovo
        formData.set("total", total);


        try {
            const response = await fetch("https://workers-bibbonabike.zonkeynet.workers.dev/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                responseMessage.textContent = "✅ Prenotazione inviata con successo!";
                responseMessage.style.color = "#28a745";

                // ✅ Reset campi input manualmente (non tutto il form)
                rentalForm.querySelectorAll("input, textarea, select").forEach(el => {
                    if (["bikeType", "duration", "quantity", "notes", "name", "email", "date"].includes(el.id)) {
                        el.value = "";
                    }
                });

                // Inizia la parte da modificare/controllare attentamente
                // 👇 START MODIFICA
                const paypalPlaceholder = document.getElementById("paypalPlaceholder"); // Ottieni il placeholder anche qui
                if (window.prezzoRisposta?.paypalHtml) {
                    if (paypalPlaceholder) { // Assicurati che l'elemento esista
                        paypalPlaceholder.innerHTML = window.prezzoRisposta.paypalHtml;
                        paypalPlaceholder.style.display = "block"; // Assicurati che il div sia visibile (se era nascosto con CSS)

                        // Aggiungi un messaggio per l'utente, invitandolo a pagare
                        const paymentInstruction = document.createElement("p");
                        paymentInstruction.textContent = "Per completare la prenotazione, procedi al pagamento tramite PayPal:";
                        paymentInstruction.style.marginTop = "15px";
                        paymentInstruction.style.marginBottom = "10px";
                        paymentInstruction.style.color = "#333";
                        paymentInstruction.style.fontWeight = "bold";
                        paymentInstruction.style.textAlign = "center";
                        paypalPlaceholder.prepend(paymentInstruction); // Inserisci prima del bottone PayPal
                    }
                }
                // 👆 END MODIFICA

              // Reset prezzo e campi tour/evento
              document.getElementById("totalAmount").textContent = "0.00";
              document.getElementById("totalHidden").value = "0.00";
              document.getElementById("tourSelected").value = "";
              document.getElementById("tourField").style.display = "none";
              document.getElementById("eventSelected").value = "";
              document.getElementById("eventIdHidden").value = "";
              document.getElementById("eventField").style.display = "none";

              showSuccessMessage("✅ Prenotazione completata!", 4000);
              updateLivePrice(); // Ricalcola eventuali dati


            } else {
                const errorMessage = result.message || "Something went wrong on the server.";
                responseMessage.textContent = `❌ Error: ${errorMessage}`;
                responseMessage.style.color = "#dc3545";
                showErrorMessage(`Submission error: ${errorMessage}`);
                const paypalPlaceholder = document.getElementById("paypalPlaceholder"); // Ottieni il placeholder
                  if (paypalPlaceholder) {
                      paypalPlaceholder.innerHTML = "";
                      paypalPlaceholder.style.display = "none"; // Nascondi in caso di errore
                  }
              }
            
        } catch (error) {
            responseMessage.textContent = "❌ Network error or server response issue.";
            responseMessage.style.color = "#dc3545";
            console.error("❌ Form submission error (catch block):", error);
            showErrorMessage("Connection error. Please check your network.");
        }
    });

    // Initial price update on page load
    updateLivePrice();
}

// Initialize all booking functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeBookingForm);