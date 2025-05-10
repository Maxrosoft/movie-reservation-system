import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";
import User from "./User";
import Showtime from "./Showtime";

const Reservation = sequelize.define("Reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            notEmptyArray(value: string[]) {
                if (value.length === 0) {
                    throw new Error("Seats array must have at least one element.");
                }
            },
            hasNoEmptyStrings(value: string[]) {
                for (let genre of value) {
                    if (!genre) {
                        throw new Error("Seats array must not contain empty strings.");
                    }
                }
            },
        },
    }
});

Reservation.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
User.hasMany(Reservation, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Reservation.belongsTo(Showtime, {
    foreignKey: "showtimeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Showtime.hasMany(Reservation, {
    foreignKey: "showtimeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Reservation;