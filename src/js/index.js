import 'reset-css';
import '../scss/styles.scss';
import renderHeader from './modules/renderHeader.js';
import removeActive from './modules/util/removeActive.js';
import pageNav from './modules/pageNav.js';
import pageRender from './modules/util/pageRender.js';
import counter from './modules/util/counter.js';
import fetchData from './modules/util/fetchData.js';
import artworks from './modules/artworks.js';
import fetchPopup from './modules/util/fetchPopup.js';

// render the header section
renderHeader();

// get the nav items from the loaded dom elements
const tablist = document.querySelectorAll('.header__nav-link');

// get the main element from the dom
const pageMain = document.querySelector('.main');

// add event listener to the nav tab
pageNav(tablist, removeActive);

// define the api urls
const URL_ARTWORKS = 'https://api.artic.edu/api/v1/artworks?limit=20&fields=id,title,artist_display,place_of_origin,credit_line,term_titles,image_id';
const URL_LIKES = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/yf6dqoUrsU3EfHXvC1i4/likes';

fetchData(URL_ARTWORKS).then((artworksData) => {
  console.log(artworksData); // Log the artworksData array to the console
}).catch((error) => {
  console.error(error);
});

// call data from artwork api and render on page
Promise.all([
  fetchData(URL_ARTWORKS),
  fetchData(URL_LIKES)
]).then(([artworksData, likesData]) => {
  // get the artworks data array
  const artworksArr = artworksData.data;

  // combined likes objects information with the artworks object information
  const artworksAndLikes = artworksArr.map((artwork) => {
    const likesObj = likesData.find((like) => like.item_id === artwork.id.toString());
    return {
      ...artwork,
      likes: likesObj ? likesObj.likes : 0,
    };
  });

  // render content on page
  pageRender(pageMain, artworks, artworksAndLikes);
}).then(() => {
  // get the count element
  const artworksCount = document.querySelector('.artworks__count');

  // get the artwork card elements
  const artworkCollection = document.querySelectorAll('.artworks__item');

  // call the count function
  counter(artworkCollection, artworksCount);
}).then(() => {
  // add render comment pop-up here
  fetchPopup();
});
