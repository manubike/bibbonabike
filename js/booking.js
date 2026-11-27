// Funzioni per la visualizzazione di messaggi di successo o errore
function showSuccessMessage(message, duration = 3000) {
    let messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    Object.assign(messageDiv.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#28a745",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        zIndex: "9999",
        transition: "opacity 0.3s ease-in-out",
        opacity: "1"
    });
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.opacity = "0";
        setTimeout(() => messageDiv.remove(), 300);
    }, duration);
}

function showErrorMessage(message, duration = 4000) {
    let messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    Object.assign(messageDiv.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#dc3545",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        zIndex: "9999",
        transition: "opacity 0.3s ease-in-out",
        opacity: "1"
    });
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.opacity = "0";
        setTimeout(() => messageDiv.remove(), 300);
    }, duration);
}

// Memorizza il codice sconto applicato con successo
let appliedDiscountCode = '';

// Calcola il prezzo in tempo reale tramite Cloudflare Worker
async function updateLivePrice(triggerSource = 'auto') {
    const bikeTypeSelect = document.getElementById("bikeType");
    const durationInput = document.getElementById("duration");
    const quantityInput = document.getElementById("quantity");
    const tourSelectedInput = document.getElementById("tourSelected");
    const eventIdHiddenInput = document.getElementById("eventIdHidden");
    const ownBikeCheckbox = document.getElementById("ownBikeCheckbox")?.checked;
    const codiceScontoEl = document.getElementById("codiceSconto");
    const totalAmountEl = document.getElementById("totalAmount");
    const totalHiddenEl = document.getElementById("totalHidden");

    const currentInputCodiceScontoValue = codiceScontoEl ? codiceScontoEl.value.trim().toUpperCase() : '';
    const bikeType = ownBikeCheckbox ? "NESSUNA" : (bikeTypeSelect ? bikeTypeSelect.value : "");
    const duration = durationInput ? parseFloat(durationInput.value) : 0;
    const quantity = quantityInput ? parseInt(quantityInput.value || "1", 10) : 1;
    const tourName = tourSelectedInput ? tourSelectedInput.value.trim() : null;
    const eventId = eventIdHiddenInput ? eventIdHiddenInput.value.trim() : null;

    if (!bikeType || isNaN(duration) || duration <= 0 || isNaN(quantity) || quantity <= 0) {
        if (totalAmountEl) totalAmountEl.textContent = "0.00";
        if (totalHiddenEl) totalHiddenEl.value = "0.00";
        window.prezzoRisposta = null;
        appliedDiscountCode = '';
        updateDiscountButtonState();
        return;
    }

    const payload = {
        tipo: bikeType,
        giorni: duration,
        quantita: quantity
    };

    if (triggerSource === 'discountButton') {
        payload.codiceSconto = currentInputCodiceScontoValue;
    } else {
        payload.codiceSconto = appliedDiscountCode;
    }

    const accessories = Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(cb => cb.value);
    if (accessories.length > 0) {
        payload.accessories = accessories;
    }

    if (tourName) {
        payload.tour = tourName;
        payload.eventoId = null;
    } else if (eventId) {
        payload.eventoId = eventId;
        payload.tour = null;
    }

    if (totalAmountEl) totalAmountEl.textContent = "Calcolo...";

    try {
        const response = await fetch("https://bibbonabike-booking.vitiellomanuel1985.workers.dev/calcola", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            const formattedTotal = parseFloat(data.totale).toFixed(2);
            if (totalAmountEl) totalAmountEl.textContent = formattedTotal;
            if (totalHiddenEl) totalHiddenEl.value = formattedTotal;
            window.prezzoRisposta = data;

            if (triggerSource === 'discountButton') {
                if (data.scontoApplicato) {
                    appliedDiscountCode = currentInputCodiceScontoValue;
                    showSuccessMessage(`Codice sconto '${currentInputCodiceScontoValue}' applicato con successo!`, 2500);
                } else {
                    showErrorMessage(`Codice sconto '${currentInputCodiceScontoValue}' non valido o non applicabile.`, 3000);
                    appliedDiscountCode = '';
                }
            } else if (appliedDiscountCode && !data.scontoApplicato) {
                showErrorMessage(`Il codice sconto '${appliedDiscountCode}' non è più valido per la selezione attuale.`, 3000);
                appliedDiscountCode = '';
            }
            updateDiscountButtonState();
        } else {
            showErrorMessage(`Errore nel calcolo del prezzo: ${data.message || "Errore sconosciuto."}`);
            if (totalAmountEl) totalAmountEl.textContent = "0.00";
            if (totalHiddenEl) totalHiddenEl.value = "0.00";
            window.prezzoRisposta = null;
            appliedDiscountCode = '';
            updateDiscountButtonState();
        }
    } catch (error) {
        console.error("❌ Errore durante il calcolo del prezzo:", error.message);
        showErrorMessage(`Impossibile calcolare il prezzo: ${error.message}`);
        if (totalAmountEl) totalAmountEl.textContent = "0.00";
        if (totalHiddenEl) totalHiddenEl.value = "0.00";
        window.prezzoRisposta = null;
        appliedDiscountCode = '';
        updateDiscountButtonState();
    }
}

