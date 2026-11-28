// ============================================================
// MAGONA BIKE GARAGE - GESTIONE FORM PRENOTAZIONE (booking.js)
// Compatibile con Google Apps Script + Verifica Email OTP
// ============================================================

function showSuccessMessage(message, duration = 3000) {
  const existing = document.getElementById("bibbonaToastMsg");
  if (existing) existing.remove();

  const messageDiv = document.createElement("div");
  messageDiv.id = "bibbonaToastMsg";
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
    boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
    zIndex: "9999",
    transition: "opacity 0.3s ease-in-out",
    opacity: "1",
    maxWidth: "90vw",
    textAlign: "center"
  });
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

function showErrorMessage(message, duration = 4000) {
  const existing = document.getElementById("bibbonaToastMsg");
  if (existing) existing.remove();

  const messageDiv = document.createElement("div");
  messageDiv.id = "bibbonaToastMsg";
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
    boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
    zIndex: "9999",
    transition: "opacity 0.3s ease-in-out",
    opacity: "1",
    maxWidth: "90vw",
    textAlign: "center"
  });
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

let appliedDiscountCode = "";

const BOOKING_DISCOUNTS = {
  MAGONA10: 10,
  BIBBONA10: 10
};

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

function updateLivePrice(triggerSource = "auto") {
  const bikeTypeSelect = document.getElementById("bikeType");
  const durationInput = document.getElementById("duration");
  const quantityInput = document.getElementById("quantity");
  const ownBikeCheckbox = document.getElementById("ownBikeCheckbox")?.checked;
  const codiceScontoEl = document.getElementById("codiceSconto");
  const totalAmountEl = document.getElementById("totalAmount");
  const totalHiddenEl = document.getElementById("totalHidden");
  const discountFeedbackEl = document.getElementById("discountFeedback");

  const rawCode = codiceScontoEl ? codiceScontoEl.value.trim().toUpperCase() : "";

  if (triggerSource === "discountButton") {
    if (!rawCode) {
      showErrorMessage("Inserisci un codice sconto prima di cliccare su Applica Sconto.", 2500);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(BOOKING_DISCOUNTS, rawCode)) {
      appliedDiscountCode = rawCode;
      showSuccessMessage(`Codice sconto '${rawCode}' applicato (-${BOOKING_DISCOUNTS[rawCode]}%)!`, 2500);
    } else {
      appliedDiscountCode = "";
      showErrorMessage(`Codice sconto '${rawCode}' non attivo.`, 3000);
    }
    updateDiscountButtonState();
  }

  const activeCode = appliedDiscountCode || (Object.prototype.hasOwnProperty.call(BOOKING_DISCOUNTS, rawCode) ? rawCode : "");
  const discountPct = activeCode ? BOOKING_DISCOUNTS[activeCode] : 0;

  if (discountFeedbackEl) {
    if (discountPct > 0) {
      discountFeedbackEl.style.color = "#6ee7a8";
      discountFeedbackEl.textContent = `✓ Codice ${activeCode} applicato (-${discountPct}%)`;
    } else if (rawCode.length > 0) {
      discountFeedbackEl.style.color = "#ffab6b";
      discountFeedbackEl.textContent = "Codice non attivo (verrà comunque verificato dallo staff)";
    } else {
      discountFeedbackEl.textContent = "";
    }
  }

  if (ownBikeCheckbox) {
    if (totalAmountEl) totalAmountEl.textContent = "0.00";
    if (totalHiddenEl) totalHiddenEl.value = "0.00";
    return;
  }

  if (!bikeTypeSelect || !bikeTypeSelect.value) {
    if (totalAmountEl) totalAmountEl.textContent = "0.00";
    if (totalHiddenEl) totalHiddenEl.value = "0.00";
    return;
  }

  const selectedOption = bikeTypeSelect.options[bikeTypeSelect.selectedIndex];
  const days = durationInput ? parseFloat(durationInput.value) || 1 : 1;
  const parsedQty = quantityInput ? parseInt(quantityInput.value, 10) : 1;
  const quantity = Number.isFinite(parsedQty) && parsedQty >= 1 ? parsedQty : 1;

  const priceDay = parseFloat(selectedOption?.dataset?.priceDay) || 40;
  const priceHalf = parseFloat(selectedOption?.dataset?.priceHalf) || priceDay / 2;
  const unitPrice = days === 0.5 ? priceHalf : priceDay * days;

  let accessoriesTotal = 0;
  document.querySelectorAll("input[name='accessories']:checked").forEach((cb) => {
    if (cb.value === "carrello") accessoriesTotal += 7;
    if (cb.value === "shotgun") accessoriesTotal += 15;
  });

  let grandTotal = unitPrice * quantity + accessoriesTotal;
  if (discountPct > 0) {
    grandTotal = grandTotal * (1 - discountPct / 100);
  }

  const formattedTotal = grandTotal.toFixed(2);
  if (totalAmountEl) totalAmountEl.textContent = formattedTotal;
  if (totalHiddenEl) totalHiddenEl.value = formattedTotal;
}

