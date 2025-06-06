document.addEventListener("DOMContentLoaded", () => { // Il DOMContentLoaded è già presente, lo mantengo.
  async function loadWeather() {
    try {
      // Chiama direttamente il tuo worker, senza query string
      const res = await fetch("https://weather.zonkeynet.workers.dev/");
      const data = await res.json();

      if (!data.weather || !data.weather[0]) throw new Error("Dati meteo non validi");

      const iconCode = data.weather[0].icon;
      const temp = Math.round(data.main.temp);

      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById("weatherTemp").textContent = `${temp}°C`;
      document.getElementById("weatherWidget").classList.remove("hidden"); // Rimuove la classe hidden

    } catch (err) {
      console.error("Errore meteo:", err);
      // Potresti voler nascondere il widget meteo o mostrare un messaggio di errore se il caricamento fallisce
      const weatherWidget = document.getElementById("weatherWidget");
      if (weatherWidget) {
        weatherWidget.classList.add("hidden"); // Nascondi il widget se c'è un errore
      }
    }
  }

  loadWeather(); // Chiamata la funzione all'interno del DOMContentLoaded
});