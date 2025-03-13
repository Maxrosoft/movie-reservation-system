import "dotenv/config";
import User from "../models/User";
import { hashPassword } from "../controllers/authController";

const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD as string;

export default async function createAdmin() {
    const adminUser: any = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (!adminUser) {
        const hashedPassword: string = await hashPassword(ADMIN_PASSWORD);
        User.create({
            firstName: "System",
            lastName: "Administrator",
            email: ADMIN_EMAIL,
            hashedPassword,
            role: "admin",
        });
    }
}
