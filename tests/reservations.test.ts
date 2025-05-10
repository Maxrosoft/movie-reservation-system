import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import Reservation from "../src/models/Reservation";
import Movie from "../src/models/Movie";
import Hall from "../src/models/Hall";
import Showtime from "../src/models/Showtime";
import createSuperAdmin from "../src/utils/createSuperAdmin";
import "dotenv/config";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("Reservation tests", () => {
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
    let testReservationId: number;
    before(async () => {
        await createSuperAdmin();
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Hall.destroy({ where: { name: "Test Hall" } });
        const movie: any = await Movie.create(testMovie);
        const hall: any = await Hall.create(testHall);
        testMovieId = movie.id;
        testHallId = hall.id;
        const testShowtime: any = {
            movieId: testMovieId,
            hallId: testHallId,
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            price: 10,
            occupiedSeats: [],
            isTest: true,
        };
        const showtime: any = await Showtime.create(testShowtime);
        testShowtimeId = showtime.id;
    });

    after(async () => {
        await Movie.destroy({ where: { title: "Test Movie" } });
        await Hall.destroy({ where: { name: "Test Hall" } });
        await Showtime.destroy({ where: { movieId: testMovieId, hallId: testHallId } });
    });

    describe("POST /api/reservations", () => {
        it("should add a new reservation", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/reservations")
                .set("Cookie", [`token=${token}`])
                .send({
                    showtimeId: testShowtimeId,
                    seats: ["1", "2"],
                });
            expect(res.status).to.equal(201);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Reservation added successfully");
            testReservationId = res.body.data.reservationId;
        });
        
        it("should return error for not found showtime", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/reservations")
                .set("Cookie", [`token=${token}`])
                .send({
                    showtimeId: 0,
                    seats: ["1", "2"],
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Showtime not found");
        });

        it("should return error for not found seats", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/reservations")
                .set("Cookie", [`token=${token}`])
                .send({
                    showtimeId: testShowtimeId,
                    seats: ["999"],
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Seats not found");
        });

        it("should return error for occupied seats", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/reservations")
                .set("Cookie", [`token=${token}`])
                .send({
                    showtimeId: testShowtimeId,
                    seats: ["1"],
                });

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Seats already reserved");
        });
    });

    describe("DELETE /api/reservations/:reservationId", () => {
        it("should cancel a reservation", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .delete(`/api/reservations/${testReservationId}`)
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Reservation canceled successfully");
        });

        it("should return error for not found reservation", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .delete("/api/reservations/0")
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Reservation not found");
        });
    });
});
