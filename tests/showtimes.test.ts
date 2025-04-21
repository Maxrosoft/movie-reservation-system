import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import Movie from "../src/models/Movie";
import Hall from "../src/models/Hall";
import createSuperAdmin from "../src/utils/createSuperAdmin";
import "dotenv/config";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("Showtimes API", () => {
    const testMovie: any = {
        title: "Test Movie",
        description: "A test movie",
        posterUrl: "http://example.com/test-movie.jpg",
        genres: ["Test Genre"],
    };
    let testMovieId: number;
    const testHall: any = {
        name: "Test Hall",
        seats: [
            { seatId: "1", priceMultiplier: 1.0 },
            { seatId: "2", priceMultiplier: 1.5 },
            { seatId: "3", priceMultiplier: 2.0 },
        ],
        priceMultiplier: 1.0,
    };
    let testHallId: number;
    let testShowtimeId: number;
    before(async () => {
        await createSuperAdmin();
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Hall.destroy({ where: { name: "Test Hall" } });
        const movie: any = await Movie.create(testMovie);
        const hall: any = await Hall.create(testHall);
        testMovieId = movie.id;
        testHallId = hall.id;
    });

    after(async () => {
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Hall.destroy({ where: { name: "Test Hall" } });
    });

    describe("POST /api/showtimes", () => {
        it("should add a new showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/showtimes")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    movieId: testMovieId,
                    hallId: testHallId,
                    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    price: 10,
                });
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal("Showtime added successfully");
            testShowtimeId = res.body.data.showtimeId;
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/showtimes")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    movieId: testMovieId,
                });
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal("Missed required parameter");
        });
    });

    describe("GET /api/showtimes", () => {
        it("should fetch all showtimes", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get("/api/showtimes")
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Showtimes fetched successfully");
            expect(res.body.data).to.have.property("page");
            expect(res.body.data).to.have.property("limit");
            expect(res.body.data).to.have.property("showtimes");
        });
    });

    describe("GET /api/showtimes/:showtimeId", () => {
        it("should fetch one showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Showtime fetched successfully");
            expect(res.body.data).to.have.property("showtime");
        });

        it("should return error for not found showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get("/api/showtimes/0")
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Showtime not found");
        });
    });

    describe("PUT /api/showtimes/:showtimeId", () => {
        it("should update showtime completely", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedShowtime = {
                movieId: testMovieId,
                hallId: testHallId,
                startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                price: 15,
            };

            const res = await request(app)
                .put(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedShowtime);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Showtime changed successfully");
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });

        it("should return error for not found showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put(`/api/showtimes/0`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    movieId: testMovieId,
                    hallId: testHallId,
                    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                    price: 15,
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Showtime not found");
        });
    });

    describe("PATCH /api/showtimes/:showtimeId", () => {
        it("should update showtime partly", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedShowtime = {
                price: 12,
            };

            const res = await request(app)
                .patch(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedShowtime);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Showtime details changed successfully");
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .patch(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });

        it("should return error for not found showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .patch(`/api/showtimes/0`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    price: 12,
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Showtime not found");
        });
    });

    describe("DELETE /api/showtimes/:showtimeId", () => {
        it("should delete a showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete(`/api/showtimes/${testShowtimeId}`)
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Showtime deleted successfully");
        });

        it("should return error for not found showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete("/api/showtimes/0")
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Showtime not found");
        });
    });
});
