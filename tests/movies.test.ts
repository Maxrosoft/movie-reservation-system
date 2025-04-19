import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import Movie from "../src/models/Movie";
import createSuperAdmin from "../src/utils/createSuperAdmin";
import "dotenv/config";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("MoviesController", () => {
    const testMovie: any = {
        title: "Test Movie",
        description: "A test movie",
        posterUrl: "http://example.com/test-movie.jpg",
        genres: ["Test Genre"],
    };
    let testMovieId: number;

    before(async () => {
        await createSuperAdmin();
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Movie.destroy({ where: { title: "Updated Test Movie" } });
        await Movie.destroy({ where: { title: "Partly Updated Test Movie" } });
    });

    after(async () => {
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Movie.destroy({ where: { title: "Updated Test Movie" } });
        await Movie.destroy({ where: { title: "Partly Updated Test Movie" } });
    });

    describe("POST /api/movies", () => {
        it("should add a new movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/movies")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(testMovie);
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal("Movie added successfully");
            testMovieId = res.body.data.movieId;
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/movies")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    title: testMovie.title,
                });
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal("Missed required parameter");
        });
    });

    describe("GET /api/movies", () => {
        it("should fetch all movies", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .get("/api/movies")
                .set("Cookie", [`adminToken=${adminToken}`]);
            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Movies fetched successfully");
            expect(res.body.data).to.have.property("page");
            expect(res.body.data).to.have.property("limit");
            expect(res.body.data).to.have.property("movies");
        });
    });

    describe("GET /api/movies/:movieId", () => {
        it("should fetch one movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .get(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`]);
            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Movie fetched successfully");
            expect(res.body.data).to.have.property("movie");
        });

        it("should return error for not found movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .get("/api/movies/0")
                .set("Cookie", [`adminToken=${adminToken}`]);
            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Movie not found");
        });
    });

    describe("PUT /api/movies/:movieId", () => {
        it("should update a movie completely", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedMovie = {
                title: "Updated Test Movie",
                description: "An updated test movie",
                posterUrl: "http://example.com/updated-test-movie.jpg",
                genres: ["Updated Genre"],
            };

            const res = await request(app)
                .put(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedMovie);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Movie changed successfully");
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({ title: "Incomplete Data" });

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });

        it("should return error for not found movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put("/api/movies/0")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    title: "Non Existent Movie",
                    description: "This movie does not exist",
                    posterUrl: "http://example.com/non-existent-movie.jpg",
                    genres: ["Non Existent Genre"],
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Movie not found");
        });
    });

    describe("PATCH /api/movies/:movieId", () => {
        it("should update a movie partly", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedMovie = {
                title: "Partly Updated Test Movie",
            };

            const res = await request(app)
                .patch(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedMovie);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Movie details changed successfully");
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .patch(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });

        it("should return error for not found movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .patch("/api/movies/0")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    title: "Non Existent Movie",
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Movie not found");
        });
    });

    describe("DELETE /api/movies/:movieId", () => {
        it("should delete a movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete(`/api/movies/${testMovieId}`)
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Movie deleted successfully");
        });

        it("should return error for not found movie", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete("/api/movies/0")
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Movie not found");
        });
    });
});
