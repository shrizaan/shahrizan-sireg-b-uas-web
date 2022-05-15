// ajax js menggunakan fetch tetapi di refactor dengan menggunakan async await
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (error) {
    errorToast(error);
  }
});

// menambahkan event handler tipe click untuk elemen baru, yaitu elemen yang memiliki class '.modal-detail-btn' dan menampilkan detail film sesuai nilai dari data atribute imdb yang bersangkutan
addGlobalEventListener("click", ".modal-detail-btn", async function (e) {
  try {
    const imdbid = e.target.dataset.imdbid;
    const movieDetailApi = await getMoviesDetail(imdbid);
    const movieDetail = showMovieDetail(movieDetailApi);
    document.querySelector(".modal-body").innerHTML = movieDetail;
  } catch (error) {
    console.log(error);
  }
});

// function ini digunakan untuk menambahkan event handler dengan berbagai tipe event sesuai yang kita inginkan, untuk elemen yang akan datang.
// caranya tinggal panggil function ini, setelah membuat elemen baru di javascript
// tentukan tipe eventnya, selector elemennya, dan callback functionnya
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// event binding akhir

function getMovies(inputKeyword) {
  return fetch("http://www.omdbapi.com/?apikey=47ec8035&s=" + inputKeyword)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((movie) => (cards += showCards(movie)));
  document.querySelector(".movie-container").innerHTML = cards;
}

function getMoviesDetail(imdbid) {
  return (
    fetch("http://www.omdbapi.com/?apikey=47ec8035&i=" + imdbid)
      // .then((response) => console.log(response))
      // .then((response) => console.log(response.json()))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Detail movie tidak ditemukan");
        }
        return response.json();
      })
  );
}

function errorToast(error) {
  var myToastEl = document.getElementById("myToast");
  var myToast = new bootstrap.Toast(myToastEl);
  myToast.show();
  myToastEl.addEventListener("shown.bs.toast", function () {
    document.querySelector(".toast-body").innerHTML = error;
  });
  console.log(error);
}

function showCards(movie) {
  return `<div class="d-flex col-md-4 my-2">
            <div class="card text-dark d-flex flex-column">
              <img src="${movie.Poster}" class="card-img-top flex-shrink-3">
              <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <h6 class="card-subtitle mb-2">${movie.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-btn" data-imdbid="${movie.imdbID}" data-bs-toggle="modal"
                data-bs-target="#movieDetailModal">Show Details</a>
              </div>
            </div>
          </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <img src="${m.Poster}" alt="" class="img-fluid">
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h3>${m.Title} (${m.Year})</h3>
                  </li>
                  <li class="list-group-item">
                    <strong>Director: </strong> ${m.Director}
                  </li>
                  <li class="list-group-item">
                    <strong>Actors: </strong> ${m.Actors}
                  </li>
                  <li class="list-group-item">
                    <strong>Writer: </strong> ${m.Writer}
                  </li>
                  <li class="list-group-item">
                    <strong>Plot: </strong> <br>
                    ${m.Plot}
                  </li>
                </ul>
              </div>
            </div>
          </div>`;
}
