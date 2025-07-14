import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import { Logger } from "../utils/logger";

// Interface untuk API Response yang konsisten
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// Middleware untuk format response yang konsisten
export const formatResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Override res.json untuk format yang konsisten
  const originalJson = res.json;

  res.json = function (data: any) {
    if (data && typeof data === "object" && !data.success && !data.error) {
      // Jika data belum diformat, format dengan struktur API yang konsisten
      const formattedResponse: ApiResponse = {
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      };
      return originalJson.call(this, formattedResponse);
    }

    // Jika sudah diformat atau error, kembalikan apa adanya
    return originalJson.call(this, data);
  };

  next();
};

// Middleware untuk error handling yang lebih detail
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Colorful error logging dengan Logger utility
  Logger.error(`${req.method} ${req.path}: ${err.message}`);

  if (process.env.NODE_ENV === "development" && err.stack) {
    console.error(chalk.gray(err.stack));
  }

  // Jika response sudah dikirim, delegate ke Express default
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Internal server error";

  // Handle different types of errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate entry";
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  }

  const errorResponse: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  };

  res.status(statusCode).json(errorResponse);
};

// Middleware untuk logging request
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    Logger.request(
      req.method,
      req.path,
      res.statusCode,
      duration,
      req.ip || "unknown"
    );
  });

  next();
};
