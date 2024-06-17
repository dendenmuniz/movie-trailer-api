const request = require('supertest');
const { app, server } = require('../src/app');

describe('GET /api/trailer', () => {
    afterAll((done) => {
        server.close(done);
    });

    it('should return trailer URL for a valid movie URL', async () => {
        const res = await request(app)
            .get('/api/trailer')
            .query({ movie_url: 'https://content.viaplay.se/pc-se/film/arrival-2016' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('trailer_url');
    });

    it('should return 400 if movie URL is not provided', async () => {
        const res = await request(app).get('/api/trailer');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});
