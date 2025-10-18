import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    return Promise.reject(new Error("API key authentication not implemented"));
  }

  if (securityName === "jwt") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(token, "[secret]", function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          var typeSafeScopes: string[] = scopes || [];
          if (typeSafeScopes.length === 0) reject(new Error("Controller has no scopes"));
          // Check if JWT contains all required scopes
          for (let scope of typeSafeScopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error("JWT does not contain required scope."));
            }
          }
          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new Error("Unknown authentication method"));
}