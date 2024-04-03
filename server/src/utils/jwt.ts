import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { responseErrors } from "./common";

export const signJwt = (payload: Object) => {
  let privateKey = Buffer.from(
    process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY as string,
    "base64"
  ).toString("utf-8");

  const signInOptions: jwt.SignOptions = {
    algorithm: "RS256",
    expiresIn: "24h",
  };

  return jwt.sign(payload, privateKey, signInOptions);
};

export const verifyJwt = (req: any, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"] as string;

  if (!bearerHeader) {
    return responseErrors(res, 401, "Require Token");
  }

  const splitAuthHeader = bearerHeader.split(" ");
  const token = splitAuthHeader[1];

  let publicKey = Buffer.from(
    process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY as string,
    "base64"
  ).toString("utf-8");

  try {
    const decoded = jwt.verify(token, publicKey);
    req.user = decoded;
  } catch (err) {
    return responseErrors(res, 401, "Invalid Token");
  }

  next();
};
