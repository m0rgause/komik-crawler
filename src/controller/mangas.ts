import { Request, Response, NextFunction } from "express";
import { get } from "../services/axios";
import { ApiResponse } from "../middleware";
import { Logger } from "../utils/logger";

// Get all mangas with pagination
export const getAllMangas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Contoh penggunaan service axios untuk crawling
    // const mangas = await get('/api/mangas', { params: { limit, offset } });

    // Mock data untuk contoh
    const mockMangas = [
      { id: 1, title: "One Piece", author: "Eiichiro Oda", status: "ongoing" },
      {
        id: 2,
        title: "Naruto",
        author: "Masashi Kishimoto",
        status: "completed",
      },
    ];

    const response: ApiResponse = {
      success: true,
      data: mockMangas,
      pagination: {
        page,
        limit,
        total: 100, // Total records dari database
        totalPages: Math.ceil(100 / limit),
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get manga by ID
export const getMangaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Mock data
    const manga = {
      id: parseInt(id),
      title: "One Piece",
      author: "Eiichiro Oda",
      status: "ongoing",
    };

    res.json(manga);
  } catch (error) {
    next(error);
  }
};

// Create new manga
export const createManga = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author, status } = req.body;

    Logger.info(`Creating new manga: ${title} by ${author}`);

    // Logic untuk save ke database
    const newManga = {
      id: Date.now(),
      title,
      author,
      status,
      createdAt: new Date().toISOString(),
    };

    Logger.success(`Manga created successfully: ${title} (ID: ${newManga.id})`);
    res.status(201).json(newManga);
  } catch (error) {
    Logger.error(`Failed to create manga: ${error}`);
    next(error);
  }
};

// Update manga
export const updateManga = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, author, status } = req.body;

    // Logic untuk update di database
    const updatedManga = {
      id: parseInt(id),
      title,
      author,
      status,
      updatedAt: new Date().toISOString(),
    };

    res.json(updatedManga);
  } catch (error) {
    next(error);
  }
};

// Delete manga
export const deleteManga = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Logic untuk delete dari database

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
