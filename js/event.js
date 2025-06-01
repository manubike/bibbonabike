document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".eventi-slider");
  const drawer = document.getElementById("eventoDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.querySelector(".drawer-close");

  // Observer per animazione su scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Apertura drawer + overlay
  const openDrawer = () => {
    drawer.classList.remove("hidden");
    drawer.classList.add("visible");
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
  };

  // Chiusura drawer + overlay
  const closeDrawer = () => {
    drawer.classList.remove("visible");
    drawer.classList.add("hidden");
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
  };

  // Evento click su overlay
  overlay.addEventListener("click", closeDrawer);

  // Evento click su X
  closeBtn.addEventListener("click", closeDrawer);

  // Swipe verso il basso per chiudere su mobile
  let startY = null;
  drawer.addEventListener("touchstart", e => {
    if (e.touches.length === 1) startY = e.touches[0].clientY;
  });
  drawer.addEventListener("touchmove", e => {
    if (!startY) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;
    if (diffY > 100) {
      closeDrawer();
      startY = null;
    }
  });
  drawer.addEventListener("touchend", () => {
    startY = null;
  });

  // Fetch JSON eventi
  fetch("js/eventi.json")
    .then(res => res.json())
    .then(eventi => {
      eventi.forEach(ev => {
        const card = document.createElement("div");
        card.className = "evento-card";

        // HTML interno
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
                <a href="#" class="info-btn">Info</a>
              </div>
            </div>
          </div>
        `;

        slider.appendChild(card);
        observer.observe(card);

        // Tilt solo su desktop
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
            inner.style.transform = "rotateX(0deg) rotateY(0deg)";
            inner.style.background = "none";
          });
        }

        // Apertura pannello con dati
        const infoBtn = card.querySelector(".info-btn");
        infoBtn.addEventListener("click", e => {
          e.preventDefault();

          document.getElementById("drawerImage").src = ev.image;
          document.getElementById("drawerTitle").textContent = ev.title;
          document.getElementById("drawerDate").textContent = ev.date;
          document.getElementById("drawerTime").textContent = ev.time;
          document.getElementById("drawerPrice").textContent = ev.price || "–";
          document.getElementById("drawerDescription").textContent = ev.descriptionFull || ev.description;

          document.getElementById("drawerBook").href = "#noleggio";
          document.getElementById("drawerWhatsApp").href = `https://wa.me/393313453207?text=${encodeURIComponent(ev.whatsapp)}`;
          document.getElementById("drawerEmail").href = `mailto:${ev.email || "info@bibbonabike.com"}?subject=Info evento: ${encodeURIComponent(ev.title)}`;

          openDrawer();
        });
      });
    });
});
