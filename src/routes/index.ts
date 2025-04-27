import express from "express";
import { mediaRouter } from "./MediaRouter";
import { authRouter } from "./AuthRouter";
import { resumeRouter } from "./ResumeRouter";
import { userRouter } from "./UserRouter";
import { tailoredResumeRouter } from "./TailoredResumeRouter";
const v1Router = express.Router();

v1Router.use("/media", mediaRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/resume", resumeRouter);
v1Router.use("/tailored-resume", tailoredResumeRouter);
v1Router.use("/user", userRouter);
export { v1Router };
