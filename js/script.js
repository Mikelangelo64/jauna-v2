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

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);
    console.log(evt.target);

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

  if (popupCloseBtns) {
    Array.from(popupCloseBtns).forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup =
          this.parentElement.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    Array.from(popupArr).forEach((item) => {
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
});
