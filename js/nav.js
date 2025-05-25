    // NAV JS
    function toggleMenu() {

      const nav = document.querySelector('nav ul');
      const header = document.getElementById('header');
      const btn = document.getElementById('menuBtn');
  
      nav.classList.toggle('show');
      header.classList.toggle('menu-open');
  
      // Cambia icona
      if (btn.textContent === "☰") {
        btn.textContent = "✖";
      } else {
        btn.textContent = "☰";
      }
    }
  
    // Logo effetto pulse opzionale
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => {
      logo.classList.toggle('pulse');
    });
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        document.querySelector('.hero-content').classList.add('show');
      }, 400); // Delay in ms
    });

    // Scroll fluido + scroll-to-form
    document.querySelectorAll('.scroll-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  // Chiude il menu mobile al clic su un link del nav
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      const navList = document.querySelector("nav ul");
      const header = document.getElementById("header");
      const menuBtn = document.getElementById("menuBtn");

      // Chiude il menu mobile se è aperto
      if (navList.classList.contains("show")) {
        navList.classList.remove("show");
        header.classList.remove("menu-open");
        menuBtn.textContent = "☰";
      }
    });
  });
