import "dotenv/config";
import User from "../models/User";
import { hashPassword } from "../controllers/authController";

const SUPER_ADMIN_EMAIL: string = process.env.SUPER_ADMIN_EMAIL as string;
const SUPER_ADMIN_PASSWORD: string = process.env.SUPER_ADMIN_PASSWORD as string;

export default async function createSuperAdmin() {
    const superAdminUser: any = await User.findOne({ where: { email: SUPER_ADMIN_EMAIL } });
    if (!superAdminUser) {
        const hashedPassword: string = await hashPassword(SUPER_ADMIN_PASSWORD);
        User.create({
            firstName: "Super",
            lastName: "Administrator",
            email: SUPER_ADMIN_EMAIL,
            hashedPassword,
            role: "superAdmin",
        });
    }
}
