document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("noleggioForm");
  const responseMessage = document.getElementById("responseMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const bikeType = form.bikeType.value;
    const date = form.date.value;
    const duration = form.duration.value;

    if (!name || !email || !bikeType || !date || !duration) {
      responseMessage.style.color = "red";
      responseMessage.textContent = "❌ Compila tutti i campi obbligatori.";
      return;
    }

    responseMessage.style.color = "green";
    responseMessage.textContent = "✅ Richiesta inviata! Ti contatteremo presto.";
    form.reset();
  });
});
