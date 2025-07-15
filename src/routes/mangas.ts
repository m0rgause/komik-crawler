import { Router } from "express";
import { getAllMangas, getMangaBySlug } from "../controller/mangas";
import {
  validateId,
  validatePagination,
  validateManga,
  crudLimiter,
} from "../middleware";

const router = Router();

// GET /api/v1/mangas - Get all mangas with pagination
router.get("/", validatePagination, getAllMangas);

// GET /api/v1/mangas/:slug - Get manga by slug
router.get("/slug/:slug", getMangaBySlug);

export default router;
