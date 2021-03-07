function Slider() {
  this.wrapper;
  this.dots;
  this.config = {
    elementName: '.slider-dmtk',
    dots: true,
  };
  this.prev;
  this.next;
  this.active;

  const init = (props) => {
    if (!isEmpty(props)) {
      this.config = { ...this.config, ...props };
    }

    this.wrapper = document.querySelector(props.elementName);
    this.active = setDefaultActive(this.wrapper);

    if (this.config.dots) {
      this.dots = loadDots();
    }

    lazyLoading(this.wrapper);

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

  const setActive = (element) => {
    this.active.classList.remove('-active');
    element.classList.add('-active');
    this.active = element;

    lazyImage(this.active);
    forceActivePosition();
  };

  const forceActivePosition = () => {
    if (!this.active) {
      return;
    }

    const { offsetLeft, clientWidth } = this.active;
    const activeDistance = offsetLeft + clientWidth;
    const wrapperSize = this.wrapper.clientWidth;

    if (activeDistance < wrapperSize || offsetLeft) {
      this.wrapper.scrollLeft = offsetLeft;
    }
  };

  const resizeObs = new ResizeObserver((entries) => {
    // TODO: review entries[0].contentRect.width to detect resizing
    forceActivePosition();
  });

  const lazyImage = (active) => {
    const img = active.querySelector('img');
    const lazy = img.getAttribute('data-lazy');

    if (lazy) {
      img.src = lazy;
    }
  };

  const loadDots = () => {
    const dots = Array.from({ length: this.wrapper.childElementCount }).map(createDot);
    bindClick(dots, this.wrapper.children);
    const container = createDotContainer();
    container.append(...dots);
    this.wrapper.parentElement.insertBefore(container, this.wrapper.nextElementSibling);

    return dots;
  };

  const bindClick = (dots, elements) => {
    const cells = Array.from(elements);
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (event) => {
        activeDot(event.target, dots);
        setActive(cells[index]);
      });
    });
  };

  return { init };
}

export { Slider };

const setDefaultActive = (slider) => {
  let active = document.querySelector('.cell.-active');

  if (!active) {
    const firstElem = slider.firstElementChild;
    firstElem.classList.add('-active');
    active = firstElem;
  }

  return active;
};

function lazyLoading(slider) {
  const images = Array.from(slider.querySelectorAll('img[data-lazy]'));

  images.forEach((image) => {
    image.addEventListener('load', removeLazyAttr, { once: true });
    image.onload = () => {
      image.classList.add('loaded');
    };
  });
}

function removeLazyAttr(event) {
  event.target.removeAttribute('data-lazy');
}

function createDot() {
  return document.createElement('li');
}

function createDotContainer() {
  const container = document.createElement('ul');
  container.classList.add('slider--dots');

  return container;
}

function activeDot(current, dots) {
  dots.forEach((dot) => {
    if (dot !== current) {
      dot.classList.remove('-active');
    } else {
      if (!current.classList.contains('-active')) {
        current.classList.add('-active');
      }
    }
  });
}

function isEmpty(value) {
  return Object.keys(value).length === 0;
}
