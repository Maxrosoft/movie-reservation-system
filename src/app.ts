import express, { Express } from "express";
import "dotenv/config";
import authRouter from "./routes/authRouter";

const PORT: number | string = process.env.PORT || 3000;

const app: Express = express();

app.use("/api", authRouter);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
