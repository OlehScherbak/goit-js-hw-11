import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

var lightbox = new SimpleLightbox('.gallery a');

const galleryContainer = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.addEventListener('click', onLoadMoreClick);

const form = document.querySelector('.search-form');
form.addEventListener('submit', onFormSubmit);

let page = 1;
let totalHits;
let searchQuery;

function onFormSubmit(evt, searchQuery) {
  evt.preventDefault();
  searchQuery = form.searchQuery.value.trim();
  loadMoreBtn.classList.add('visually-hidden');

  if (searchQuery !== '') {
    imgSearch(searchQuery, page);
  } else {
    return Notiflix.Notify.failure(
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

    console.log(searchQuery);
    console.log(response.data);
    console.log(response.data.hits);

    totalHits = response.data.total;

    createMarkup(response.data);
    if (totalHits > page * options.params.per_page) {
      page += 1;
      loadMoreBtn.classList.remove('visually-hidden');
    } else {
      loadMoreBtn.classList.add('visually-hidden');
    }
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
  lightbox.refresh();
}
function onLoadMoreClick(searchQuery, page) {
  imgSearch(searchQuery, page);
}
