function Slider() {
  this.wrapper;
  this.prev;
  this.next;
  this.active;

  const init = (props) => {
    this.wrapper = document.querySelector(props.elementName);
    this.active = setActive(this.wrapper);
    lazyLoading();

    // Move to new method to create dinamy by props
    this.prev = document.querySelector('.actions-prev');
    this.next = document.querySelector('.actions-next');
    this.prev.addEventListener('click', prevClicked);
    this.next.addEventListener('click', nextClicked);

    resizeObs.observe(this.wrapper);
  };

  const prevClicked = () => {
    this.wrapper.scrollLeft -= this.active.clientWidth;

    updateActive('previousElementSibling');
  };

  const nextClicked = () => {
    this.wrapper.scrollLeft += this.active.clientWidth;

    updateActive('nextElementSibling');
  };

  const updateActive = (direction) => {
    const currentActive = this.active;
    const siblingElement = currentActive[direction];

    if (siblingElement) {
      // could be disabled by rendering
      currentActive.classList.remove('-active');
      siblingElement.classList.add('-active');
    }

    this.active = document.querySelector('.cell.-active');

    lazyImage(this.active);
    forceActivePosition(); // check force on wrapper scroll
  };

  const setActive = (slider) => {
    let active = document.querySelector('.cell.-active');

    if (!active) {
      const firstElem = slider.firstElementChild;
      firstElem.classList.add('-active');
      active = firstElem;
    }

    return active;
  };

  const forceActivePosition = () => {
    const { offsetLeft, clientWidth } = this.active;
    const activeDistance = offsetLeft + clientWidth;
    const wrapperSize = this.wrapper.clientWidth;

    if (this.active && (activeDistance < wrapperSize || offsetLeft)) {
      this.wrapper.scrollLeft = offsetLeft;
    }
  };

  const resizeObs = new ResizeObserver((entries) => {
    // TODO: review entries[0].contentRect.width to detect resizing
    forceActivePosition();
  });

  const lazyLoading = () => {
    const images = Array.from(this.wrapper.querySelectorAll('img[data-lazy]'));

    images.forEach((image) => {
      image.addEventListener('load', removeLazyAttr, { once: true });
      image.onload = () => {
        image.classList.add('loaded');
      };
    });
  };

  const removeLazyAttr = (event) => {
    event.target.removeAttribute('data-lazy');
  };

  const lazyImage = (active) => {
    const img = active.querySelector('img');
    const lazy = img.getAttribute('data-lazy');

    if (lazy) {
      img.src = lazy;
    }
  };

  return { init };
}

export { Slider };
