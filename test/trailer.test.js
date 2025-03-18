const request = require('supertest');
const { app, server } = require('../src/app');
const redisClient = require('../src/utils/redisClient');

describe('GET /api/trailer', () => {
  //close server after testing
  afterAll(async () => {
    await server.close(() => {
      console.log('Server closed after tests.');
    });
    await redisClient.quit();
  });

  it('should return trailer URL for a valid IMDb ID', async () => {
    const res = await request(app).get('/api/trailer').query({ imdb_id: 'tt0137523' }); // Fight Club

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('trailer_url');
    expect(res.body.trailer_url).toContain('youtube.com/watch');
  });

  it('should return trailer URL for a valid Movie ID', async () => {
    const res = await request(app).get('/api/trailer').query({ movie_id: '550' }); // Fight Club

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('trailer_url');
    expect(res.body.trailer_url).toContain('youtube.com/watch');
  });

  it('should return 400 if neither IMDb ID, Movie ID nor title is provided', async () => {
    const res = await request(app).get('/api/trailer');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe(
      'You must provide either an IMDb ID, a Movie ID, or a movie title'
    );
  });

  it('should return 404 for an invalid IMDb ID', async () => {
    const res = await request(app).get('/api/trailer').query({ imdb_id: 'tt0000000' });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Could not find a Movie ID for this IMDb ID');
  });

  it('should return 404 for an invalid Movie ID', async () => {
    const res = await request(app).get('/api/trailer').query({ movie_id: '999999999' }); //  ID inexistent film

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('No trailer found for the given movie');
  });

  it('should return 400 if Movie ID is not numeric', async () => {
    const res = await request(app).get('/api/trailer').query({ movie_id: 'invalid' }); // string instead of number

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toBe('Movie id must be numeric');
  });

  it('should return suggestions for a general movie title', async () => {
    const res = await request(app).get('/api/trailer').query({ title: 'Batman' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('suggestions');
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });

  it('should return cached trailer URL from Redis', async () => {
    const movieId = '550'; // Fight Club

    // Primeira requisição - deve buscar da API TMDB
    const firstRes = await request(app).get('/api/trailer').query({ movie_id: movieId });

    expect(firstRes.statusCode).toEqual(200);
    expect(firstRes.body).toHaveProperty('trailer_url');

    // Segunda requisição - deve retornar do cache
    const secondRes = await request(app).get('/api/trailer').query({ movie_id: movieId });

    expect(secondRes.statusCode).toEqual(200);
    expect(secondRes.body).toHaveProperty('trailer_url');
    expect(secondRes.body.trailer_url).toBe(firstRes.body.trailer_url);
  });
});
