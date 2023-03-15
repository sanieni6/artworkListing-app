import artworks from './artworks.js';
import fetchData from './util/fetchData.js';
import counter from './util/counter.js';
import pageRender from './util/pageRender.js';
import fetchPopup from './util/fetchPopup.js';
// get the main element from the dom
const pageMain = document.querySelector('.main');

const pageNav = (navItems, removeClass) => {
  navItems.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      if (event.target.textContent === 'Artworks') {
        // call the remove class function
        removeClass(navItems);

        // add active class to target
        event.target.classList.add('active');

        // clear the content of the main
        pageMain.innerHTML = '';

        // define the api urls
        const URL_ARTWORKS = 'https://api.artic.edu/api/v1/artworks?limit=20&fields=id,title,artist_display,place_of_origin,credit_line,term_titles,image_id';
        const URL_LIKES = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/yf6dqoUrsU3EfHXvC1i4/likes';

        // call data from artwork api and render on page
        Promise.all([
          fetchData(URL_ARTWORKS),
          fetchData(URL_LIKES),
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
      } else if (event.target.textContent === 'Exhibitions') {
        // call the remove class function
        removeClass(navItems);

        // add active class to target
        event.target.classList.add('active');

        // clear the content of the main
        pageMain.innerHTML = '';
      } else if (event.target.textContent === 'Shop') {
        // call the remove class function
        removeClass(navItems);

        // add active class to target
        event.target.classList.add('active');

        // clear the content of the main
        pageMain.innerHTML = '';
      }
    });
  });
};

export default pageNav;
