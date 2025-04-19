import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import User from "../src/models/User";

describe("Auth API", () => {
    after(async () => {
        await User.destroy({ where: { email: "john.doe@example.com" } });
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const res = await request(app).post("/api/auth/register").send({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "Password123",
            });
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal("User registered successfully");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login an existing user", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            expect(res.status).to.equal(200);
            expect(res.body.message).to.include("logged in successfully");
        });
    });

    describe("GET /api/auth/me", () => {
        it("should return the logged-in user's info", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .get("/api/auth/me")
                .set("Cookie", [`token=${token}`]);
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property("email", "john.doe@example.com");
        });
    });
});




