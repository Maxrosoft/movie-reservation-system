import express, { Express } from "express";
import "dotenv/config";
import authRouter from "./routes/authRouter";
import sequelize from "./config/sequelize";

const PORT: number | string = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());
app.use("/api/auth/", authRouter);

(async () => {
    try {
        await sequelize.sync();
        console.log("Database connected successfully :)");
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (error) {
        console.log("Database connection failed :(");
    }
})();
