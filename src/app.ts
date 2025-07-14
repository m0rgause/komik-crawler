import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import {
  corsOptions,
  securityHeaders,
  apiVersioning,
  formatResponse,
  errorHandler,
  requestLogger,
  requestTimeout,
} from "./middleware";
import { Logger } from "./utils/logger";

// Load environment variables
dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Request timeout middleware (should be first)
app.use(requestTimeout(30000)); // 30 seconds timeout

// Logging startup
Logger.middleware("MIDDLEWARE", "Loading security middleware...");

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// CORS configuration with detailed options
app.use(cors(corsOptions));
Logger.middleware("CORS", "Cross-origin resource sharing configured");

// API versioning
app.use(apiVersioning);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
Logger.middleware("RATE-LIMIT", "Rate limiting configured (100 req/15min)");

// Logging middleware
app.use(morgan("combined"));
app.use(requestLogger);
Logger.middleware("LOGGING", "Request logging configured");

// Compression middleware
app.use(compression());
Logger.middleware("COMPRESSION", "GZIP compression enabled");

// Response formatting middleware
app.use(formatResponse);
Logger.middleware("RESPONSE", "Response formatting configured");

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import routes
import mangaRoutes from "./routes/mangas";

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to Komik Crawler API",
    version: "1.0.0",
    endpoints: {
      mangas: "/api/v1/mangas",
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1/mangas", mangaRoutes);

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  Logger.server(`Komik Crawler API started successfully`, port);
  Logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  Logger.info(`API Documentation: http://localhost:${port}/`);
  Logger.info(`Health Check: http://localhost:${port}/api/v1/mangas`);
});
