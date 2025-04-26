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

    describe("POST /api/auth/logout", () => {
        it("should logout the current user", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", [`token=${token}`]);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("Logged out successfully");
        });
    });

    describe("POST /api/auth/refresh-token", () => {
        it("should refresh the logged-in user's tokens", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/auth/refresh-token")
                .set("Cookie", [`token=${token}`]);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.include("Refreshed successfully");
        });
    });

    describe("POST /api/auth/change-password", () => {
        it("should change the password for the logged-in user", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/auth/change-password")
                .set("Cookie", [`token=${token}`])
                .send({
                    oldPassword: "Password123",
                    newPassword: "Password123",
                });
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("Password changed successfully");
        });

        it("should return error for wrong old password", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "john.doe@example.com",
                password: "Password123",
            });
            const token = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/auth/change-password")
                .set("Cookie", [`token=${token}`])
                .send({
                    oldPassword: "wrongPassword",
                    newPassword: "Password123",
                });
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal("Wrong password");
        });
    });
});
