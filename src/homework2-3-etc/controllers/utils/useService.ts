import { NextFunction, Response } from "express";
import { createError } from "../../middleware/utils/createError";
import { logger } from "../../middleware/utils/logger";

export async function useService<E, P>(
  res: Response,
  next: NextFunction,
  serviceMethod: (params: P) => Promise<E>,
  params?: P
): Promise<void> {
  (function logServiceCall() {
    const methodName = serviceMethod.name.split(" ")[1];
    const paramsForLog = { ...params };
    const hiddenParams = ["password"];

    hiddenParams.forEach((param) => {
      if (param in paramsForLog) {
        paramsForLog[param] = "***";
      }
    });

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
