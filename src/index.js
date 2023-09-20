import { fetchImages } from "./pixabay-api";
import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.getElementById("search-form");
const galleryEl = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".js-load-more")

let page = 1;
let inputData = "";
let gallery = "";
const cardHeight = "360";

function renderImages (arr, container) {
    const markup = arr.map(
        img => `<a href="${img.largeImageURL}">
        <div class="photo-card">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="400px"/>
        <div class="info">
        <p class="info-item">
        <b>Likes</b><br/>
        ${img.likes} 
        </p>
        <p class="info-item">
        <b>Views</b><br/>
        ${img.views} 
        </p>
        <p class="info-item">
      <b>Comments</b><br/>
      ${img.comments} 
        </p>
        <p class="info-item">
        <b>Downloads</b><br/>
        ${img.downloads} 
        </p>
        </div>
    </div>
 </a>`
    )
    .join("");

  container.insertAdjacentHTML("beforeend",markup);
};

formEl.addEventListener("submit", onSubmitHandler);

async function onSubmitHandler(e) {
  e.preventDefault();
  galleryEl.innerHTML = "";
  page = 1;
  inputData = e.target[0].value;
  const res = await fetchImages(inputData, page);
  
  if (res.data.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
  } else {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    loadMoreBtn.classList.replace("load-more", "load-more-hidden");
    return
  };
  renderImages(res.data.hits, galleryEl);
  gallery = new SimpleLightbox('.gallery a', { captionDelay: "250" });
  loadMoreBtn.classList.replace("load-more-hidden", "load-more");
  
  if (galleryEl.childElementCount >= res.data.totalHits) {
  loadMoreBtn.classList.replace("load-more", "load-more-hidden");
  };
}

async function loadMoreHandler() {
page += 1;
  const res = await fetchImages(inputData, page);
  await renderImages(res.data.hits, galleryEl);
  gallery.refresh();
  
  if (galleryEl.childElementCount >= res.data.totalHits) {
  loadMoreBtn.classList.replace("load-more", "load-more-hidden");
  };

  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
  });
};

loadMoreBtn.addEventListener("click", loadMoreHandler);