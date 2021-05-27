import { logger, loggerMiddleware } from "./middleware/utils/logger";
import { Controller } from "./controllers/models";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import express from "express";
import { uncaughtExceptionMiddleware } from "./middleware/uncaughtException.middleware";
import { unhandledRejectionMiddleware } from "./middleware/unhandledRejection.middleware";

dotenv.config();

export class App {
  public app: express.Application;
  private readonly isLoggerOn: boolean;
  private readonly PORT: string;
  private server;

  constructor(controllers: Controller[], isLoggerOn = true, port?: string) {
    this.isLoggerOn = isLoggerOn;
    this.PORT = port || process.env.PORT || "3000";
    this.app = express();

    this.useCors();
    this.initMiddleware();
    this.isLoggerOn && this.initLogger();
    this.initControllers(controllers);
    this.initErrorMiddleware();

    this.server = this.app.listen(this.PORT, () => {
      this.isLoggerOn &&
        logger.info(
          `✨ Server is started and running on http://${
            process.env.HOST || "localhost"
          }:${this.PORT}`
        );
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  public stopServer(): void {
    this.server.close();
  }

  private useCors() {
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
      ],
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    };
    this.app.use(cors(corsOptions));
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initLogger() {
    this.app.use(loggerMiddleware);
  }

  private initControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initErrorMiddleware() {
    process.on("unhandledRejection", unhandledRejectionMiddleware);
    process.on("uncaughtException", uncaughtExceptionMiddleware);
    this.app.use(errorMiddleware);
  }
}
