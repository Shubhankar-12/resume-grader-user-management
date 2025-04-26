import express from "express";
import { mediaRouter } from "./MediaRouter";
import { authRouter } from "./AuthRouter";
import { resumeRouter } from "./ResumeRouter";
const v1Router = express.Router();

v1Router.use("/media", mediaRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/resume", resumeRouter);
export { v1Router };
