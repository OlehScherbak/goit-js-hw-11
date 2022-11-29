import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

var lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});

const galleryContainer = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  // alreadyShown = 0;
  const searchQuery = form.searchQuery.value.trim();

  if (searchQuery !== '') {
    imgSearch(searchQuery);
  } else {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function imgSearch(searchQuery, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '31679627-0bccaed8555ea749f004800c2',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(BASE_URL, options);
    // alreadyShown += response.data.hits.length;

    console.log(response.data);
    console.log(response.data.hits);
    createMarkup(response.data);
    console.log(createMarkup(response.data));
  } catch (error) {
    console.log(error);
  }
}
function createMarkup(imgArray) {
  const markup = imgArray.hits
    .map(i => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = i;

      return `<div class="photo-card">
                  <a class="gallery__link" href="${largeImageURL}" >
                      <img class="gallery__image"src="${webformatURL}" alt="${tags}" loading="lazy"/>
                  </a>
                  <div class="info">
                      <p class="info-item">
                      <b>Likes</b> ${likes}
                      </p>
                      <p class="info-item">
                      <b>Views</b> ${views}
                      </p>
                      <p class="info-item">
                      <b>Comments</b> ${comments}
                      </p>
                      <p class="info-item">
                      <b>Downloads</b> ${downloads}
                      </p>
                  </div>
              </div>`;
    })
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  // simpleLightBox.refresh();
}
