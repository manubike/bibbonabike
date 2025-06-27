// Inizializza riferimenti a finestra e corpo del documento
const $window = $(window);
const $body = $('body');

// Classe Slideshow
class Slideshow {
  constructor(userOptions = {}) {
    // Opzioni di default per lo slideshow
    const defaultOptions = {
      $el: $('.slideshow'),     // elemento slideshow principale
      showArrows: false,        // mostrare frecce di navigazione
      showPagination: true,     // mostrare paginazione
      duration: 10000,          // durata autoplay in ms
      autoplay: true            // attivare autoplay
    };

    // Merge tra default e opzioni dell'utente
    let options = Object.assign({}, defaultOptions, userOptions);

    this.$el = options.$el;
    this.maxSlide = this.$el.find('.js-slider-home-slide').length;
    this.showArrows = this.maxSlide > 1 ? options.showArrows : false;
    this.showPagination = options.showPagination;
    this.currentSlide = 1;
    this.isAnimating = false;
    this.animationDuration = 1200;
    this.autoplaySpeed = options.duration;
    this.interval = null;
    this.$controls = this.$el.find('.js-slider-home-button');
    this.autoplay = this.maxSlide > 1 ? options.autoplay : false;

    // Eventi
    this.$el.on('click', '.js-slider-home-next', (event) => this.nextSlide());
    this.$el.on('click', '.js-slider-home-prev', (event) => this.prevSlide());
    this.$el.on('click', '.js-pagination-item', event => {
      if (!this.isAnimating) {
        this.preventClick();
        this.goToSlide(event.target.dataset.slide);
      }
    });

    // Avvio iniziale
    this.init();
  }

  // Inizializzazione dello slideshow
  init() {
    this.goToSlide(1); // Mostra la prima slide

    if (this.autoplay) {
      this.startAutoplay(); // Avvia autoplay
    }
  }

  // Blocca temporaneamente i click per evitare spam durante l'animazione
  preventClick() {
    this.isAnimating = true;
    this.$controls.prop('disabled', true);
    clearInterval(this.interval);

    setTimeout(() => {
      this.isAnimating = false;
      this.$controls.prop('disabled', false);
      if (this.autoplay) {
        this.startAutoplay(); // Riavvia autoplay
      }
    }, this.animationDuration);
  }

  // Passa a una slide specifica
  goToSlide(index) {
    this.currentSlide = parseInt(index);

    if (this.currentSlide > this.maxSlide) this.currentSlide = 1;
    if (this.currentSlide === 0) this.currentSlide = this.maxSlide;

    const newCurrent = this.$el.find(`.js-slider-home-slide[data-slide="${this.currentSlide}"]`);
    const newPrev = this.currentSlide === 1
      ? this.$el.find('.js-slider-home-slide').last()
      : newCurrent.prev('.js-slider-home-slide');
    const newNext = this.currentSlide === this.maxSlide
      ? this.$el.find('.js-slider-home-slide').first()
      : newCurrent.next('.js-slider-home-slide');

    this.$el.find('.js-slider-home-slide').removeClass('is-prev is-next is-current');
    this.$el.find('.js-pagination-item').removeClass('is-current');

    if (this.maxSlide > 1) {
      newPrev.addClass('is-prev');
      newNext.addClass('is-next');
    }

    newCurrent.addClass('is-current');
    this.$el.find(`.js-pagination-item[data-slide="${this.currentSlide}"]`).addClass('is-current');
  }

  // Slide successiva
  nextSlide() {
    this.preventClick();
    this.goToSlide(this.currentSlide + 1);
  }

  // Slide precedente
  prevSlide() {
    this.preventClick();
    this.goToSlide(this.currentSlide - 1);
  }

  // Avvio autoplay
  startAutoplay() {
    this.interval = setInterval(() => {
      if (!this.isAnimating) {
        this.nextSlide();
      }
    }, this.autoplaySpeed);
  }

  // Rimuove eventi e slideshow
  destroy() {
    this.$el.off();
  }
}

// Script di avvio
(function() {
  let loaded = false;
  let maxLoad = 3000;

  function load() {
    const options = {
      showPagination: true
    };

    let slideShow = new Slideshow(options);
  }

  function addLoadClass() {
    $body.addClass('is-loaded');
    setTimeout(() => {
      $body.addClass('is-animated');
    }, 600);
  }

  // Avvio al caricamento completo
  $window.on('load', () => {
    if (!loaded) {
      loaded = true;
      load();
    }
  });

  // Fallback in caso di `load` non chiamato
  setTimeout(() => {
    if (!loaded) {
      loaded = true;
      load();
    }
  }, maxLoad);

  addLoadClass();
})
();
