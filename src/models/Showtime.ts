import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const Showtime = sequelize.define("Showtime", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isFuture(value: string): void {
                if (new Date(value) <= new Date()) {
                    throw new Error("The showtime start time must be in the future.");
                }
            },
        },
    },
    hallType: {
        type: DataTypes.ENUM("massive", "medium", "small", "luxury"),
        allowNull: false,
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

export default Showtime;
