const axios = require("axios");

async function getTrailerUrl(imdbId) {
  if (!imdbId) {
    throw new Error("IMDb ID is required");
  }
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
    },
  };
  try {
    const response = await axios.request(options).then(function (response) {
      return response;
    });

    const movie = response.data.movie_results[0];
    if (!movie) {
      throw new Error(`No movie found with IMDb ID ${imdbId}`);
    }

    const movieId = movie.id;
    const movieOptions = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    };

    const trailersResponse = await axios
      .request(movieOptions)
      .then(function (response) {
        return response;
      });

    const trailers = trailersResponse.data.results;
    const trailer = trailers.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (!trailer) {
      throw new Error(`No trailer found for movie with IMDb ID ${imdbId}`);
    }

    return `https://www.youtube.com/watch?v=${trailer.key}`;
  } catch (error) {
    console.error(`Error fetching trailer URL: ${error.message}`);
    return null;
  }
}

module.exports = { getTrailerUrl };
