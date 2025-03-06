import express, { Express } from "express";
import "dotenv/config";

const PORT: number | string = process.env.PORT || 3000;

const app: Express = express();

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
