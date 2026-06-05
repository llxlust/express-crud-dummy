import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import mysql from "mysql2/promise";
import { router } from "./routers/router";
import { ErrroHandler } from "./middlewares/error-handler";
dotenv.config();

const app = express();

const PORT = 3100;

const connectionString = process.env.DATABASE_URL || "";

export const pool = mysql.createPool(connectionString);

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use(ErrroHandler);
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
