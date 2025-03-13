const express = require("express");
const router = express.Router();
const { query, validationResult } = require("express-validator");
const { getTrailerUrl } = require("../services/tmdb");
const { getMovieIdByTitle } = require("../services/tmdb");
const ErrorHandler = require("../utils/errorHandler");

router.get(
  "/trailer",
  [
    query("imdb_id")
      .optional()
      .isString()
      .trim()
      .escape()
      .matches(/^tt\d+$/)
      .withMessage("IMDb ID must be a valid format (e.g., tt1234567)"),

    query("title")
      .optional()
      .isString()
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Movie title must be a non-empty string"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { imdb_id, title } = req.query;

      if (!imdb_id && !title) {
        throw new ErrorHandler(
          "You must provide either an IMDb ID or a movie title",
          400
        );
      }

      // Se o usuário passou apenas o título, busca o ID do TMDB
      if (!imdb_id && title) {
        const movieResults = await getMovieIdByTitle(title);

        if (!movieResults.length) {
          throw new ErrorHandler(
            "Could not find any movie matching that title",
            404
          );
        }

        // Se houver múltiplos resultados, retorna sugestões
        if (movieResults.length > 1) {
          return res.json({
            message:
              "Multiple movies found, please refine your search. Choose one of the list below and search through IMDB:",
            suggestions: movieResults.map((movie) => ({
              title: movie.title,
              release_date: movie.release_date,
              movie_id: movie.id,
            })),
          });
        }

        // Usa o ID do TMDB do primeiro resultado encontrado
        imdb_id = movieResults[0].id;
      }

      const trailerUrl = await getTrailerUrl(imdb_id);
      if (!trailerUrl) {
        throw new ErrorHandler("No trailer found for the given movie", 404);
      }

      res.json({ trailer_url: trailerUrl });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
