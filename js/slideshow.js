const $window =$(window), $body =$("body");

class Slideshow {
  constructor(i = {}) {
    let s = { $el:$(".slideshow"), showArrows: !1, showPagination: !0, duration: 1e4, autoplay: !0 },
      t = Object.assign({}, s, i);
    this.$el = t.$el;
    this.$slides = this.$el.find(".js-slider-home-slide");
    this.maxSlide = this.$slides.length;
    const firstSlideAttr = parseInt(this.$slides.first().attr("data-slide"), 10);
    this.initialSlide = Number.isFinite(firstSlideAttr) ? firstSlideAttr : 1;
    this.showArrows = this.maxSlide > 1 && t.showArrows;
    this.showPagination = t.showPagination;
    this.currentSlide = this.initialSlide;
    this.isAnimating = !1;
    this.animationDuration = 1200;
    this.autoplaySpeed = t.duration;
    this.interval = null;
    this.$controls = this.$el.find(".js-slider-home-button");
    this.autoplay = this.maxSlide > 1 && t.autoplay;

    this.$el.on("click", ".js-slider-home-next", () => this.nextSlide());
    this.$el.on("click", ".js-slider-home-prev", () => this.prevSlide());
    this.$el.on("click", ".js-pagination-item", i => {
      if (!this.isAnimating) {
        this.preventClick();
        const targetIndex = parseInt(i.currentTarget.dataset.slide || i.target.dataset.slide, 10);
        this.goToSlide(Number.isFinite(targetIndex) ? targetIndex : this.initialSlide);
      }
    });

    this.init();
  }

  init() {
    this.goToSlide(this.initialSlide);
    this.autoplay && this.startAutoplay();
  }

  preventClick() {
    this.isAnimating = !0;
    this.$controls.prop("disabled", !0);
    clearInterval(this.interval);
    setTimeout(() => {
      this.isAnimating = !1;
      this.$controls.prop("disabled", !1);
      this.autoplay && this.startAutoplay();
    }, this.animationDuration);
  }

  getSlidePos(slideNum) {
    const idx = this.$slides.toArray().findIndex(el => parseInt($(el).attr("data-slide"), 10) === slideNum);
    return idx >= 0 ? idx : 0;
  }

  goToSlide(i) {
    if (this.maxSlide === 0) return;

    const slideNums = this.$slides
      .toArray()
      .map((el, idx) => {
        const parsed = parseInt($(el).attr("data-slide"), 10);
        return Number.isFinite(parsed) ? parsed : idx + 1;
      });

    let targetNum = parseInt(i, 10);
    if (!Number.isFinite(targetNum)) {
      targetNum = slideNums[0];
    }

    let pos = slideNums.indexOf(targetNum);
    if (pos === -1) {
      if (targetNum > slideNums[slideNums.length - 1]) {
        pos = 0;
      } else if (targetNum < slideNums[0]) {
        pos = slideNums.length - 1;
      } else {
        pos = 0;
      }
      targetNum = slideNums[pos];
    }

    this.currentSlide = targetNum;

    const prevPos = (pos - 1 + this.maxSlide) % this.maxSlide;
    const nextPos = (pos + 1) % this.maxSlide;

    const $currentSlide = this.$slides.eq(pos);
    const $prevSlide = this.$slides.eq(prevPos);
    const $nextSlide = this.$slides.eq(nextPos);

    this.$slides.removeClass("is-prev is-next is-current");
    this.$el.find(".js-pagination-item").removeClass("is-current");

    if (this.maxSlide > 1) {
      $prevSlide.addClass("is-prev");
      $nextSlide.addClass("is-next");
    }

    $currentSlide.addClass("is-current");
    this.$el.find(`.js-pagination-item[data-slide="${this.currentSlide}"]`).addClass("is-current");
  }

  nextSlide() {
    this.preventClick();
    const slideNums = this.$slides.toArray().map((el, idx) => {
      const parsed = parseInt($(el).attr("data-slide"), 10);
      return Number.isFinite(parsed) ? parsed : idx + 1;
    });
    const curPos = Math.max(0, slideNums.indexOf(this.currentSlide));
    const nextNum = slideNums[(curPos + 1) % this.maxSlide];
    this.goToSlide(nextNum);
  }

  prevSlide() {
    this.preventClick();
    const slideNums = this.$slides.toArray().map((el, idx) => {
      const parsed = parseInt($(el).attr("data-slide"), 10);
      return Number.isFinite(parsed) ? parsed : idx + 1;
    });
    const curPos = Math.max(0, slideNums.indexOf(this.currentSlide));
    const prevNum = slideNums[(curPos - 1 + this.maxSlide) % this.maxSlide];
    this.goToSlide(prevNum);
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      this.isAnimating || this.nextSlide();
    }, this.autoplaySpeed);
  }

  destroy() {
    clearInterval(this.interval);
    this.$el.off();
  }
}

!function () {
  let i = !1;
  function s() {
    if ($(".slideshow .js-slider-home-slide").length > 0) {
      new Slideshow({ showPagination: !0 });
    }
  }
  $window.on("load", () => {
    i || (i = !0, s());
  });
  setTimeout(() => {
    i || (i = !0, s());
  }, 3e3);
  $body.addClass("is-loaded");
  setTimeout(() => {
    $body.addClass("is-animated");
  }, 600);
}();
