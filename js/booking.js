// Funzioni per la visualizzazione di messaggi di successo o errore (rimangono invariate)
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

// *** NUOVA VARIABILE GLOBALE ***
// Questa variabile memorizzerà il codice sconto applicato con successo.
let appliedDiscountCode = '';

// Funzione principale per l'aggiornamento del prezzo in tempo reale
// Aggiunto 'triggerSource' per distinguere le chiamate (es. 'discountButton' o 'auto')
async function updateLivePrice(triggerSource = 'auto') {
    let bikeTypeSelect = document.getElementById("bikeType"),
        durationInput = document.getElementById("duration"),
        quantityInput = document.getElementById("quantity"),
        tourSelectedInput = document.getElementById("tourSelected"),
        eventIdHiddenInput = document.getElementById("eventIdHidden"),
        paypalPlaceholder = document.getElementById("paypalPlaceholder"),
        ownBikeCheckbox = document.getElementById("ownBikeCheckbox")?.checked;

    // Ottieni il valore attuale dall'input del codice sconto (per il tentativo di applicazione)
    let currentInputCodiceScontoValue = document.getElementById("codiceSconto") ? document.getElementById("codiceSconto").value.trim().toUpperCase() : '';

    let bikeType = ownBikeCheckbox ? "NESSUNA" : bikeTypeSelect ? bikeTypeSelect.value : "";
    let duration = durationInput ? parseFloat(durationInput.value) : 0;
    let quantity = quantityInput ? parseInt(quantityInput.value || "1") : 1;
    let tourName = tourSelectedInput ? tourSelectedInput.value.trim() : null;
    let eventId = eventIdHiddenInput ? eventIdHiddenInput.value.trim() : null;

    // Validazione iniziale dei campi obbligatori per il calcolo
    if (!bikeType || isNaN(duration) || duration <= 0 || isNaN(quantity) || quantity <= 0) {
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = "";
            paypalPlaceholder.style.display = "none";
        }
        window.prezzoRisposta = null;
        // Se i parametri non sono validi, resettiamo lo stato del codice sconto
        appliedDiscountCode = ''; 
        updateDiscountButtonState(); // Aggiorna lo stato del pulsante
        return;
    }

    // Payload per la richiesta al Cloudflare Worker
    let payload = {
        tipo: bikeType,
        giorni: duration,
        quantita: quantity
    };

    // Inviamo il codice sconto al Worker in base a chi ha scatenato l'aggiornamento:
    if (triggerSource === 'discountButton') {
        // Se la chiamata viene dal pulsante, proviamo ad applicare il codice attualmente digitato
        payload.codiceSconto = currentInputCodiceScontoValue;
    } else {
        // Per gli aggiornamenti automatici, inviamo il codice sconto che è già stato applicato con successo
        payload.codiceSconto = appliedDiscountCode;
    }

    // Gestione degli accessori selezionati
    let accessories = Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(checkbox => checkbox.value);
    if (accessories.length > 0) {
        payload.accessories = accessories;
    }

    // Gestione di tour o eventi
    if (tourName) {
        payload.tour = tourName;
        payload.eventoId = null; 
    } else if (eventId) {
        payload.eventoId = eventId;
        payload.tour = null; 
    }

    // Messaggio di caricamento sul totale
    document.getElementById("totalAmount").textContent = "Calcolo...";
    if (paypalPlaceholder) {
        paypalPlaceholder.innerHTML = "";
        paypalPlaceholder.style.display = "none";
    }

    try {
        // Invia la richiesta al Cloudflare Worker per il calcolo del prezzo
        let response = await fetch("https://price-calculator.zonkeynet.workers.dev/calcola", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        let data = await response.json();

        if (response.ok && data.status === "success") {
            document.getElementById("totalAmount").textContent = parseFloat(data.totale).toFixed(2);
            document.getElementById("totalHidden").value = parseFloat(data.totale).toFixed(2);
            window.prezzoRisposta = data; 

            // *** LOGICA MESSAGGI SCONTO CONDIZIONALE ***
            if (triggerSource === 'discountButton') {
                if (data.scontoApplicato) {
                    appliedDiscountCode = currentInputCodiceScontoValue; // Memorizza il codice applicato con successo
                    showSuccessMessage(`Codice sconto '${currentInputCodiceScontoValue}' applicato con successo!`, 2500);
                } else {
                    // Se lo sconto non è stato applicato (e il pulsante è stato cliccato)
                    showErrorMessage(`Codice sconto '${currentInputCodiceScontoValue}' non valido o non applicabile.`, 3000);
                    appliedDiscountCode = ''; // Resetta il codice applicato se il nuovo tentativo fallisce
                }
            } else {
                // Per gli aggiornamenti automatici: se c'era un codice applicato ma ora non lo è più
                if (appliedDiscountCode && !data.scontoApplicato) {
                    showErrorMessage(`Il codice sconto '${appliedDiscountCode}' non è più valido per la selezione attuale.`, 3000);
                    appliedDiscountCode = ''; // Resetta lo stato del codice applicato
                }
                // Se lo sconto è ancora valido, non mostriamo messaggi continui.
            }
            updateDiscountButtonState(); // Aggiorna lo stato del pulsante dopo ogni calcolo
        } else {
            // Gestione degli errori di calcolo dal Worker
            showErrorMessage(`Errore nel calcolo del prezzo: ${data.message || "Errore sconosciuto."}`);
            document.getElementById("totalAmount").textContent = "0.00";
            document.getElementById("totalHidden").value = "0.00";
            if (paypalPlaceholder) {
                paypalPlaceholder.innerHTML = "";
                paypalPlaceholder.style.display = "none";
            }
            window.prezzoRisposta = null;
            appliedDiscountCode = ''; // Resetta il codice sconto applicato in caso di errore
            updateDiscountButtonState(); // Aggiorna lo stato del pulsante
        }
    } catch (error) {
        // Gestione degli errori di rete o della richiesta
        console.error("❌ Errore durante il calcolo del prezzo:", error.message);
        showErrorMessage(`Impossibile calcolare il prezzo: ${error.message}`);
        document.getElementById("totalAmount").textContent = "0.00";
        document.getElementById("totalHidden").value = "0.00";
        if (paypalPlaceholder) {
            paypalPlaceholder.innerHTML = "";
            paypalPlaceholder.style.display = "none";
        }
        window.prezzoRisposta = null;
        appliedDiscountCode = ''; // Resetta il codice sconto applicato in caso di errore di rete
        updateDiscountButtonState(); // Aggiorna lo stato del pulsante
    }
}

