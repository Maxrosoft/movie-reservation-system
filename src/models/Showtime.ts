import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Movie from "./Movie";
import Hall from "./Hall";

const Showtime = sequelize.define("Showtime", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0.0,
        },
    },
    occupiedSeats: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    }
});

Movie.hasMany(Showtime, {
    foreignKey: "movieId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Showtime.belongsTo(Movie, {
    foreignKey: "movieId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Hall.hasMany(Showtime, {
    foreignKey: "hallId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Showtime.belongsTo(Hall, {
    foreignKey: "hallId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Showtime;

