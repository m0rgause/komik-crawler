import { Router } from "express";
import {
  getAllMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
} from "../controller/mangas";
import {
  validateId,
  validatePagination,
  validateManga,
  crudLimiter,
} from "../middleware";

const router = Router();

// GET /api/v1/mangas - Get all mangas with pagination
router.get("/", validatePagination, getAllMangas);

// GET /api/v1/mangas/:id - Get manga by ID
router.get("/:id", validateId, getMangaById);

// POST /api/v1/mangas - Create new manga
router.post("/", crudLimiter, validateManga, createManga);

// PUT /api/v1/mangas/:id - Update manga
router.put("/:id", validateId, crudLimiter, validateManga, updateManga);

// DELETE /api/v1/mangas/:id - Delete manga
router.delete("/:id", validateId, crudLimiter, deleteManga);

export default router;