// *** NUOVA FUNZIONE ***
// Gestisce lo stato del campo input e del pulsante del codice sconto
function updateDiscountButtonState() {
    const codiceScontoInput = document.getElementById("codiceSconto");
    const validateDiscountButton = document.getElementById("validateDiscountBtn");

    if (!codiceScontoInput || !validateDiscountButton) return;

    if (appliedDiscountCode) {
        // Se un codice sconto è attualmente applicato
        codiceScontoInput.value = appliedDiscountCode; // Assicura che l'input mostri il codice applicato
        codiceScontoInput.disabled = true; // Disabilita il campo
        validateDiscountButton.disabled = true; // Disabilita il pulsante
        validateDiscountButton.textContent = "Applicato ✅"; // Cambia testo
        validateDiscountButton.style.backgroundColor = "#28a745"; // Colore verde per indicare applicato
        validateDiscountButton.style.cursor = "not-allowed"; // Cambia cursore
    } else {
        // Se nessun codice sconto è applicato o è stato rimosso/invalidato
        codiceScontoInput.disabled = false; // Abilita il campo
        validateDiscountButton.disabled = false; // Abilita il pulsante
        validateDiscountButton.textContent = "Applica Sconto"; // Ripristina testo
        validateDiscountButton.style.backgroundColor = "#007bff"; // Ripristina colore originale
        validateDiscountButton.style.cursor = "pointer"; // Ripristina cursore
        // Non puliamo l'input qui, se l'utente ha digitato un codice non valido, lo vede ancora.
    }
}


