import * as dotenv from "dotenv";
dotenv.config();

import { checkEnvVariables } from "./helpers/envCheck";
checkEnvVariables();

import express, { Application } from "express";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { makeLogger } from "./logger/Config";
import path from "path";
import { config } from "./config";
import { DataBaseLogger } from "./logger/DatabaseLogger";
import cors from "cors";
import cron from "node-cron";
// import { graphqlUploadExpress } from "graphql-upload";

const FILE_NAME = "logs";
const LOG_FILE_PATH = path.join(__dirname, "log", FILE_NAME);
console.log("logger file path " + LOG_FILE_PATH);

import { v1Router } from "./routes";

import swaggerOptions from "./swagger";
// opening a db connection
import { DataBase } from "./db/connection";
DataBase.getDatabaseConnection();

// initializing the logger and storing it to global scope
global.logger = makeLogger({
  logFile: config.logger.LOG_IN_FILE,
  FILE_PATH: LOG_FILE_PATH,
});

global.dbLogger = new DataBaseLogger();
global.dbLogger.connect();

const app: Application = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", v1Router);

app.use("*", (req, res) => {
  res.status(404);
  res.send({
    isSuccess: false,
    data: null,
    statusCode: 404,
    errors: [
      {
        code: 404,
        message: "Error 404",
      },
    ],
  });
});

export { app };
