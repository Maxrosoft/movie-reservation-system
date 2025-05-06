import express, { Express } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import usersRouter from "./routes/usersRouter";
import moviesRouter from "./routes/moviesRouter";
import showtimesRouter from "./routes/showtimesRouter";
import hallsRouter from "./routes/hallsRouter";
import errorHandler from "./middlewares/errorHandler";
import sequelize from "./config/sequelize";
import createSuperAdmin from "./utils/createSuperAdmin";
import "./utils/automaticShowtimesDeletion";

const PORT: number | string = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth/", authRouter);
app.use("/api/users/", usersRouter);
app.use("/api/movies/", moviesRouter);
app.use("/api/showtimes/", showtimesRouter);
app.use("/api/halls/", hallsRouter);
app.use(errorHandler as any);

(async () => {
    try {
        await sequelize.sync();
        await createSuperAdmin();
        console.log("Database connected successfully :)");
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (error) {
        console.log("Database connection failed :(");
    }
})();

export default app;
