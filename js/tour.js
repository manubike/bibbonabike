document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".tour-cards");
  const drawer = document.getElementById("tourDrawer");
  const overlay = document.getElementById("tourDrawerOverlay");
  const closeBtn = document.getElementById("tourDrawerClose");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const openDrawer = () => {
    document.body.classList.add("drawer-open");
    drawer.classList.remove("hidden");
    drawer.classList.add("visible");
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
    drawer.scrollTop = 0;
  };

  const closeDrawer = () => {
    document.body.classList.remove("drawer-open");
    drawer.classList.remove("visible");
    drawer.classList.add("hidden");
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
  };

  overlay.addEventListener("click", closeDrawer);
  closeBtn.addEventListener("click", closeDrawer);

  fetch("js/tour.json")
    .then(res => res.json())
    .then(tours => {
      tours.forEach((tour, i) => {
        const wrapper = document.createElement("div");
        wrapper.className = "card-border-wrapper";

        const card = document.createElement("div");
        card.className = "tour-card glow";

        card.innerHTML = `
          <div class="tour-thumb" style="background-image: url('${tour.image}')"></div>
          <h3>${tour.title}</h3>
          <p>${tour.description}</p>
          <ul class="tour-details">
            <li><strong>Tipo:</strong> ${tour.type}</li>
            <li><strong>Prezzo:</strong> ${tour.price}</li>
            <li><strong>Durata:</strong> ${tour.duration}</li>
            <li><strong>Distanza:</strong> ${tour.distance}</li>
            <li><strong>Dislivello:</strong> ${tour.elevation}</li>
            <li><strong>Difficoltà:</strong> <span class="difficulty-dot" style="background-color: green;"></span> ${tour.difficulty}</li>
          </ul>
          <div class="buttons">
            <a href="#noleggio" class="btn-primary scroll-btn tour-book" data-tour-id="tour${i}" data-tour-name="${tour.title}">Prenota</a>
            <a href="#" class="info-btn"><i class="fas fa-info-circle"></i> Info</a>
          </div>
        `;

        wrapper.appendChild(card);
        container.appendChild(wrapper);
        observer.observe(wrapper);

        const infoBtn = card.querySelector(".info-btn");
        infoBtn.addEventListener("click", e => {
          e.preventDefault();

          document.getElementById("tourDrawerImage").src = tour.image;
          document.getElementById("tourDrawerTitle").textContent = tour.title;

          const durationTarget = document.getElementById("tourDrawerDuration");
          const durationBar = document.getElementById("durataBarFill");
          const durationStr = tour.duration.toLowerCase();
          const hours = parseFloat(durationStr);
          durationTarget.textContent = "0h";
          let currentHour = 0;
          const durationMs = 2000;
          const startDur = performance.now();

          function animateDuration(timestamp) {
            const progress = timestamp - startDur;
            const ratio = Math.min(progress / durationMs, 1);
            const current = Math.round(ratio * hours * 10) / 10;
            durationTarget.textContent = `${current.toFixed(1)}h`;
            if (progress < durationMs) {
              requestAnimationFrame(animateDuration);
            } else {
              durationTarget.textContent = `${hours}h`;
            }
          }
          requestAnimationFrame(animateDuration);

          const fillPercent = Math.min((hours / 8) * 100, 100);
          durationBar.style.width = "0%";
          setTimeout(() => {
            durationBar.style.width = `${fillPercent}%`;
          }, 50);

          const distanceTarget = document.getElementById("tourDrawerDistance");
          const distanceValue = parseInt(tour.distance);
          let currentDist = 0;
          const distDuration = 1500;
          let startDistTime = null;

          const animateDistance = timestamp => {
            if (!startDistTime) startDistTime = timestamp;
            const progress = timestamp - startDistTime;
            const ratio = Math.min(progress / distDuration, 1);
            currentDist = Math.floor(distanceValue * ratio);
            distanceTarget.textContent = `${currentDist} km`;
            if (progress < distDuration) requestAnimationFrame(animateDistance);
          };
          requestAnimationFrame(animateDistance);

          const elevationTarget = document.getElementById("tourDrawerElevation");
          const elevationValue = parseInt(tour.elevation);
          elevationTarget.textContent = "0 m";
          const path = document.getElementById("elevationPath");
          path.style.animation = "none";
          path.offsetHeight;
          path.style.animation = "drawMiniMountain 2s ease forwards";

          let startElevationTime = null;
          const elevationDuration = 2000;

          function animateElevation(timestamp) {
            if (!startElevationTime) startElevationTime = timestamp;
            const progress = timestamp - startElevationTime;
            const ratio = Math.min(progress / elevationDuration, 1);
            const current = Math.floor(elevationValue * ratio);
            elevationTarget.textContent = `${current} m`;
            if (progress < elevationDuration) {
              requestAnimationFrame(animateElevation);
            }
          }
          requestAnimationFrame(animateElevation);

          document.getElementById("tourDrawerPrice").textContent = tour.price;
          document.getElementById("tourDrawerDescription").textContent = tour.descriptionFull || tour.description;

          const difficulty = (tour.difficulty || "").toLowerCase();
          const diffFill = document.getElementById("difficultyLevel");
          const diffLabel = document.getElementById("difficultyLabel");

          diffFill.style.transition = "none";
          diffFill.style.width = "0%";
          void diffFill.offsetWidth;
          diffFill.style.transition = "width 0.8s ease";

          setTimeout(() => {
            if (difficulty.includes("facile")) {
              diffFill.style.background = "linear-gradient(270deg, #81c784, #66bb6a, #81c784)";
              diffFill.style.width = "33%";
              diffLabel.textContent = "Facile";
            } else if (difficulty.includes("medio")) {
              diffFill.style.background = "linear-gradient(270deg, #ffb74d, #fb8c00, #ffb74d)";
              diffFill.style.width = "66%";
              diffLabel.textContent = "Media";
            } else if (difficulty.includes("difficile")) {
              diffFill.style.background = "linear-gradient(270deg, #e57373, #d32f2f, #e57373)";
              diffFill.style.width = "100%";
              diffLabel.textContent = "Difficile";
            } else {
              diffFill.style.background = "#999";
              diffFill.style.width = "0%";
              diffLabel.textContent = "–";
            }
          }, 50);

          const tourDrawerBook = document.getElementById("tourDrawerBook");
          tourDrawerBook.href = "#noleggio";
          tourDrawerBook.addEventListener("click", closeDrawer);

          document.getElementById("tourDrawerWhatsApp").href =
            `https://wa.me/393313453207?text=${encodeURIComponent(tour.whatsapp || "Ciao, vorrei info sul tour: " + tour.title)}`;
          document.getElementById("tourDrawerEmail").href =
            `mailto:info@bibbonabike.com?subject=Info tour: ${encodeURIComponent(tour.title)}`;

          openDrawer();
        });
      });
    });
});
