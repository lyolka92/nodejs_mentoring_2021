import { NextFunction, Response } from "express";
import { createError } from "../../middleware/utils/createError";
import { logger } from "../../middleware/utils/logger";

export async function useServiceWithParams<E, P>(
  res: Response,
  next: NextFunction,
  serviceMethod: (params: P) => Promise<E>,
  params: P,
  isLoggerOn = true
): Promise<void> {
  isLoggerOn &&
    (function logServiceCall() {
      const methodName = serviceMethod.name.split(" ")[1];
      const paramsForLog = { ...params };

      if (Object.prototype.hasOwnProperty.call(paramsForLog, "password")) {
        // @ts-ignore
        delete paramsForLog["password"];
      }

      logger.info(
        `${methodName} was called with the following params: ${JSON.stringify(
          paramsForLog
        )}`
      );
    })();

  try {
    const data = await serviceMethod(params);
    res.status(200).json(data);
  } catch (err) {
    next(createError(err));
  }
}

export async function useServiceWithoutParams<E>(
  res: Response,
  next: NextFunction,
  serviceMethod: () => Promise<E>,
  isLoggerOn = true
): Promise<void> {
  isLoggerOn &&
    (function logServiceCall() {
      const methodName = serviceMethod.name.split(" ")[1];
      logger.info(`${methodName} was called`);
    })();

  try {
    const data = await serviceMethod();
    res.status(200).json(data);
  } catch (err) {
    next(createError(err));
  }
}