window.recomputeBibbonaTotal = () => updateLivePrice("auto");

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
  const bikeTypeSelect = document.getElementById("bikeType");
  if (bikeTypeSelect) {
    bikeTypeSelect.addEventListener("change", (event) => {
      const selectedBikeType = event.target.value;
      const accessoriesGroup = document.getElementById("accessoriesGroup");
      if (accessoriesGroup) {
        accessoriesGroup.style.display = selectedBikeType && selectedBikeType !== "NESSUNA" ? "block" : "none";
      }
      updateLivePrice("auto");
    });
  }

  document.getElementById("duration")?.addEventListener("change", () => updateLivePrice("auto"));
  document.getElementById("quantity")?.addEventListener("input", () => updateLivePrice("auto"));

  // Pulsante "Applica Sconto"
  const codiceScontoInput = document.getElementById("codiceSconto");
  if (codiceScontoInput) {
    const parentFormGroup = codiceScontoInput.closest(".form-group.icon-input");
    if (parentFormGroup && !document.getElementById("validateDiscountBtn")) {
      const iconElement = parentFormGroup.querySelector(".fas.fa-tag");
      const inputAndButtonWrapper = document.createElement("div");
      inputAndButtonWrapper.classList.add("codice-sconto-input-wrapper");
      Object.assign(inputAndButtonWrapper.style, {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%"
      });

      if (iconElement) {
        inputAndButtonWrapper.appendChild(iconElement);
      }
      inputAndButtonWrapper.appendChild(codiceScontoInput);

      const validateDiscountButton = document.createElement("button");
      validateDiscountButton.type = "button";
      validateDiscountButton.id = "validateDiscountBtn";
      validateDiscountButton.textContent = "Applica Sconto";
      Object.assign(validateDiscountButton.style, {
        padding: "8px 14px",
        backgroundColor: "#007bff",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.88rem",
        fontWeight: "600",
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
        updateLivePrice("discountButton");
      });

      codiceScontoInput.addEventListener("input", () => {
        const currentInputValue = codiceScontoInput.value.trim().toUpperCase();
        if (currentInputValue === "") {
          appliedDiscountCode = "";
          updateDiscountButtonState();
        }
        updateLivePrice("auto");
      });
    }
  }

  ["name", "email", "phone", "date"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", (e) => validateField(e.target));
  });

  // Pulsanti selezione bici dalle card Noleggio
  document.querySelectorAll(".bike-select").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const bikeType = button.getAttribute("data-bike");
      const accessoriesGroup = document.getElementById("accessoriesGroup");
      if (bikeTypeSelect && bikeType) {
        bikeTypeSelect.value = bikeType;
        if (accessoriesGroup) {
          accessoriesGroup.style.display = bikeType !== "NESSUNA" ? "block" : "none";
        }
        showSuccessMessage(`🚲 ${bikeType} selezionata!`, 2000);
        updateLivePrice("auto");
      }
      document.getElementById("noleggio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("input[name='accessories']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => updateLivePrice("auto"));
  });

  // Selezione Tour
  document.body.addEventListener("click", (event) => {
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
      updateLivePrice("auto");
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
        updateLivePrice("auto");
      }
    });
    tourInputWrapper.appendChild(removeTourButton);
  }

  // Gestione Evento
  document.getElementById("eventIdHidden")?.addEventListener("change", (event) => {
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
    updateLivePrice("auto");
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
        updateLivePrice("auto");
      }
    });
    eventInputWrapper.appendChild(removeEventButton);
  }

  document.getElementById("ownBikeCheckbox")?.addEventListener("change", (event) => {
    const isChecked = event.target.checked;
    const quantityInput = document.getElementById("quantity");
    if (bikeTypeSelect) bikeTypeSelect.disabled = isChecked;
    if (quantityInput) quantityInput.disabled = isChecked;
    updateLivePrice("auto");
  });

  // Reset visivo del pulsante sconto quando il form viene resettato dopo l'invio
  const noleggioForm = document.getElementById("noleggioForm");
  if (noleggioForm) {
    noleggioForm.addEventListener("reset", () => {
      setTimeout(() => {
        appliedDiscountCode = "";
        updateDiscountButtonState();
        const accessoriesGroup = document.getElementById("accessoriesGroup");
        const tourFieldDiv = document.getElementById("tourField");
        const eventFieldDiv = document.getElementById("eventField");
        if (accessoriesGroup) accessoriesGroup.style.display = "none";
        if (tourFieldDiv) tourFieldDiv.style.display = "none";
        if (eventFieldDiv) eventFieldDiv.style.display = "none";
      }, 0);
    });
  }

  updateLivePrice("auto");
  updateDiscountButtonState();
}

document.addEventListener("DOMContentLoaded", initializeBookingForm);
