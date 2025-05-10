import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import "dotenv/config";
import createSuperAdmin from "../src/utils/createSuperAdmin";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

describe("Admin API", () => {
    describe("GET /api/admin/reservations", () => {
        before(async () => {
            createSuperAdmin();
        });

        it("should get all reservations", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            const adminToken = loginRes.body.data.adminToken;

            const res = await request(app)
                .get("/api/admin/reservations")
                .set("Cookie", [`adminToken=${adminToken}`]);
            expect(res.status).to.equal(200);
            expect(res.body.type).to.equal("success");
            expect(res.body.message).to.equal("Reservations found successfully");
        });
    });
});
