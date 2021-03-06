function Slider() {
  this.wrapper;
  this.prev;
  this.next;
  this.active;

  const init = (props) => {
    this.wrapper = document.querySelector(props.elementName);
    this.active = document.querySelector('.cell.-active');
    this.prev = document.querySelector('.actions-prev');
    this.next = document.querySelector('.actions-next');
    this.prev.addEventListener('click', prevClicked);
    this.next.addEventListener('click', nextClicked);
    resizeObs.observe(this.wrapper);
  };

  const prevClicked = () => {
    this.wrapper.scrollLeft -= this.active.clientWidth;
    updateActive('prev');
  };

  const nextClicked = () => {
    this.wrapper.scrollLeft += this.active.clientWidth;
    updateActive('next');
  };

  const updateActive = (direction) => {
    const directionSibling = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
    const currentActive = this.active;
    const siblingElement = currentActive[directionSibling];
    if (siblingElement) {
      // could be disabled by rendering
      currentActive.classList.remove('-active');
      siblingElement.classList.add('-active');
    }
    this.active = document.querySelector('.cell.-active');
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

  return { init };
}

export { Slider };
