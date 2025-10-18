import express, {
  json,
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "../build/routes";
import { connectToDatabase } from "./core/services/database.service";
import cors from "cors";
import { requestLogger, responseLogger } from "./core/logging/logging.middleware";
import { ClientSafeError } from "./core/error/error.types";

export const app = express();

const corsConfig: cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  credentials: true
};

// Apply CORS middleware before routes
app.use(cors(corsConfig));

// Add logging middleware early in the chain
app.use(requestLogger);
app.use(responseLogger);

connectToDatabase()
  .then(() => {
    // Use body parser to read sent json payloads
    app.use(
      urlencoded({
        extended: true,
      })
    );
    app.use(json());

    RegisterRoutes(app);

    // error handling

    app.use(function errorHandler(
      err: unknown,
      _: ExRequest,
      res: ExResponse,
      next: NextFunction
    ): ExResponse | void {
      if (err instanceof ValidateError) {
        return res.status(422).json({
          message: "Validation Failed",
          details: err?.fields,
        });
      }
      if (err instanceof ClientSafeError) {
        return res.status(500).json({
          message: err.message,
        });
      }
      if (err instanceof Error) {
        if (process.env.NODE_ENV !== "production") {
          return res.status(500).json({
            message: err.message,
            stack: err.stack?.split('\n') || [],
          });
        } else {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
      }

      next();
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });