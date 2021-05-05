import expressWinston from "express-winston";
import winston from "winston";
import { Request, Response } from "express";

const baseLoggerConfig = {
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
  requestWhitelist: ["query", "body"],
  blacklistedMetaFields: ["message", "trace", "process", "os", "stack"],
};

export const logger = winston.createLogger(baseLoggerConfig);

const requestLoggerConfig = {
  winstonInstance: logger,
  statusLevels: false,
  level: (req: Request, res: Response) => {
    switch (true) {
      case res.statusCode >= 500:
        return "error";
      case res.statusCode >= 400:
        return "warn";
      default:
        return "info";
    }
  },
};

export const requestLogger = expressWinston.logger(requestLoggerConfig);
