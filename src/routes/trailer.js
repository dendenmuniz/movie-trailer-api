const express = require("express");
const axios = require("axios");
const router = express.Router();
const { getTrailerUrl } = require("../services/tmdb");

router.get("/trailer", async (req, res) => {
  const movieUrl = req.query.movie_url;

  if (!movieUrl) {
    return res.status(400).json({ error: "Movie URL is required" });
  }

  try {
    const imdbId = await extractImdbId(movieUrl);

    if (!imdbId) {
      return res
        .status(400)
        .json({ error: "Could not extract IMDb ID from the provided URL" });
    }

    const trailerUrl = await getTrailerUrl(imdbId);
    if (!trailerUrl) {
      return res.status(500).json({ error: "Could not fetch trailer URL" });
    }

    return res.json({ trailer_url: trailerUrl });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function extractImdbId(movieUrl) {
  try {
    const response = await axios.get(movieUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const data = response.data;
    const imdbId =
      data._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content
        .imdb.id;
    return imdbId;
  } catch (error) {
    console.error(`Error extracting IMDb ID from ${movieUrl}:`, error.message);
    return null;
  }
}

module.exports = router;
