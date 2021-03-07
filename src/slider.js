function Slider() {
  this.wrapper;
  this.dots;
  this.config = {
    arrowActions: true,
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

    this.wrapper = document.querySelector(props?.elementName || this.config.elementName);

    if (this.config.dots) {
      this.dots = loadDots();
    }

    if (this.config.arrowActions) {
      this.createArrowActions();
    }

    this.active = this.setDefaultActive(this.wrapper);

    lazyLoading(this.wrapper);

    resizeObs.observe(this.wrapper);
  };

  const setActive = (element) => {
    this.active.classList.remove('-active');
    element.classList.add('-active');
    this.active = element;

    this.lazyImage(this.active);
    this.forceActivePosition();
  };

  const resizeObs = new ResizeObserver((entries) => {
    // TODO: review entries[0].contentRect.width to detect resizing
    this.forceActivePosition();
  });

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
        this.activeDot(event.target);
        setActive(cells[index]);
      });
    });
  };

  return { init };
}

export { Slider };

Slider.prototype.setDefaultActive = function (slider) {
  let active = document.querySelector('.cell.-active');

  if (!active) {
    const firstElem = slider.firstElementChild;
    firstElem.classList.add('-active');
    active = firstElem;

    if (this.config.dots) {
      const [firstDot] = this.dots;
      firstDot.classList.add('-active');
    }
  }

  return active;
};

Slider.prototype.createArrowActions = function () {
  const prev = giveMeAnElement('div', ['actions', 'actions-prev']);
  prev.innerText = '<';
  const next = giveMeAnElement('div', ['actions', 'actions-next']);
  next.innerText = '>';

  prev.addEventListener('click', () => {
    this.prevClicked();
  });
  next.addEventListener('click', () => {
    this.nextClicked();
  });

  this.wrapper.parentElement.insertBefore(prev, this.wrapper);
  this.wrapper.parentElement.insertBefore(next, this.wrapper);
};

Slider.prototype.prevClicked = function () {
  this.wrapper.scrollLeft -= this.active.clientWidth;

  this.updateActive('previousElementSibling');
};

Slider.prototype.nextClicked = function () {
  console.log('this.wrapper', this.wrapper);
  this.wrapper.scrollLeft += this.active.clientWidth;

  this.updateActive('nextElementSibling');
};

Slider.prototype.updateActive = function (direction) {
  const currentActive = this.active;
  const siblingElement = currentActive[direction];

  if (siblingElement) {
    // could be disabled by rendering
    currentActive.classList.remove('-active');
    siblingElement.classList.add('-active');
  }

  this.active = document.querySelector('.cell.-active');

  this.setActiveDot();
  this.lazyImage(this.active);
  this.forceActivePosition(); // check force on wrapper scroll
};

Slider.prototype.forceActivePosition = function () {
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

function lazyLoading(slider) {
  const images = Array.from(slider.querySelectorAll('img[data-lazy]'));

  images.forEach((image) => {
    image.addEventListener('load', removeLazyAttr, { once: true });
    image.onload = () => {
      image.classList.add('loaded');
    };
  });
}

Slider.prototype.lazyImage = function (active) {
  const img = active.querySelector('img');
  const lazy = img.getAttribute('data-lazy');

  if (lazy) {
    img.src = lazy;
  }
};

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

Slider.prototype.activeDot = function (current) {
  this.dots.forEach((dot) => {
    if (dot !== current) {
      dot.classList.remove('-active');
    } else {
      if (!current.classList.contains('-active')) {
        current.classList.add('-active');
      }
    }
  });
};

Slider.prototype.setActiveDot = function () {
  const index = Array.prototype.indexOf.call(this.wrapper.children, this.active);
  this.activeDot(this.dots[index]);
};

function isEmpty(value) {
  return Object.keys(value).length === 0;
}

function giveMeAnElement(type, classes) {
  const element = document.createElement(type);
  element.classList.add(...classes);

  return element;
}