// Gestisce lo stato del campo input e del pulsante del codice sconto
function updateDiscountButtonState() {
    const codiceScontoInput = document.getElementById("codiceSconto");
    const validateDiscountButton = document.getElementById("validateDiscountBtn");

    if (!codiceScontoInput || !validateDiscountButton) return;

    if (appliedDiscountCode) {
        codiceScontoInput.value = appliedDiscountCode;
        codiceScontoInput.disabled = true;
        validateDiscountButton.disabled = true;
        validateDiscountButton.textContent = "Applicato ✅";
        validateDiscountButton.style.backgroundColor = "#28a745";
        validateDiscountButton.style.cursor = "not-allowed";
    } else {
        codiceScontoInput.disabled = false;
        validateDiscountButton.disabled = false;
        validateDiscountButton.textContent = "Applica Sconto";
        validateDiscountButton.style.backgroundColor = "#007bff";
        validateDiscountButton.style.cursor = "pointer";
    }
}

function getInputValue(id) {
    const element = document.getElementById(id);
    if (!element) return "";
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return element.value.trim();
}

function validateField(element) {
    if (!element) return false;
    const formGroup = element.closest(".form-group");
    const isEmpty = element.value.trim() === "";
    if (formGroup) {
        formGroup.classList.toggle("error", isEmpty);
    }
    return !isEmpty;
}

