document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("weatherWidget");
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");

  // Posiziona dinamicamente sotto all'header
  if (widget && header) {
    const updateWidgetTop = () => {
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 80 : header.offsetHeight + 20;
      widget.style.top = `${offset}px`;
    };
    updateWidgetTop();
    window.addEventListener("resize", updateWidgetTop);
  }

  // Carica meteo
  async function loadWeather() {
    try {
      const res = await fetch("https://weather.zonkeynet.workers.dev/");
      const data = await res.json();

      if (!data.weather || !data.weather[0]) throw new Error("Dati meteo non validi");

      const iconCode = data.weather[0].icon;
      const temp = Math.round(data.main.temp);

      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById("weatherTemp").textContent = `${temp}°C`;

      widget.classList.remove("hidden");
    } catch (err) {
      console.error("Errore meteo:", err);
      if (widget) widget.classList.add("hidden");
    }
  }

  loadWeather();

  // 👁️‍🗨️ Mostra widget solo se HERO è visibile (threshold 20%)
  if (widget && hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        widget.style.opacity = visible ? "1" : "0";
        widget.style.pointerEvents = visible ? "auto" : "none";
      },
      {
        root: null,
        threshold: 0.2
      }
    );

    observer.observe(hero);
  }
});
