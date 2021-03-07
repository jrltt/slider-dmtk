import './scss/slider-dmtk.scss';

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
}

Slider.prototype.init = function (props) {
  if (!isEmpty(props)) {
    this.config = { ...this.config, ...props };
  }

  this.wrapper = document.querySelector(props?.elementName || this.config.elementName);

  if (this.config.dots) {
    this.dots = this.loadDots();
  }

  if (this.config.arrowActions) {
    this.createArrowActions();
  }

  this.active = this.setDefaultActive(this.wrapper);

  this.lazyLoading(this.wrapper);

  this.resizeObs().observe(this.wrapper);
};

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

Slider.prototype.setActive = function (element) {
  this.active.classList.remove('-active');
  element.classList.add('-active');
  this.active = element;

  this.lazyImage(this.active);
  this.forceActivePosition();
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
  this.wrapper.scrollLeft += this.active.clientWidth;

  this.updateActive('nextElementSibling');
};

Slider.prototype.updateActive = function (direction) {
  const currentActive = this.active;
  const siblingElement = currentActive[direction];

  // TODO Disabled arrow at beginning and at the end
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

  if (offsetLeft === 0) {
    this.wrapper.scrollLeft = offsetLeft;
  } else {
    // TODO: Review position when last item is selected
    if (activeDistance < wrapperSize || offsetLeft) {
      this.wrapper.scrollLeft = offsetLeft;
    }
  }
};

Slider.prototype.resizeObs = function () {
  return new ResizeObserver((entries) => {
    // TODO: review entries[0].contentRect.width to detect resizing
    this.forceActivePosition();
  });
};

Slider.prototype.lazyLoading = function (slider) {
  const images = Array.from(slider.querySelectorAll('img[data-lazy]'));

  images.forEach((image) => {
    image.addEventListener('load', removeLazyAttr, { once: true });
    image.onload = () => {
      image.classList.add('loaded');
    };
  });
};

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

Slider.prototype.loadDots = function () {
  const dots = Array.from({ length: this.wrapper.childElementCount }).map(() => giveMeAnElement('li', ['slider--dot']));
  this.bindDotsClick(dots);
  const container = giveMeAnElement('ul', ['slider--dots']);
  container.append(...dots);
  this.wrapper.parentElement.insertBefore(container, this.wrapper.nextElementSibling);

  return dots;
};

Slider.prototype.bindDotsClick = function (dots) {
  const cells = Array.from(this.wrapper.children);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
      this.activeDot(event.target);
      this.setActive(cells[index]);
    });
  });
};

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

export { Slider };
