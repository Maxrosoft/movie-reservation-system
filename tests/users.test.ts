import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import User from "../src/models/User";
import createSuperAdmin from "../src/utils/createSuperAdmin";
import { hashPassword } from "../src/controllers/authController";
import "dotenv/config";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("Users API", () => {
    let testUser: any;
    before(async () => {
        await createSuperAdmin();
        await User.destroy({ where: { email: "john.doe@example.com" } });
        testUser = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            hashedPassword: await hashPassword("Password123"),
            role: "user",
        });
    });

    after(async () => {
        await User.destroy({ where: { email: "john.doe@example.com" } });
    });

    describe("PUT /api/users/:userId/promote", () => {
        it("should promote a user to admin", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .put(`/api/users/${testUser.id}/promote`)
                .set("Cookie", [`adminToken=${adminToken}`]);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("User promoted successfully");
        });
    });

    describe("PUT /api/users/:userId/demote", () => {
        it("should demote a user to user", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });

            const superAdminToken = loginRes.body.data.superAdminToken;

            const res = await request(app)
                .put(`/api/users/${testUser.id}/demote`)
                .set("Cookie", [`superAdminToken=${superAdminToken}`]);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("Admin demoted successfully");
        });
    });
});
