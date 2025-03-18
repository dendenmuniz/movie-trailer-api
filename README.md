# Movie Trailer API

This project provides an API for retrieving movie trailer URLs based on **IMDb ID** or **Movie Title**. It integrates with **The Movie Database (TMDB)** to fetch trailer information and uses **Redis** for caching.

## Table of Contents

- [Movie Trailer API](#movie-trailer-api)
  - [Table of Contents](#table-of-contents)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Set up environment variables](#3-set-up-environment-variables)
  - [4. Running the application](#4-running-the-application)
  - [5. Running with Docker](#5-running-with-docker)
  - [6. Testing](#6-testing)
    - [Test Coverage](#test-coverage)
    - [Technologies Used for Testing](#technologies-used-for-testing)
  - [7. Features](#7-features)
    - [Next Features](#next-features)
  - [8. License](#8-license)

## 1. Clone the repository

Clone the repository using Git:

```bash
git clone https://github.com/dendenmuniz/movie-trailer-api.git
cd movie-trailer-api
```

## 2. Install dependencies

Install project dependencies using npm:

```bash
npm install
```

## 3. Set up environment variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
PORT=3000
TMDB_API_TOKEN=your_tmdb_api_token_here
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

Replace `your_tmdb_api_token_here` with your actual TMDB API token. The `PORT` variable specifies the port on which the server will run.

## 4. Running the application

Start the application in development mode using npm:

```bash
npm run dev
```

The API server will start locally on the specified port (default: 3000).

## 5. Running with Docker

To run the application with **Docker and Redis**, use the following command:

```bash
docker compose up --build
```

This will start the API server along with Redis in a containerized environment.

## 6. Testing

To run tests for the API, use Jest:

```bash
npx jest
```

This command will execute all test cases defined in the project.

### Test Coverage

The tests cover various aspects of the API, including:

- **Endpoint Functionality:** Ensuring that API endpoints return expected responses for valid inputs.
- **Error Handling:** Validating error responses for various error scenarios, such as missing parameters or internal server errors.

### Technologies Used for Testing

- **Jest:** A JavaScript testing framework for Node.js applications.
- **Supertest:** A library for testing HTTP assertions and endpoints.

## 7. Features

- **GET /api/trailer**: Retrieves the trailer URL for a movie based on:
  - `imdb_id` (IMDb ID of the movie)
  - `movie_id` (TMDB Movie ID)
  - `title` (Movie Title – returns suggestions if multiple results are found)
- **Redis Caching**: Stores previously fetched trailer URLs for faster responses.
- **Error Handling**: Custom error handling middleware to manage various error scenarios.

### Next Features

- **Rate Limiting**: Implements rate limiting to prevent abuse and excessive requests using `express-rate-limit` and Redis.
- **More Video Sources**: Expand the API to fetch trailers from multiple video sources beyond YouTube.

## 8. License

This project is licensed under the MIT License - see the LICENSE file for details.
