// Consts
const apiKey = "23ab2f06c2039ff26f9ca89d17c32991";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = 'https://image.tmdb.org/t/p/original';
const apiPaths = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
  fetchMovieList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
  fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-Us`,
  searchOnYoutube:(query)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAk-JqdUjKNDJR342DL8fsOL4y2EpAYhmQ`
};
console.log(apiPaths.fetchTrending)
// boost up the app

function init() {
  fetchTrendigMovies();
  
  fetchAndBuildAllSections();
}

function fetchTrendigMovies() {
  fetchAndBuildAllSection(apiPaths.fetchTrending, 'Trendig Now')
  .then(list=>{
    const randomBanner = parseInt(Math.random()*list.length)
    buildBannerSection(list[randomBanner]);
  }).catch(err=>{console.error(err)})
}

function buildBannerSection(movie){
  const bannerCont = document.getElementById('banner-section')
  bannerCont.style.backgroundImage=`url(${imgPath}${movie.backdrop_path})`
  console.log(movie,'movie')
const div = document.createElement('div');
div.innerHTML =` 
<h2 class="banner-title">${movie.title}</h2>
<p class="banner-info">${movie.release_date}</p>
<p class="banner-overview">
 ${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+'...':movie.overview}
</p>
<div class="action-button-cont">
  <button class="action-button">
    <i class="fa-solid fa-play"></i>Play
  </button>
  <button class="action-button action">
    <img src="images/info.png" class="info" /> Info
  </button>
</div>
`
div.className = 'banner-content container' 
bannerCont.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildAllSection(
            apiPaths.fetchMovieList(category.id),
            category.name
          );
        });
      }
      // console.table(categories)
    })
    .catch((err) => {
      console.error(err);
    });
}

function fetchAndBuildAllSection(fetchUrl, categoryName) {
  // console.log(fetchUrl , categorie)
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      //   console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildMoviesSection(list, categoryName) {
  //   console.log(list, categoryName);
  const moviesCont = document.getElementById('movies-cont');
  const moviesListHtml = list.map(item => {
    return ` 
    <div class="movie-item" onmouseover="searchMovieTrailer('${item.title}','yt${item.id}')">
    <img src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="movie-item-img">
    <iframe width="245px" height="150px"
    src="" id="yt${item.id}">
    </iframe>
    
    <span class="add-to-list">+</span>
    </div>
    `
  })
  const movieSectionHtml = `
  <h2 class="movie-section-heading">${categoryName}<span class="explore">Expore All</span></h2>
  <div class="movies-row">
  ${moviesListHtml}
  </div>
  `
  const div = document.createElement('div');
  div.className = 'movies-section'
  div.innerHTML = movieSectionHtml;

  //   append html into movies container
  moviesCont.append(div)
  // console.log(movieSectionHtml)
}

function searchMovieTrailer(movieName,iframeId) {
  // console.log(movieName,iframeId)

  if(!movieName) return;
  fetch(apiPaths.searchOnYoutube(movieName))
  .then(res=>res.json())
  .then(res=>{
   
    const result = res.items[0];
    const youtubeUrl = `https:www.youtube.com/watch?v=${result.id.videoId}`;
    // console.log(youtubeUrl)
    // window.open(youtubeUrl,'_blank')
    const element = document.getElementById(iframeId)
    element.src=`https://www.youtube.com/embed/${result.id.videoId}?controls`
    // ""
    console.log(element,'gaurav')

  }).catch(err=>{console.log(err)})
}

window.addEventListener("load", (e) => {
  init();
  window.addEventListener('scroll',(e)=>{
    const header = document.getElementById('header');
    if(window.scrollY > 5){
      header.classList.add('black-bg');
    } else{
      header.classList.remove('black-bg')
    }
  })
});
