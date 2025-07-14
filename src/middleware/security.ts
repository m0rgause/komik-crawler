import { Request, Response, NextFunction } from "express";

// Middleware untuk CORS yang lebih detailed
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Allowed origins from environment variable
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8080",
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Access-Token",
  ],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
  maxAge: 86400, // 24 hours
};

// Middleware untuk security headers tambahan
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';"
  );

  // X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");

  // X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY");

  // X-XSS-Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
};

// Middleware untuk API versioning
export const apiVersioning = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default API version jika tidak ada
  if (!req.headers["api-version"]) {
    req.headers["api-version"] = "v1";
  }

  // Add API version to response headers
  res.setHeader("API-Version", req.headers["api-version"]);

  next();
};
