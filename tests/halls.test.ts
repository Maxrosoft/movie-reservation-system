import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import Hall from "../src/models/Hall";
import createSuperAdmin from "../src/utils/createSuperAdmin";
import "dotenv/config";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("Halls API", () => {
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

    before(async () => {
        await createSuperAdmin();
        await Hall.destroy({ where: { name: "Test Hall" } });
        await Hall.destroy({ where: { name: "Updated Hall Name" } });
    });

    after(async () => {
        await Hall.destroy({ where: { name: "Test Hall" } });
        await Hall.destroy({ where: { name: "Updated Hall Name" } });
    });

    describe("POST /api/halls", () => {
        it("should add a new hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/halls")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(testHall);

            expect(res.status).to.equal(201);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Hall added successfully");
            expect(res.body.data).to.have.property("hallId");
            testHallId = res.body.data.hallId;
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .post("/api/halls")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({ name: "Incomplete Hall" });

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });
    });

    describe("GET /api/halls", () => {
        it("should fetch all halls", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get("/api/halls")
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Halls fetched successfully");
            expect(res.body.data).to.have.property("page");
            expect(res.body.data).to.have.property("limit");
            expect(res.body.data).to.have.property("halls");
        });
    });

    describe("GET /api/halls/:hallId", () => {
        it("should fetch one hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get(`/api/halls/${testHallId}`)
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Hall fetched successfully");
            expect(res.body.data).to.have.property("hall");
        });

        it("should return error for not found hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get("/api/halls/0")
                .set("Cookie", [`token=${token}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Hall not found");
        });
    });

    describe("PUT /api/halls/:hallId", () => {
        it("should update a hall completely", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedHall = {
                name: "Updated Hall Name",
                seats: [
                    { seatId: "A", priceMultiplier: 1.0 },
                    { seatId: "B", priceMultiplier: 1.5 },
                    { seatId: "C", priceMultiplier: 2.0 },
                ],
                priceMultiplier: 1.5,
            };

            const res = await request(app)
                .put(`/api/halls/${testHallId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedHall);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Hall updated successfully");
        });

        it("should return error for missing parameters", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put(`/api/halls/${testHallId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({});

            expect(res.status).to.equal(400);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Missed required parameter");
        });

        it("should return error for not found hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put("/api/halls/0")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    name: "Updated Hall Name",
                    seats: [
                        { seatId: "A", priceMultiplier: 1.0 },
                        { seatId: "B", priceMultiplier: 1.5 },
                        { seatId: "C", priceMultiplier: 2.0 },
                    ],
                    priceMultiplier: 1.5,
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Hall not found");
        });
    });

    describe("PATCH /api/halls/:hallId", () => {
        it("should update a hall partly", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const updatedHall = {
                priceMultiplier: 2.0,
            };

            const res = await request(app)
                .patch(`/api/halls/${testHallId}`)
                .set("Cookie", [`adminToken=${adminToken}`])
                .send(updatedHall);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Hall details changed successfully");
        });

        it("should return error for not found hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .patch("/api/halls/0")
                .set("Cookie", [`adminToken=${adminToken}`])
                .send({
                    priceMultiplier: 2.0,
                });

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Hall not found");
        });
    });

    describe("DELETE /api/halls/:hallId", () => {
        it("should delete one hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete(`/api/halls/${testHallId}`)
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Hall deleted successfully");
        });

        it("should return error for not found hall", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .delete("/api/halls/0")
                .set("Cookie", [`adminToken=${adminToken}`]);

            expect(res.status).to.equal(404);
            expect(res.body.type).to.equal("error");
            expect(res.body.message).to.equal("Hall not found");
        });
    });
});
