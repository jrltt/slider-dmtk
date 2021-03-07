# slider-dmtk 🖼

Responsive carousel image gallery

## Useful commands

- Start server`npm run start`
- Build `npm run build`

## How to use it

For a detailed implementation please see README file inside the `/example` folder

Install

```bash
npm i -S slider-dmtk-1.0.0.tgz
```

Import styles

```css
@import 'slider-dmtk/dist/slider-dmtk.css';
```

Import script

```javascript
import { Slider } from 'slider-dmtk';

const configuration = {
  arrowActions: true,
  dots: true,
  elementName: '.slider-dmtk',
};

const slider = new Slider();
slider.init(configuration);
```

### Available configuration

- `arrowActions` Boolean, show or hide the arrow buttons
- `dots` Boolean, show or hide dots navigation
- `elementName` String, class name selector for bind the slider

### Markup

```html
<div class="slider-dmtk--container">
  <ul class="slider-dmtk">
    <li class="cell">
      <div class="cell-wrapper">
        <img src="image.jpg" />
      </div>
    </li>
    …
  </ul>
</div>
```

### Lazy loading

For lazy loading add the `data-lazy` attribute to `img` elements

```html
…
<img data-lazy="image.jpg" />
…
```

## Next actions

- [x] Detail documentation 📄
- [ ] Increase test coverage 🧪
- [ ] Refactor `Slider` adapted to `Class` ⚙️
- [ ] Simplify markup 🎒
- [ ] Refactor SCSS & class names (apply ABEM) 💅
- [ ] Clean up `TODO` comments 🧹
- [ ] Fix Eslint 🔨
