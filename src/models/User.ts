import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    hashedPassword: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [60, 100],
        },
    },
    role: {
        type: DataTypes.ENUM({
            values: ["user", "admin", "superAdmin"],
        }),
        defaultValue: "user",
        allowNull: false,
    },
});

export default User;
