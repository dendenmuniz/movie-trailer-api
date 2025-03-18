const axios = require('axios');
const redis = require('../utils/redisClient');

const TMDB_API_URL = 'https://api.themoviedb.org/3';

async function getTrailerUrl(movieId) {
  if (!movieId) {
    throw new Error('Movie ID is required');
  }

  // Verify if the trailer URL is cached
  const cachedTrailer = await redis.get(`trailer:${movieId}`);
  if (cachedTrailer) {
    console.log('Cache hit! Returning from Redis.');
    return cachedTrailer;
  }

  try {
    // Search for the trailer URL
    const trailersResponse = await axios.get(
      `${TMDB_API_URL}/movie/${movieId}/videos?language=en-US`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      }
    );

    const trailer = trailersResponse.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.error(`Error fetching trailer URL: ${error.message}`);
    return null;
  }
}

async function getMovieIdByTitle(movieTitle) {
  try {
    const searchResponse = await axios.get(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(movieTitle)}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        },
      }
    );

    return searchResponse.data.results.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date || 'Unknown',
      id: movie.id, // Add the movie ID to the response
    }));
  } catch (error) {
    console.error(`Error fetching movie ID: ${error.message}`);
    return [];
  }
}

async function getMovieIdByImdb(imdbId) {
  if (!imdbId) {
    throw new Error('IMDb ID is required');
  }

  try {
    const axiosConfig = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/find/${imdbId}`,
      params: { external_source: 'imdb_id' },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    };

    const response = await axios(axiosConfig);

    const movieResults = response.data.movie_results;

    if (!movieResults || movieResults.length === 0) {
      throw new Error(`No movie found with IMDb ID ${imdbId}`);
    }

    return movieResults[0].id;
  } catch (error) {
    console.error(`Error fetching Movie ID for IMDb ID ${imdbId}:`, error.message);
    return null;
  }
}

module.exports = { getTrailerUrl, getMovieIdByTitle, getMovieIdByImdb };
