import './index.scss';
// TODO replace for package from node_modules
import { Slider } from './../../dist/main';
import { createApi } from 'unsplash-js';

const sliderElm = document.querySelector('.slider');
const slider = new Slider();
const data = fetchImages();

data.then((results) => {
  const images = results.map((image) => buildNode(image));

  sliderElm.append(...images);

  slider.init({ elementName: '.slider' });
});

async function fetchImages() {
  try {
    const browserApi = createApi({
      accessKey: process.env.SECRETS.UNSPLASH_ACCESS_KEY,
    });
    const result = await browserApi.photos.getRandom({ orientation: 'landscape', count: 5 });
    const images = result.response.map((data) => ({
      alt: data.alt_description || 'Unsplash image',
      url: data.urls.regular,
    }));

    return images;
  } catch (error) {
    console.error('Something goes wrong, please try again');
  }
}

function buildNode({ alt, url }) {
  const image = document.createElement('img');
  const cellWrapper = document.createElement('div');
  const cell = document.createElement('li');

  image.setAttribute('data-lazy', url);
  image.alt = alt;

  cellWrapper.classList.add('cell-wrapper');
  cellWrapper.appendChild(image);

  cell.classList.add('cell');
  cell.appendChild(cellWrapper);

  return cell;
}