function initializeBookingForm() {
    document.getElementById("bikeType")?.addEventListener("change", event => {
        const selectedBikeType = event.target.value;
        const accessoriesGroup = document.getElementById("accessoriesGroup");
        if (accessoriesGroup) {
            accessoriesGroup.style.display = (selectedBikeType && selectedBikeType !== "NESSUNA") ? "block" : "none";
        }
        updateLivePrice('auto');
    });

    document.getElementById("duration")?.addEventListener("change", () => updateLivePrice('auto'));
    document.getElementById("quantity")?.addEventListener("input", () => updateLivePrice('auto'));

    const codiceScontoInput = document.getElementById("codiceSconto");
    if (codiceScontoInput) {
        const parentFormGroup = codiceScontoInput.closest(".form-group.icon-input");
        if (parentFormGroup && !document.getElementById("validateDiscountBtn")) {
            const iconElement = parentFormGroup.querySelector(".fas.fa-tag");
            const inputAndButtonWrapper = document.createElement("div");
            inputAndButtonWrapper.classList.add("codice-sconto-input-wrapper");

            if (iconElement) {
                inputAndButtonWrapper.appendChild(iconElement);
            }
            inputAndButtonWrapper.appendChild(codiceScontoInput);

            const validateDiscountButton = document.createElement("button");
            validateDiscountButton.type = "button";
            validateDiscountButton.id = "validateDiscountBtn";
            validateDiscountButton.textContent = "Applica Sconto";
            Object.assign(validateDiscountButton.style, {
                padding: "8px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.9rem",
                flexShrink: "0"
            });
            inputAndButtonWrapper.appendChild(validateDiscountButton);

            const labelElement = parentFormGroup.querySelector("label[for='codiceSconto']");
            if (labelElement) {
                labelElement.after(inputAndButtonWrapper);
            } else {
                parentFormGroup.appendChild(inputAndButtonWrapper);
            }

            validateDiscountButton.addEventListener("click", () => {
                updateLivePrice('discountButton');
            });

            codiceScontoInput.addEventListener('input', () => {
                const currentInputValue = codiceScontoInput.value.trim().toUpperCase();
                if (currentInputValue === '') {
                    appliedDiscountCode = '';
                    updateDiscountButtonState();
                    updateLivePrice('auto');
                } else if (currentInputValue !== appliedDiscountCode) {
                    validateDiscountButton.disabled = false;
                    validateDiscountButton.textContent = "Applica Sconto";
                    validateDiscountButton.style.backgroundColor = "#007bff";
                    validateDiscountButton.style.cursor = "pointer";
                    codiceScontoInput.disabled = false;
                }
            });
        }
    }

    document.getElementById("name")?.addEventListener("input", e => validateField(e.target));
    document.getElementById("email")?.addEventListener("input", e => validateField(e.target));
    document.getElementById("phone")?.addEventListener("input", e => validateField(e.target));
    document.getElementById("date")?.addEventListener("input", e => validateField(e.target));

    // Singolo listener pulito per i pulsanti di selezione bici
    document.querySelectorAll(".bike-select").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            const bikeType = button.getAttribute("data-bike");
            const bikeTypeSelect = document.getElementById("bikeType");
            const accessoriesGroup = document.getElementById("accessoriesGroup");
            if (bikeTypeSelect && bikeType) {
                bikeTypeSelect.value = bikeType;
                if (accessoriesGroup) {
                    accessoriesGroup.style.display = bikeType !== "NESSUNA" ? "block" : "none";
                }
                showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
                updateLivePrice('auto');
            }
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll("input[name='accessories']").forEach(checkbox => {
        checkbox.addEventListener("change", () => updateLivePrice('auto'));
    });

    document.body.addEventListener("click", event => {
        const tourBookButton = event.target.closest(".tour-book");
        if (!tourBookButton) return;
        event.preventDefault();
        const tourId = tourBookButton.getAttribute("data-tour-id");
        const tourName = tourBookButton.getAttribute("data-tour-name");
        const tourSelectedInput = document.getElementById("tourSelected");
        const tourFieldDiv = document.getElementById("tourField");
        const eventSelectedInput = document.getElementById("eventSelected");
        const eventIdHiddenInput = document.getElementById("eventIdHidden");
        const eventFieldDiv = document.getElementById("eventField");

        if (tourSelectedInput && tourFieldDiv) {
            tourSelectedInput.value = tourName;
            tourSelectedInput.setAttribute("data-tour-id", tourId);
            tourFieldDiv.style.display = "flex";
            if (eventSelectedInput && eventFieldDiv && eventIdHiddenInput) {
                eventSelectedInput.value = "";
                eventIdHiddenInput.value = "";
                eventFieldDiv.style.display = "none";
            }
            updateLivePrice('auto');
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    const tourInputWrapper = document.querySelector(".tour-input-wrapper");
    if (tourInputWrapper && !document.getElementById("removeTourBtn")) {
        const removeTourButton = document.createElement("button");
        removeTourButton.type = "button";
        removeTourButton.id = "removeTourBtn";
        removeTourButton.innerHTML = "✖";
        removeTourButton.title = "Rimuovi tour selezionato";
        Object.assign(removeTourButton.style, {
            marginLeft: "10px",
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#dc3545"
        });
        removeTourButton.addEventListener("click", () => {
            const tourSelectedInput = document.getElementById("tourSelected");
            const tourFieldDiv = document.getElementById("tourField");
            if (tourSelectedInput && tourFieldDiv) {
                tourSelectedInput.value = "";
                tourSelectedInput.removeAttribute("data-tour-id");
                tourFieldDiv.style.display = "none";
                showSuccessMessage("❌ Tour rimosso!", 2500);
                updateLivePrice('auto');
            }
        });
        tourInputWrapper.appendChild(removeTourButton);
    }

    document.getElementById("eventIdHidden")?.addEventListener("change", event => {
        const currentEventId = event.target.value;
        const eventSelectedInput = document.getElementById("eventSelected");
        const eventFieldDiv = document.getElementById("eventField");
        const tourSelectedInput = document.getElementById("tourSelected");
        const tourFieldDiv = document.getElementById("tourField");

        if (currentEventId) {
            if (eventSelectedInput && eventFieldDiv) {
                eventFieldDiv.style.display = "flex";
            }
            if (tourSelectedInput && tourFieldDiv) {
                tourSelectedInput.value = "";
                tourSelectedInput.removeAttribute("data-tour-id");
                tourFieldDiv.style.display = "none";
            }
        } else if (eventSelectedInput && eventFieldDiv) {
            eventSelectedInput.value = "";
            eventFieldDiv.style.display = "none";
        }
        updateLivePrice('auto');
    });

    const eventInputWrapper = document.querySelector(".event-input-wrapper");
    if (eventInputWrapper && !document.getElementById("removeEventBtn")) {
        const removeEventButton = document.createElement("button");
        removeEventButton.type = "button";
        removeEventButton.id = "removeEventBtn";
        removeEventButton.innerHTML = "✖";
        removeEventButton.title = "Rimuovi evento selezionato";
        Object.assign(removeEventButton.style, {
            marginLeft: "10px",
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#dc3545"
        });
        removeEventButton.addEventListener("click", () => {
            const eventSelectedInput = document.getElementById("eventSelected");
            const eventIdHiddenInput = document.getElementById("eventIdHidden");
            const eventFieldDiv = document.getElementById("eventField");
            if (eventSelectedInput && eventIdHiddenInput && eventFieldDiv) {
                eventSelectedInput.value = "";
                eventIdHiddenInput.value = "";
                eventFieldDiv.style.display = "none";
                showSuccessMessage("❌ Evento rimosso!", 2500);
                updateLivePrice('auto');
            }
        });
        eventInputWrapper.appendChild(removeEventButton);
    }

    const noleggioForm = document.getElementById("noleggioForm");
    if (!noleggioForm) {
        console.error("❌ Form #noleggioForm non trovato!");
        return;
    }

    noleggioForm.addEventListener("submit", async event => {
        event.preventDefault();
        const responseMessage = document.getElementById("responseMessage");
        const hcaptchaToken = typeof hcaptcha !== "undefined" ? hcaptcha.getResponse() : "";

        if (!hcaptchaToken) {
            showErrorMessage("⚠️ Devi completare il captcha.");
            if (responseMessage) {
                responseMessage.textContent = "❌ Verifica il captcha prima di inviare.";
                responseMessage.style.color = "#dc3545";
            }
            return;
        }

        if (responseMessage) {
            responseMessage.textContent = "⏳ Invio richiesta in corso...";
            responseMessage.style.color = "#000";
        }
        document.querySelectorAll(".form-group.error").forEach(el => el.classList.remove("error"));

        const name = getInputValue("name");
        const email = getInputValue("email");
        const phone = getInputValue("phone");
        const ownBikeSelected = document.getElementById("ownBikeCheckbox")?.checked;
        const bikeType = ownBikeSelected ? "NESSUNA" : getInputValue("bikeType");
        const quantity = getInputValue("quantity") || "1";
        const date = getInputValue("date");
        const duration = getInputValue("duration") || "1";
        const notes = getInputValue("notes");
        const tourSelected = getInputValue("tourSelected");
        const eventIdHidden = getInputValue("eventIdHidden");
        const eventSelected = getInputValue("eventSelected");
        const total = getInputValue("totalHidden") || "0.00";

        const fieldsToValidate = [
            { id: "name", value: name, label: "Nome e Cognome" },
            { id: "email", value: email, label: "Email" },
            { id: "phone", value: phone, label: "Numero di telefono" },
            { id: "bikeType", value: ownBikeSelected ? "NESSUNA" : bikeType, label: "Tipo di bici" },
            { id: "date", value: date, label: "Data" }
        ];

        const missingFields = [];
        fieldsToValidate.forEach(field => {
            if (!validateField(document.getElementById(field.id))) {
                missingFields.push(field.label);
            }
        });

        if (missingFields.length > 0) {
            if (responseMessage) {
                responseMessage.textContent = `❌ Errore: Compila tutti i campi obbligatori evidenziati. Mancanti: ${missingFields.join(", ")}.`;
                responseMessage.style.color = "#dc3545";
            }
            showErrorMessage("Completa tutti i campi richiesti.");
            const firstMissingId = fieldsToValidate.find(field => !field.value)?.id;
            if (firstMissingId) {
                document.getElementById(firstMissingId)?.focus();
            }
            return;
        }

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("phone", phone);
        formData.set("bikeType", bikeType);
        formData.set("quantity", quantity);
        formData.set("date", date);
        formData.set("duration", duration);
        formData.set("notes", notes);
        formData.set("tourSelected", tourSelected);
        formData.set("eventSelected", eventSelected);
        formData.set("eventIdHidden", eventIdHidden);
        formData.set("total", total);
        formData.set("codiceScontoApplicato", appliedDiscountCode);

        const accessoriesChecked = Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(cb => cb.value);
        formData.set("accessories", accessoriesChecked.join(", "));
        formData.set("hcaptchaToken", hcaptchaToken);

        try {
            const submitResponse = await fetch("https://bibbonabike-booking.vitiellomanuel1985.workers.dev/submit", {
                method: "POST",
                body: formData
            });

            const submitData = await submitResponse.json();

            if (submitResponse.ok && submitData.status === "success") {
                if (responseMessage) {
                    responseMessage.textContent = "✅ Prenotazione inviata con successo!";
                    responseMessage.style.color = "#28a745";
                }

                noleggioForm.querySelectorAll("input, textarea, select").forEach(element => {
                    if (["bikeType", "duration", "quantity", "notes", "name", "email", "phone", "date", "codiceSconto"].includes(element.id)) {
                        element.value = "";
                    }
                    if (element.type === "checkbox") {
                        element.checked = false;
                    }
                });

                const totalAmountEl = document.getElementById("totalAmount");
                const totalHiddenEl = document.getElementById("totalHidden");
                if (totalAmountEl) totalAmountEl.textContent = "0.00";
                if (totalHiddenEl) totalHiddenEl.value = "0.00";

                const tourSelectedEl = document.getElementById("tourSelected");
                const tourFieldEl = document.getElementById("tourField");
                if (tourSelectedEl) {
                    tourSelectedEl.value = "";
                    tourSelectedEl.removeAttribute("data-tour-id");
                }
                if (tourFieldEl) tourFieldEl.style.display = "none";

                const eventSelectedEl = document.getElementById("eventSelected");
                const eventIdHiddenEl = document.getElementById("eventIdHidden");
                const eventFieldEl = document.getElementById("eventField");
                if (eventSelectedEl) eventSelectedEl.value = "";
                if (eventIdHiddenEl) eventIdHiddenEl.value = "";
                if (eventFieldEl) eventFieldEl.style.display = "none";

                appliedDiscountCode = '';
                updateDiscountButtonState();

                if (typeof hcaptcha !== "undefined" && typeof hcaptcha.reset === "function") {
                    hcaptcha.reset();
                }

                showSuccessMessage("✅ Prenotazione completata!", 4000);
            } else {
                const errorMessage = submitData.message || "Qualcosa è andato storto sul server.";
                if (responseMessage) {
                    responseMessage.textContent = `❌ Errore: ${errorMessage}`;
                    responseMessage.style.color = "#dc3545";
                }
                showErrorMessage(`Errore di invio: ${errorMessage}`);
            }
        } catch (error) {
            if (responseMessage) {
                responseMessage.textContent = "❌ Errore di rete o problema di risposta del server.";
                responseMessage.style.color = "#dc3545";
            }
            console.error("❌ Errore di invio del form (blocco catch):", error);
            showErrorMessage("Errore di connessione. Controlla la tua rete.");
        }
    });

    updateLivePrice('auto');
    updateDiscountButtonState();
}

document.addEventListener("DOMContentLoaded", initializeBookingForm);

document.getElementById("ownBikeCheckbox")?.addEventListener("change", event => {
    const isChecked = event.target.checked;
    const bikeTypeSelect = document.getElementById("bikeType");
    const quantityInput = document.getElementById("quantity");

    if (bikeTypeSelect) bikeTypeSelect.disabled = isChecked;
    if (quantityInput) quantityInput.disabled = isChecked;
    updateLivePrice('auto');
});
