require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

import { AppDataSource } from "./ormconfig";
import settingRouter from "./routes/setting.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import lessionRouter from "./routes/lession.routes";
import uploadsRouter from "./routes/upload.routes";
import analyticRouter from "./routes/analytic.routes";

import validateEnv from "./utils/validateEnv";
import { responseErrors } from "./utils/common";
import { Setting } from "./entities/setting.entity";
import { User } from "./entities/user.entity";

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // 1. Body parser
    app.use(express.json({ limit: "10mb" }));

    // 2. Logger
    if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

    // 3. Cors
    app.use(
      cors({
        origin: "*",
        credentials: false,
      })
    );

    // ROUTES
    app.use("/api/settings", settingRouter);
    app.use("/api/users", userRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/lessions", lessionRouter);
    app.use("/api/upload", uploadsRouter);
    app.use("/api/analytics", analyticRouter);

    // HEALTH CHECKER
    app.get("/api/healthChecker", async (_, res: Response) => {
      // const message = await redisClient.get('try');

      res.status(200).json({
        status: "success",
        message: "Welcome to LMSTL Core, we are happy to see you",
      });
    });

    app.get("/api/initial", async (_, res: Response) => {
      // 5. Create super admin

      console.log("in if");

      console.log("Inserting a new user into the database...");
      const user = new User();
      user.email = "admin@lms.co";
      user.password = process.env.POSTGRES_PASSWORD ?? "";
      user.role = "admin";
      user.firstname = "super";
      user.lastname = "admin";
      user.class = "admin";
      user.class_number = "0";
      user.verified = true;

      await AppDataSource.manager.save(user);
      console.log("Saved a new user with id: " + user.id);

      // 5. Create ui settings
      const settingRepository = AppDataSource.getRepository(Setting);
      console.log("Inserting a new settings into the database...");
      const setting = new Setting();

      setting.home_title = "All Lessions";
      setting.home_subtitle = "see all learning";
      setting.sign_in_title = "LMSTL";
      setting.sign_in_subtitle = "sign in to continue access";

      setting.register_title = "LMSTL";
      setting.register_subtitle = "registration to continue access";

      setting.phone = "081-234-5678";
      setting.location = "location";
      setting.email = "admin@lms.co";

      await AppDataSource.manager.save(setting);
      console.log("Initialize a new setting with id: " + setting.id);

      res.status(200).json({
        status: "success",
        message: "initial !",
      });
    });

    // HEALTH CHECKER
    app.get("/api", async (_, res: Response) => {
      // const message = await redisClient.get('try');

      res.status(200).json({
        status: "success",
        message: "Cc Api",
      });
    });

    // UNHANDLED ROUTE
    app.all("*", (req: any, res: Response, next: NextFunction) => {
      return responseErrors(res, 400, `Route ${req.originalUrl} not found`);
    });

    // make default port
    let port = 3000;
    if (process.env.APP_ENV === "development") {
      port = Number(process.env.PORT);
    } else {
      port = Number(process.env.PORT_BUILD);
    }

    app.listen(port);
    console.log(
      `\n⚡️[server]: Server is running at https://localhost:${port}\n`
    );
  })
  .catch((error) => console.log(error));
