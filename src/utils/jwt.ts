import { SignJWT, type JWTPayload } from "jose";
import { createSecretKey } from "node:crypto";
import env from "../../env.ts";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

export const generateToken = (payload: JWTPayload) => {
  const secret = env.JWT_SECRET;
  const secretKey = createSecretKey(secret, "utf-8");

  //   Create a signed JWT
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || "7d")
    .sign(secretKey);
};
