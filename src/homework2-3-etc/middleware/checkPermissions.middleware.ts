import atob from "atob";
import { NextFunction, Request, Response } from "express";
import { BaseError } from "./utils/baseError";
import { EPermission } from "../domain/group.domain";

interface IJWTPayload {
  sub: string;
  permissions: EPermission[];
}

function parseJwt(token: string): IJWTPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload) as IJWTPayload;
}

export const checkPermissionsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["x-access-token"];
  const userPermissions = parseJwt(token as string).permissions;
  const eMessage = `You don't have permissions to ${req.method} ${req.originalUrl} on this server`;
  const eCode = 403;
  let error;

  switch (req.method) {
    case "GET":
      if (!userPermissions.includes(EPermission.READ)) {
        error = new BaseError(eMessage, eCode);
      }
      break;
    case "POST":
    case "PUT":
      if (!userPermissions.includes(EPermission.WRITE)) {
        error = new BaseError(eMessage, eCode);
      }
      break;
    case "DELETE":
      if (!userPermissions.includes(EPermission.DELETE)) {
        error = new BaseError(eMessage, eCode);
      }
      break;
  }

  if (error) {
    throw error;
  } else next();
};