// Funzioni di utilità per i valori degli input e la validazione (rimangono invariate)
function getInputValue(id) {
    let element = document.getElementById(id);
    return element ? (element.dispatchEvent(new Event("input", { bubbles: true })), element.dispatchEvent(new Event("change", { bubbles: true })), element.value.trim()) : "";
}

function validateField(element) {
    if (!element) return;
    let formGroup = element.closest(".form-group");
    if (formGroup) {
        return "" === element.value.trim() ? (formGroup.classList.add("error"), false) : (formGroup.classList.remove("error"), true);
    }
}

// Funzione di inizializzazione del form di prenotazione
function initializeBookingForm() {
    // Event listeners per l'aggiornamento del prezzo in tempo reale
    // Passiamo 'auto' come triggerSource per le modifiche non dirette allo sconto
    document.getElementById("bikeType")?.addEventListener("change", () => updateLivePrice('auto'));
    document.getElementById("duration")?.addEventListener("change", () => updateLivePrice('auto'));
    document.getElementById("quantity")?.addEventListener("input", () => updateLivePrice('auto'));

    // Aggiungi il pulsante "Applica Sconto" e il suo listener, con la struttura HTML modificata
    const codiceScontoInput = document.getElementById("codiceSconto");
    if (codiceScontoInput) {
        const parentFormGroup = codiceScontoInput.closest(".form-group.icon-input"); 
        
        if (parentFormGroup) {
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

            if (iconElement && iconElement.parentNode === parentFormGroup) {
                parentFormGroup.removeChild(iconElement);
            }
            if (codiceScontoInput.parentNode === parentFormGroup) {
                parentFormGroup.removeChild(codiceScontoInput);
            }

            if (labelElement) {
                labelElement.after(inputAndButtonWrapper);
            } else {
                parentFormGroup.appendChild(inputAndButtonWrapper);
            }

            // *** Listener per il click del pulsante "Applica Sconto" ***
            validateDiscountButton.addEventListener("click", () => {
                // Quando il pulsante viene cliccato, chiamiamo updateLivePrice con 'discountButton'
                updateLivePrice('discountButton');
            });
            
            // *** Listener per l'input del codice sconto ***
            // Se l'utente svuota il campo o inizia a digitare un nuovo codice,
            // riabilitiamo il pulsante e l'input.
            codiceScontoInput.addEventListener('input', () => {
                const currentInputValue = codiceScontoInput.value.trim().toUpperCase();
                if (currentInputValue === '') {
                    // Se l'input è vuoto, nessun codice sconto è applicato
                    appliedDiscountCode = ''; 
                    updateDiscountButtonState(); // Riabilita campo e pulsante
                    updateLivePrice('auto'); // Ricalcola il prezzo senza sconto
                } else if (currentInputValue !== appliedDiscountCode) {
                    // Se l'utente sta digitando un codice diverso da quello applicato,
                    // riabilitiamo il pulsante per permettere un nuovo tentativo.
                    const validateDiscountButton = document.getElementById("validateDiscountBtn");
                    if (validateDiscountButton) {
                        validateDiscountButton.disabled = false;
                        validateDiscountButton.textContent = "Applica Sconto";
                        validateDiscountButton.style.backgroundColor = "#007bff";
                        validateDiscountButton.style.cursor = "pointer";
                    }
                    if (codiceScontoInput) {
                        codiceScontoInput.disabled = false;
                    }
                }
                // Se currentInputValue è uguale a appliedDiscountCode, non facciamo nulla.
            });
        }
    }

    Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(e => e.value);
    document.getElementById("name")?.addEventListener("input", e => validateField(e.target));
    document.getElementById("email")?.addEventListener("input", e => validateField(e.target));
    document.getElementById("date")?.addEventListener("input", e => validateField(e.target));

    document.querySelectorAll(".bike-select").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            let bikeType = button.getAttribute("data-bike");
            let bikeTypeSelect = document.getElementById("bikeType");
            if (bikeTypeSelect) {
                bikeTypeSelect.value = bikeType;
                showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
            }
            document.getElementById("accessoriesGroup").style.display = "block";
            updateLivePrice('auto'); // Passa 'auto'
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll("input[name='accessories']").forEach(checkbox => {
        checkbox.addEventListener("change", () => updateLivePrice('auto')); // Passa 'auto'
    });

    document.getElementById("bikeType")?.addEventListener("change", event => {
        let selectedBikeType = event.target.value;
        let accessoriesGroup = document.getElementById("accessoriesGroup");
        if (selectedBikeType && selectedBikeType !== "NESSUNA") {
            accessoriesGroup.style.display = "block";
        } else {
            accessoriesGroup.style.display = "none";
        }
        updateLivePrice('auto'); // Passa 'auto'
    });

    document.body.addEventListener("click", event => {
        let tourBookButton = event.target.closest(".tour-book");
        if (!tourBookButton) return;
        event.preventDefault();
        let tourId = tourBookButton.getAttribute("data-tour-id");
        let tourName = tourBookButton.getAttribute("data-tour-name");
        let tourSelectedInput = document.getElementById("tourSelected");
        let tourFieldDiv = document.getElementById("tourField");
        let eventSelectedInput = document.getElementById("eventSelected");
        let eventIdHiddenInput = document.getElementById("eventIdHidden");
        let eventFieldDiv = document.getElementById("eventField");

        if (tourSelectedInput && tourFieldDiv) {
            tourSelectedInput.value = tourName;
            tourSelectedInput.setAttribute("data-tour-id", tourId);
            tourFieldDiv.style.display = "flex";
            if (eventSelectedInput && eventFieldDiv && eventIdHiddenInput) {
                eventSelectedInput.value = "";
                eventIdHiddenInput.value = "";
                eventFieldDiv.style.display = "none";
            }
            updateLivePrice('auto'); // Passa 'auto'
            document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    // Logica per il pulsante "Rimuovi tour selezionato"
    let tourInputWrapper = document.querySelector(".tour-input-wrapper");
    if (tourInputWrapper && !document.getElementById("removeTourBtn")) {
        let removeTourButton = document.createElement("button");
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
            let tourSelectedInput = document.getElementById("tourSelected");
            let tourFieldDiv = document.getElementById("tourField");
            if (tourSelectedInput && tourFieldDiv) {
                tourSelectedInput.value = "";
                tourSelectedInput.removeAttribute("data-tour-id");
                tourFieldDiv.style.display = "none";
                showSuccessMessage("❌ Tour rimosso!", 2500);
                updateLivePrice('auto'); // Passa 'auto'
            }
        });
        tourInputWrapper.appendChild(removeTourButton);
    }

    // Gestione del cambio di evento
    document.getElementById("eventIdHidden")?.addEventListener("change", event => {
        let currentEventId = event.target.value;
        let eventSelectedInput = document.getElementById("eventSelected");
        let eventFieldDiv = document.getElementById("eventField");
        let tourSelectedInput = document.getElementById("tourSelected");
        let tourFieldDiv = document.getElementById("tourField");

        if (currentEventId) {
            if (eventSelectedInput && eventFieldDiv) {
                eventFieldDiv.style.display = "flex";
            }
            if (tourSelectedInput && tourFieldDiv) {
                tourSelectedInput.value = "";
                tourSelectedInput.removeAttribute("data-tour-id");
                tourFieldDiv.style.display = "none";
            }
            updateLivePrice('auto'); // Passa 'auto'
        } else {
            if (eventSelectedInput && eventFieldDiv) {
                eventSelectedInput.value = "";
                eventFieldDiv.style.display = "none";
            }
            updateLivePrice('auto'); // Passa 'auto'
        }
    });

    // Logica per il pulsante "Rimuovi evento selezionato"
    let eventInputWrapper = document.querySelector(".event-input-wrapper");
    if (eventInputWrapper && !document.getElementById("removeEventBtn")) {
        let removeEventButton = document.createElement("button");
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
            let eventSelectedInput = document.getElementById("eventSelected");
            let eventIdHiddenInput = document.getElementById("eventIdHidden");
            let eventFieldDiv = document.getElementById("eventField");
            if (eventSelectedInput && eventIdHiddenInput && eventFieldDiv) {
                eventSelectedInput.value = "";
                eventIdHiddenInput.value = "";
                eventFieldDiv.style.display = "none";
                showSuccessMessage("❌ Evento rimosso!", 2500);
                updateLivePrice('auto'); // Passa 'auto'
            }
        });
        eventInputWrapper.appendChild(removeEventButton);
    }

    // Nuova gestione per i pulsanti di selezione bici
    document.querySelectorAll(".bike-select").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            let bikeType = button.getAttribute("data-bike");
            let bikeTypeSelect = document.getElementById("bikeType");
            if (bikeTypeSelect) {
                bikeTypeSelect.value = bikeType;
                updateLivePrice('auto'); // Passa 'auto'
                showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
                document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Gestione del submit del form
    let noleggioForm = document.getElementById("noleggioForm");
    if (!noleggioForm) {
        console.error("❌ Form #noleggioForm non trovato!");
        return;
    }
    noleggioForm.addEventListener("submit", async event => {
        event.preventDefault();
        let responseMessage = document.getElementById("responseMessage");
        let hcaptchaToken = hcaptcha.getResponse();

        if (!hcaptchaToken) {
            showErrorMessage("⚠️ Devi completare il captcha.");
            responseMessage.textContent = "❌ Verifica il captcha prima di inviare.";
            responseMessage.style.color = "#dc3545";
            return;
        }

        responseMessage.textContent = "⏳ Invio richiesta in corso...";
        responseMessage.style.color = "#000";
        document.querySelectorAll(".form-group.error").forEach(element => element.classList.remove("error"));

        let name = getInputValue("name");
        let email = getInputValue("email");
        let ownBikeSelected = document.getElementById("ownBikeCheckbox")?.checked;
        let bikeType = ownBikeSelected ? "NESSUNA" : getInputValue("bikeType");
        let quantity = getInputValue("quantity") || "1";
        let date = getInputValue("date");
        let duration = getInputValue("duration") || "1";
        let notes = getInputValue("notes");
        let tourSelected = getInputValue("tourSelected");
        let eventIdHidden = getInputValue("eventIdHidden");
        let eventSelected = getInputValue("eventSelected");
        let total = getInputValue("totalHidden") || "0.00";

        let validationFailed = false;
        let missingFields = [];
        let fieldsToValidate = [
            { id: "name", value: name, label: "Nome e Cognome" },
            { id: "email", value: email, label: "Email" },
            { id: "bikeType", value: ownBikeSelected ? "NESSUNA" : bikeType, label: "Tipo di bici" },
            { id: "date", value: date, label: "Data" }
        ];

        fieldsToValidate.forEach(field => {
            if (!field.value) {
                validateField(document.getElementById(field.id));
                validationFailed = true;
                missingFields.push(field.label);
            }
        });

        if (validationFailed) {
            responseMessage.textContent = `❌ Errore: Compila tutti i campi obbligatori evidenziati. Mancanti: ${missingFields.join(", ")}.`;
            responseMessage.style.color = "#dc3545";
            showErrorMessage("Completa tutti i campi richiesti.");
            let firstMissingElement = document.getElementById(fieldsToValidate.find(field => !field.value)?.id);
            if (firstMissingElement) firstMissingElement.focus();
            return;
        }

        let formData = new FormData();
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

        // Includi il codice sconto applicato al momento del submit
        formData.set("codiceScontoApplicato", appliedDiscountCode);


        let accessoriesChecked = Array.from(document.querySelectorAll("input[name='accessories']:checked")).map(checkbox => checkbox.value);
        formData.set("accessories", accessoriesChecked.join(", "));
        formData.set("hcaptchaToken", hcaptchaToken);

        try {
            let submitResponse = await fetch("https://workers-bibbonabike.zonkeynet.workers.dev/submit", {
                method: "POST",
                body: formData
            });

            let submitData = await submitResponse.json();

            if (submitResponse.ok && submitData.status === "success") {
                responseMessage.textContent = "✅ Prenotazione inviata con successo!";
                responseMessage.style.color = "#28a745";
                // Resetta i campi del form dopo l'invio
                noleggioForm.querySelectorAll("input, textarea, select").forEach(element => {
                    if (["bikeType", "duration", "quantity", "notes", "name", "email", "date"].includes(element.id)) {
                        element.value = "";
                    }
                });

                let paypalContainer = document.getElementById("paypalPlaceholder");
                // Qui è dove il pulsante PayPal viene finalmente mostrato
                if (window.prezzoRisposta?.paypalHtml && paypalContainer) {
                    paypalContainer.innerHTML = window.prezzoRisposta.paypalHtml;
                    paypalContainer.style.display = "block";
                    let paypalInstructions = document.createElement("p");
                    paypalInstructions.textContent = "Per completare la prenotazione, procedi al pagamento tramite PayPal:";
                    Object.assign(paypalInstructions.style, {
                        marginTop: "15px",
                        marginBottom: "10px",
                        color: "#333",
                        fontWeight: "bold",
                        textAlign: "center"
                    });
                    paypalContainer.prepend(paypalInstructions);
                }

                // Resetta visualizzazioni aggiuntive
                document.getElementById("totalAmount").textContent = "0.00";
                document.getElementById("totalHidden").value = "0.00";
                document.getElementById("tourSelected").value = "";
                document.getElementById("tourSelected")?.removeAttribute("data-tour-id");
                document.getElementById("tourField").style.display = "none";
                document.getElementById("eventSelected").value = "";
                document.getElementById("eventIdHidden").value = "";
                document.getElementById("eventField").style.display = "none";
                
                // Resetta anche lo stato del codice sconto dopo il submit
                appliedDiscountCode = '';
                updateDiscountButtonState();


                showSuccessMessage("✅ Prenotazione completata!", 4000);
            } else {
                let errorMessage = submitData.message || "Qualcosa è andato storto sul server.";
                responseMessage.textContent = `❌ Errore: ${errorMessage}`;
                responseMessage.style.color = "#dc3545";
                showErrorMessage(`Errore di invio: ${errorMessage}`);
                let paypalContainer = document.getElementById("paypalPlaceholder");
                if (paypalContainer) {
                    paypalContainer.innerHTML = "";
                    paypalContainer.style.display = "none";
                }
            }
        } catch (error) {
            responseMessage.textContent = "❌ Errore di rete o problema di risposta del server.";
            responseMessage.style.color = "#dc3545";
            console.error("❌ Errore di invio del form (blocco catch):", error);
            showErrorMessage("Errore di connessione. Controlla la tua rete.");
        }
    });

    // Esegui un calcolo iniziale al caricamento della pagina
    updateLivePrice('auto');
    // Chiamata iniziale per impostare lo stato corretto del pulsante
    updateDiscountButtonState(); 
}

// Inizializza il form quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", initializeBookingForm);

// Gestione della checkbox "Ho la mia bici" (rimane invariata)
document.getElementById("ownBikeCheckbox")?.addEventListener("change", event => {
    let isChecked = event.target.checked;
    let bikeTypeSelect = document.getElementById("bikeType");
    let quantityInput = document.getElementById("quantity");

    if (isChecked) {
        bikeTypeSelect.disabled = true;
        quantityInput.disabled = true;
    } else {
        bikeTypeSelect.disabled = false;
        quantityInput.disabled = false;
    }
    updateLivePrice('auto'); // Ricalcola il prezzo se lo stato della checkbox cambia
});