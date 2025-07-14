import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Rate limiting untuk API yang lebih ketat
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: "Too many requests for this endpoint, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting untuk operasi CRUD yang sensitive
export const crudLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 POST/PUT/DELETE requests per minute
  skip: (req: Request) => req.method === "GET",
  message: {
    error: "Too many write operations, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware untuk timeout request
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          error: "Request timeout",
          message: "The request took too long to process",
        });
      }
    }, timeoutMs);

    res.on("finish", () => {
      clearTimeout(timeout);
    });

    next();
  };
};
