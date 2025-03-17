const request = require("supertest");
const { app, server } = require("../src/app");

describe("GET /api/trailer", () => {
  //close server after testing
  afterAll((done) => {
    server.close(() => {
      console.log("Server closed after tests.");
      done();
    });
  });

  it("should return trailer URL for a valid IMDb ID", async () => {
    const res = await request(app)
      .get("/api/trailer")
      .query({ imdb_id: "tt0137523" }); // Fight Club

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("trailer_url");
    expect(res.body.trailer_url).toContain("youtube.com/watch");
  });

  it("should return 400 if neither IMDb ID nor title is provided", async () => {
    const res = await request(app).get("/api/trailer");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(
      "You must provide either an IMDb ID or a movie title"
    );
  });

  it("should return 404 for an invalid IMDb ID", async () => {
    const res = await request(app)
      .get("/api/trailer")
      .query({ imdb_id: "tt0000000" });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("No trailer found for the given movie");
  });

  it("should return suggestions for a general movie title", async () => {
    const res = await request(app)
      .get("/api/trailer")
      .query({ title: "Batman" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("suggestions");
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });
  
});
