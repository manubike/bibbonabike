// js/booking.js

// --- Helper Functions for User Feedback ---
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

async function updateLivePrice() {
    const bikeTypeElement = document.getElementById("bikeType");
    const durationElement = document.getElementById("duration");
    const quantityElement = document.getElementById("quantity");
    const tourInputElement = document.getElementById("tourSelected");
    const eventInputElement = document.getElementById("eventSelected");
    const eventIdHiddenElement = document.getElementById("eventIdHidden");
    const paypalPlaceholder = document.getElementById("paypalPlaceholder");

    const bikeType = bikeTypeElement ? bikeTypeElement.value : '';
    const duration = durationElement ? parseFloat(durationElement.value) : 0;
    const quantity = quantityElement ? parseInt(quantityElement.value || '1') : 1;
    const tour = tourInputElement ? tourInputElement.value.trim() : null;
    const eventId = eventIdHiddenElement ? eventIdHiddenElement.value.trim() : null;

    if (!bikeType || isNaN(duration) || duration <= 0 || isNaN(quantity) || quantity <= 0) {
        console.warn("⚠️ Invalid bike type, duration, or quantity for price calculation.");
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = ""; // Clear PayPal button
            paypalPlaceholder.style.display = "none"; // Hide placeholder
        }
        window.prezzoRisposta = null; // Clear stored price response
        return;
    }

    const data = {
        tipo: bikeType,
        giorni: duration,
        quantita: quantity,
    };

    if (tour) {
        data.tour = tour;
        data.eventoId = null;
    } else if (eventId) {
        data.eventoId = eventId;
        data.tour = null;
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
            window.prezzoRisposta = result; // Mantiene la risposta del worker

            // ❌ Rimosso: Non nascondere il bottone PayPal qui in caso di successo
            // Questo è stato spostato alla logica di invio del form
            // if (paypalPlaceholder) {
            //     paypalPlaceholder.innerHTML = "";
            //     paypalPlaceholder.style.display = "none";
            // }

        } else {
            showErrorMessage(`Error calculating price: ${result.message || 'Errore sconosciuto.'}`);
            document.getElementById("totalAmount").textContent = "0.00";
            document.getElementById("totalHidden").value = "0.00";
            if (paypalPlaceholder) {
                paypalPlaceholder.innerHTML = "";
                paypalPlaceholder.style.display = "none"; // Nascondi in caso di errore nel calcolo
            }
            window.prezzoRisposta = null;
        }
    } catch (error) {
        console.error("❌ Error during price calculation:", error.message);
        showErrorMessage(`Could not calculate price: ${error.message}`);
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        // Aggiungi il controllo if anche qui per consistenza
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = "";
            paypalPlaceholder.style.display = "none";
        }
        window.prezzoRisposta = null;
    }
}

// --- Form Utility Functions (rimaste invariate) ---

