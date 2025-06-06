  document.addEventListener("DOMContentLoaded", () => {
    const feature = document.getElementById("bikeFeature");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          feature.classList.add("animate-bike");
          observer.disconnect(); // esegui solo una volta
        }
      });
    }, {
      threshold: 0.4
    });

    observer.observe(feature);
  });