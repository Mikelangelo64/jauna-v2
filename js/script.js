document.addEventListener('DOMContentLoaded', function () {
  const isSafari = () => {
    return (
      ~navigator.userAgent.indexOf('Safari') &&
      navigator.userAgent.indexOf('Chrome') < 0
    );
  };

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
    document.body.style.setProperty('--mobile', `none`);
  } else {
    document.querySelector('body').classList.add('v-desk');
    document.querySelector('html').classList.add('v-desk');
    document.body.style.setProperty('--mobile', `block`);
  }

  //normal vh
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    if (vh === window.innerHeight * 0.01 || document.body.clientWidth < 900) {
      return;
    }

    vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  });

  //change header when scroll
  const header = document.querySelector('.header');
  let isScrolledHeader = false;

  header &&
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60 && !isScrolledHeader) {
        //console.log(1);
        header.classList.add('_scrolled');
        isScrolledHeader = true;
        return;
      }

      if (window.scrollY <= 60 && isScrolledHeader) {
        header.classList.remove('_scrolled');
        isScrolledHeader = false;
        return;
      }
    });

  let headerHeight = header ? header.getBoundingClientRect().height : 105;
  document.body.style.setProperty('--header-big', `${headerHeight}px`);

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.4, ease: 'power4.inOut' },
    });
    timelinePopup
      .from(item, { opacity: 0, display: 'none' })
      .from(popupInner, { opacity: 0 })
      .to(item, { display: 'flex', duration: 0.01 })
      .to(item, { opacity: 1 })
      .to(popupInner, { opacity: 1, duration: 0.2 });

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup');

  if (popups.length !== 0) {
    popups.forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup__close');
  const popupArr = document.querySelectorAll('.popup');

  const closePopup = (popup) => {
    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns.length !== 0) {
    popupCloseBtns.forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup =
          this.parentElement.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr.length !== 0) {
    popupArr.forEach((item) => {
      item.addEventListener('click', function (evt) {
        if (evt.target === this) {
          closePopup(this);
        }
      });
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const openedPopups = document.querySelectorAll('.popup._opened');
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);
    //console.log(evt.target);

    if (!popup) {
      return;
    }

    if (openedPopups.length !== 0) {
      console.log(openedPopups);
      openedPopups.forEach((opened) => {
        closePopup(opened);
      });
    }

    //console.log(popupAnimations, popupClass, evt.target);
    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns.length !== 0) {
    popupOpenBtns.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        openPopup(evt);
      });
    });
  }

  //swipers

  const sliderProgramContainers = document.querySelectorAll('.program-list');
  const initProgramSliders = {};

  const enableSliderProgram = (slider, pagination, index) => {
    const initSwiper = new Swiper(slider, {
      pagination: {
        el: pagination,
        clickable: true,
        type: 'fraction',
      },

      slidesPerView: 1,
      spaceBetween: 8,

      breakpoints: {
        550: {
          slidesPerView: 2,
        },
      },
    });

    initProgramSliders[index] = initSwiper;
  };

  //init all
  const initAllSliders = () => {
    if (sliderProgramContainers.length !== 0) {
      sliderProgramContainers.forEach((container, index) => {
        const slider = container.querySelector('.program-slider');
        if (!slider) {
          return;
        }

        const paginationContainer = container.querySelector(
          '.program-slider__pagination'
        );
        if (!paginationContainer) {
          return;
        }

        enableSliderProgram(slider, paginationContainer, index);
      });
    }
  };

  //destroy all
  const destroyAllSliders = () => {
    if (sliderProgramContainers.length !== 0) {
      sliderProgramContainers.forEach((container, index) => {
        const slider = initProgramSliders[index];

        if (slider === undefined) {
          return;
        }
        slider.destroy(true, true);
      });
    }
  };

  //if mobile init, if desk destroy
  if (document.body.clientWidth < 900) {
    initAllSliders();
  }

  const sliderBreakpoint = '(max-width: 899px)';
  const sliderBreakpointList = window.matchMedia(sliderBreakpoint);

  sliderBreakpointList.addEventListener('change', (evt) => {
    //console.log(sliderBreakpointList);
    if (evt.matches) {
      initAllSliders();
    } else {
      destroyAllSliders();
    }
  });

  //swipers
  const swiperNews = new Swiper('.how-slider.swiper', {
    navigation: {
      nextEl: '.how__buttons__slider__container .how-slider-next',
      // prevEl: '.how__buttons__slider__container .how-slider-prev',
    },

    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,

    breakpoints: {
      550: {
        slidesPerView: 1,
      },
      899: {
        slidesPerView: 1,
      },
      1199: {
        slidesPerView: 1,
      },
    },
  });
});
