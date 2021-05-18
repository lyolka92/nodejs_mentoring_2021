import expressWinston from "express-winston";
import winston from "winston";
import { Request, Response } from "express";

const baseLoggerConfig = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.simple()
  ),
};

export const logger = winston.createLogger(baseLoggerConfig);

const loggerMiddlewareConfig = {
  winstonInstance: logger,
  statusLevels: false,
  level: (req: Request, res: Response): string =>
    res.statusCode >= 400 ? "error" : "info",
};

export const loggerMiddleware = expressWinston.logger(loggerMiddlewareConfig);
