import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const Hall = sequelize.define("Hall", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    seats: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidSeats(value: any) {
                if (
                    !Array.isArray(value) ||
                    !value.every(
                        (seat: any) =>
                            seat.hasOwnProperty("seatId") &&
                            seat.hasOwnProperty("priceMultiplier") &&
                            typeof seat.seatId === "string" &&
                            typeof seat.priceMultiplier === "number"
                    )
                ) {
                    throw new Error("Seats must be {seatId: string, priceMultiplier: number}");
                }
            },
        },
    },
    priceMultiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0,
        validate: {
            min: 0.1,
        },
    },
});

export default Hall;
