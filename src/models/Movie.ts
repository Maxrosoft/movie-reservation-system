import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const Movie = sequelize.define("Movie", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    posterUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUrl: true,
        },
    },
    genres: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            notEmptyArray(value: string[]) {
                if (value.length === 0) {
                    throw new Error("Genres array must have at least one element.");
                }
            },
            hasNoEmptyStrings(value: string[]) {
                for (let genre of value) {
                    if (!genre) {
                        throw new Error("Genres array must not contain empty strings.");
                    }
                }
            },
        },
    },
});

export default Movie;