function getInputValue(id) {
    const el = document.getElementById(id);
    if (el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return el.value.trim();
    }
    return '';
}

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
    document.getElementById("bikeType")?.addEventListener("change", updateLivePrice);
    document.getElementById("duration")?.addEventListener("change", updateLivePrice);
    document.getElementById("quantity")?.addEventListener("input", updateLivePrice);

    document.getElementById("name")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("email")?.addEventListener("input", (e) => validateField(e.target));
    document.getElementById("date")?.addEventListener("input", (e) => validateField(e.target));

    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".tour-book");
        if (!btn) return;

        e.preventDefault();

        const tourId = btn.getAttribute("data-tour-id");
        const tourName = btn.getAttribute("data-tour-name");

        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField");
        const eventInput = document.getElementById("eventSelected");
        const eventIdHidden = document.getElementById("eventIdHidden");
        const eventField = document.getElementById("eventField");

        if (tourInput && tourField) {
            tourInput.value = tourName;
            tourInput.setAttribute("data-tour-id", tourId);
            tourField.style.display = "flex";

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
                field.style.display = "none";
                showSuccessMessage("❌ Tour rimosso!", 2500);
                updateLivePrice();
            }
        });
        tourInputWrapper.appendChild(removeBtn);
    }

    document.getElementById("eventIdHidden")?.addEventListener("change", (e) => {
        const eventId = e.target.value;
        const eventInput = document.getElementById("eventSelected");
        const eventField = document.getElementById("eventField");
        const tourInput = document.getElementById("tourSelected");
        const tourField = document.getElementById("tourField");

        if (eventId) {
            if (eventInput && eventField) {
                eventField.style.display = "flex";
            }

            if (tourInput && tourField) {
                tourInput.value = "";
                tourInput.removeAttribute("data-tour-id");
                tourField.style.display = "none";
            }
            updateLivePrice();
        } else {
            if (eventInput && eventField) {
                eventInput.value = "";
                eventField.style.display = "none";
            }
            updateLivePrice();
        }
    });

    const removeEventBtn = document.getElementById("removeEventBtn");
    if (removeEventBtn) {
        removeEventBtn.addEventListener("click", () => {
            const input = document.getElementById("eventSelected");
            const idHidden = document.getElementById("eventIdHidden");
            const field = document.getElementById("eventField");
            if (input && idHidden && field) {
                input.value = "";
                idHidden.value = "";
                field.style.display = "none";
                showSuccessMessage("❌ Evento rimosso!", 2500);
                updateLivePrice();
            }
        });
    }

    document.querySelectorAll(".bike-select").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const bikeType = btn.getAttribute("data-bike");
            const selectElement = document.getElementById("bikeType");
            if (selectElement) {
                selectElement.value = bikeType;
                updateLivePrice();
                showSuccessMessage(`🚲 ${bikeType} selected!`, 2000);
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

        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

        const name = getInputValue("name");
        const email = getInputValue("email");
        const bikeType = getInputValue("bikeType");
        const quantity = getInputValue("quantity") || "1";
        const date = getInputValue("date");
        const duration = getInputValue("duration") || "1";
        const notes = getInputValue("notes");
        const tourSelected = getInputValue("tourSelected");
        const eventIdHidden = getInputValue("eventIdHidden");
        const eventSelected = getInputValue("eventSelected");
        const total = getInputValue("totalHidden") || "0.00";

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
                validateField(document.getElementById(field.id));
                hasMissingFields = true;
                missingLabels.push(field.label);
            }
        });

        if (hasMissingFields) {
            responseMessage.textContent = `❌ Error: Please fill in all highlighted mandatory fields. Missing: ${missingLabels.join(", ")}.`;
            responseMessage.style.color = "#dc3545";
            showErrorMessage("Please complete all required fields.");
            const firstMissingField = document.getElementById(requiredFields.find(f => !f.value)?.id);
            if(firstMissingField) firstMissingField.focus();
            return;
        }

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("bikeType", bikeType);
        formData.set("quantity", quantity);
        formData.set("date", date);
        formData.set("duration", duration);
        formData.set("notes", notes);
        formData.set("tourSelected", tourSelected);
        formData.set("eventSelected", eventSelected);
        formData.set("eventIdHidden", eventIdHidden);
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

                // Reset campi input manualmente (non tutto il form)
                rentalForm.querySelectorAll("input, textarea, select").forEach(el => {
                    if (["bikeType", "duration", "quantity", "notes", "name", "email", "date"].includes(el.id)) {
                        el.value = "";
                    }
                });

                // 👇 START MODIFICA: Ora questo blocco visualizza il pulsante PayPal
                const paypalPlaceholder = document.getElementById("paypalPlaceholder");
                if (window.prezzoRisposta?.paypalHtml) {
                    if (paypalPlaceholder) {
                        paypalPlaceholder.innerHTML = window.prezzoRisposta.paypalHtml;
                        paypalPlaceholder.style.display = "block"; // Assicurati che il div sia visibile

                        const paymentInstruction = document.createElement("p");
                        paymentInstruction.textContent = "Per completare la prenotazione, procedi al pagamento tramite PayPal:";
                        paymentInstruction.style.marginTop = "15px";
                        paymentInstruction.style.marginBottom = "10px";
                        paymentInstruction.style.color = "#333";
                        paymentInstruction.style.fontWeight = "bold";
                        paymentInstruction.style.textAlign = "center";
                        paypalPlaceholder.prepend(paymentInstruction);
                    }
                }
                // 👆 END MODIFICA

                // Reset prezzo e campi tour/evento (questi reset vanno bene)
                document.getElementById("totalAmount").textContent = "0.00";
                document.getElementById("totalHidden").value = "0.00";
                document.getElementById("tourSelected").value = "";
                document.getElementById("tourField").style.display = "none";
                document.getElementById("eventSelected").value = "";
                document.getElementById("eventIdHidden").value = "";
                document.getElementById("eventField").style.display = "none";

                showSuccessMessage("✅ Prenotazione completata!", 4000);
                // ❌ Rimosso: Non chiamare updateLivePrice() qui, altrimenti nasconde di nuovo il pulsante PayPal
                // updateLivePrice();

            } else {
                const errorMessage = result.message || "Something went wrong on the server.";
                responseMessage.textContent = `❌ Error: ${errorMessage}`;
                responseMessage.style.color = "#dc3545";
                showErrorMessage(`Submission error: ${errorMessage}`);
                const paypalPlaceholder = document.getElementById("paypalPlaceholder");
                if (paypalPlaceholder) {
                    paypalPlaceholder.innerHTML = "";
                    paypalPlaceholder.style.display = "none";
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

document.addEventListener("DOMContentLoaded", initializeBookingForm);