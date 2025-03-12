const axios = require("axios");

const TMDB_API_URL = "https://api.themoviedb.org/3";

async function getTrailerUrl(movieId) {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    // Buscar trailers do filme
    const trailersResponse = await axios.get(
      `${TMDB_API_URL}/movie/${movieId}/videos?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      }
    );

    const trailer = trailersResponse.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.error(`Error fetching trailer URL: ${error.message}`);
    return null;
  }
}

async function getMovieIdByTitle(movieTitle) {
  console.log(`Searching for movie with title: ${movieTitle}`);
  try {
    const searchResponse = await axios.get(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(movieTitle)}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      }
    );

    return searchResponse.data.results.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date || "Unknown",
      id: movie.id, // Agora retorna o ID do TMDB
    }));
  } catch (error) {
    console.error(`Error fetching movie ID: ${error.message}`);
    return [];
  }
}

module.exports = { getTrailerUrl, getMovieIdByTitle };
