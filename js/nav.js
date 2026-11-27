function toggleMenu() {
  const nav = document.querySelector("nav ul");
  const header = document.getElementById("header");
  const btn = document.getElementById("menuBtn");
  if (!nav || !header || !btn) return;
  nav.classList.toggle("show");
  header.classList.toggle("menu-open");
  btn.textContent = btn.textContent === "☰" ? "✖" : "☰";
}

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", () => {
      logo.classList.toggle("pulse");
    });
  }

  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add("show");
    }, 400);
  }

  document.querySelectorAll(".scroll-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      const navList = document.querySelector("nav ul");
      const header = document.getElementById("header");
      const menuBtn = document.getElementById("menuBtn");
      if (navList && navList.classList.contains("show")) {
        navList.classList.remove("show");
        if (header) header.classList.remove("menu-open");
        if (menuBtn) menuBtn.textContent = "☰";
      }
    });
  });

  let lastScrollTop = 0;
  const headerBar = document.getElementById("header");
  let scrollTimeout;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (headerBar) {
      if (currentScroll > lastScrollTop && currentScroll > 80) {
        headerBar.classList.add("nav-hidden");
      } else {
        headerBar.classList.remove("nav-hidden");
      }
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (headerBar) headerBar.classList.remove("nav-hidden");
    }, 1500);
  });
});
