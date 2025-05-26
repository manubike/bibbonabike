document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".eventi-slider");

  fetch("js/eventi.json")
    .then(res => res.json())
    .then(eventi => {
      eventi.forEach(ev => {
        const card = document.createElement("div");
        card.className = "evento-card";

        // Card HTML
        card.innerHTML = `
        <div class="evento-inner">
            <div class="evento-tag evento-${ev.type}">${ev.type.toUpperCase()}</div>
            <img src="${ev.image}" alt="${ev.title}" />
            <div class="evento-info">
            <h3>${ev.title}</h3>
            <p><strong>Quando:</strong> ${ev.date} <br><strong>Orario:</strong> ${ev.time}</p>
            <p>${ev.description}</p>
            <div class="buttons">
                <a href="#noleggio" class="btn-primary scroll-btn tour-book" data-tour="${ev.title}">Prenota</a>
                <a href="#noleggio">Info</a>
            </div>
            </div>
        </div>
        `;



        slider.appendChild(card);
        observer.observe(card);

        // Tilt + Shine (solo su desktop)
        if (window.innerWidth > 768) {
          const inner = card.querySelector(".evento-inner");

          card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * -10;

            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            inner.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`;
          });

          card.addEventListener("mouseleave", () => {
            const inner = card.querySelector(".evento-inner");
            inner.style.transform = "rotateX(0deg) rotateY(0deg)";
            inner.style.background = "none";
          });
        }
      });
    });


  // Observer per animazione su scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
});
