function Slider() {
  this.wrapper;
  this.prev;
  this.next;
  this.active;

  const init = (props) => {
    this.wrapper = document.querySelector(props.elementName);
    this.active = document.querySelector('.sliderItem.-active');
    this.prev = document.querySelector('.actions-prev');
    this.next = document.querySelector('.actions-next');
    this.prev.addEventListener('click', prevClicked);
    this.next.addEventListener('click', nextClicked);
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
    this.active = document.querySelector('.sliderItem.-active');
  };

  return { init, nextClicked };
}

export { Slider };
