import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

// Middleware untuk menangani hasil validasi
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Validasi umum untuk ID
export const validateId = [
  param("id").isNumeric().withMessage("ID must be a number"),
  handleValidationErrors,
];

// Validasi untuk query pagination
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

// Contoh validasi untuk manga (sesuaikan dengan kebutuhan)
export const validateManga = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").optional().isString(),
  body("status").optional().isIn(["ongoing", "completed", "hiatus"]),
  handleValidationErrors,
];
