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
    const MAX_VISIBLE = 3;
    let allWrappers = [];

      tours.forEach((tour, i) => {
        const wrapper = document.createElement("div");
        wrapper.className = "card-border-wrapper";
        if (i >= MAX_VISIBLE) wrapper.style.display = "none"; // Nasconde inizialmente

        const card = document.createElement("div");
        card.className = "tour-card glow";

        card.innerHTML = `
          <div class="tour-thumb" style="background-image: url('${tour.image}')"></div>
          <h3>${tour.title}</h3>
          <p>${tour.description}</p>
          <ul class="tour-details">
            <li><strong>Tipo:</strong> ${tour.type}</li>
            <li><strong>Prezzo:</strong> ${tour.price}</li>
            <li>
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" style="margin-right: 6px; vertical-align: middle;">
                <path d="M12 20a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm.5-13h-1v6l5.25 3.15.5-.84-4.75-2.81z"/>
              </svg>
              <strong>Durata:</strong> ${tour.duration}
            </li>
            <li>
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512" fill="black" style="margin-right: 6px; vertical-align: middle;">
                <path d="M168 0C75.3 0 0 75.3 0 168c0 87.2 153.6 313.4 160 322.4 4.5 6.5 14.5 6.5 19 0C230.4 481.4 384 255.2 384 168 384 75.3 308.7 0 216 0c-26.7 0-52.2 6.9-74.2 19.1C119.7 6.9 94.2 0 68 0zM192 240c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z"/>
              </svg>
              <strong>Distanza:</strong> ${tour.distance}
            </li>
            <li>
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 512" fill="black" style="margin-right: 6px; vertical-align: middle;">
                <path d="M0 480l160-320 160 320H0zm384 0l128-256 128 256H384z"/>
              </svg>
              <strong>Dislivello:</strong> ${tour.elevation}
            </li>
            <li>
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20" fill="black" style="margin-right: 6px; vertical-align: middle;">
                <path d="M26.89 32.291h-7.592V4.525c0-3.366-5.215-3.366-5.215 0v27.766H6.49c-2.446 0-4.49 2.318-4.49 5.095c0 2.779 2.043 5.098 4.49 5.098h7.593v16.992c0 3.365 5.215 3.365 5.215 0V42.484h7.592c2.449 0 4.491-2.318 4.491-5.098c0-2.778-2.042-5.095-4.491-5.095" />
                <path d="M49.739 55.861H37.372c-3.847 0-3.847 6.138 0 6.138h12.367c3.848 0 3.848-6.138 0-6.138" />
                <path d="M51.614 45.089H37.372c-3.847 0-3.847 6.139 0 6.139h14.242c3.848 0 3.848-6.139 0-6.139" />
                <path d="M53.489 34.317H37.372c-3.847 0-3.847 6.138 0 6.138h16.117c3.848 0 3.848-6.138 0-6.138" />
                <path d="M55.364 23.545H37.372c-3.847 0-3.847 6.138 0 6.138h17.992c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.068c0-.399.115-1.069.885-1.069h17.992c.771 0 .885.67.885 1.069c0 .398-.114 1.068-.885 1.068" />
                <path d="M57.239 12.774H37.372c-3.847 0-3.847 6.138 0 6.138h19.867c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.068c0-.399.115-1.069.885-1.069h19.867c.771 0 .885.67.885 1.069c0 .398-.114 1.068-.885 1.068" />
                <path d="M59.114 2.001H37.372c-3.847 0-3.847 6.138 0 6.138h21.742c3.848 0 3.848-6.138 0-6.138m0 4.138H37.372c-.77 0-.885-.67-.885-1.069c0-.398.115-1.068.885-1.068h21.742c.771 0 .885.67.885 1.068c0 .399-.114 1.069-.885 1.069" />
              </svg>
              <strong>Difficoltà:</strong> ${tour.difficulty}
            </li>          
          </ul>
          </ul>
          <div class="buttons">
            <a href="#noleggio" class="btn-primary scroll-btn tour-book" data-tour-id="tour${i}" data-tour-name="${tour.title}">Prenota</a>
            <a href="#" class="info-btn"><i class="fas fa-info-circle"></i> Info</a>
          </div>
        `;

        wrapper.appendChild(card);
        container.appendChild(wrapper);
        observer.observe(wrapper);

        allWrappers.push(wrapper);

        const infoBtn = card.querySelector(".info-btn");
        infoBtn.addEventListener("click", e => {
          e.preventDefault();

        // All'interno dell'event listener...
        const tourImage = document.getElementById("tourDrawerImage");
        if (tour.image) {
          tourImage.src = tour.image;
          tourImage.style.display = "block";
          tourImage.classList.remove("visible");
          tourImage.onerror = () => {
            console.error("Errore caricamento immagine:", tour.image);
            tourImage.style.display = "none";
          };
          // trigger fade-in
          setTimeout(() => tourImage.classList.add("visible"), 50);
        } else {
          tourImage.style.display = "none";
        }

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

const showMoreBtn = document.getElementById("showMoreTours");
let isExpanded = false;

if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;

    allWrappers.forEach((w, i) => {
      if (i >= MAX_VISIBLE) {
        w.style.display = isExpanded ? "block" : "none";
      }
    });

    showMoreBtn.textContent = isExpanded ? "Nascondi tour extra" : "Mostra altri tour";
  });


      }

    });
});
