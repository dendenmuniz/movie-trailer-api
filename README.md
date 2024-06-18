
# Movie Trailer API

This project provides an API for retrieving movie trailer URLs based on movie URLs from Viaplay. It integrates with The Movie Database (TMDB) to fetch trailer information.

## Table of Contents

1\. [Clone the repository](#1-clone-the-repository)

2\. [Install dependencies](#2-install-dependencies)

3\. [Set up environment variables](#3-set-up-environment-variables)

4\. [Running the application](#4-running-the-application)

5\. [Testing](#5-testing)

6\. [Features](#6-features)

7\. [License](#7-license)

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

NODE_ENV=development

```

Replace `your_tmdb_api_token_here` with your actual TMDB API token. The `PORT` variable specifies the port on which the server will run.

## 4. Running the application

Start the application in development using npm:

```bash

npm run dev

```

The API server will start locally on the specified port (default: 3000).

## 5. Testing

To run tests for the API, use Jest:

```bash

npx jest

```

This command will run all test cases defined in the project.

### Test Coverage

The tests cover various aspects of the API, including:

- **Endpoint Functionality:** Tests ensure that API endpoints return expected responses for valid inputs.

- **Error Handling:** Tests validate error responses for various error scenarios, such as missing parameters or internal server errors.

### Technologies Used for Testing

- **Jest:** A JavaScript testing framework for Node.js applications.

- **Supertest:** A library for testing HTTP assertions and endpoints.

## 6. Features

-   **GET /api/trailer**: Retrieves trailer URL for a movie based on a Viaplay URL containing IMDb ID.
-   **Error Handling**: Custom error handling middleware to manage various error scenarios.

### Next Features

-   **Rate Limiting**: Implements rate limiting to prevent abuse and excessive requests using express-rate-limit and Redis.

## 7. License

This project is licensed under the MIT License - see the LICENSE file for details.

```
