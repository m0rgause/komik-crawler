import { Request, Response, NextFunction } from "express";
import { get } from "@/services/axios";
import { ApiResponse } from "../middleware";
const cheerio = require("cheerio");

// Get all mangas with pagination
export const getAllMangas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string;
    const limit = 36;
    const offset = (page - 1) * limit;

    let path;
    if (search) {
      path = `/search?word=${encodeURIComponent(search)}&page=${page}`;
    } else {
      path = `/latest?page=${page}`;
    }

    const mangas = await get(path, {
      params: {
        limit,
        offset,
      },
    });

    const $ = cheerio.load(mangas.data as string);

    let listMangas;
    if (search) {
      listMangas = $("div[q\\:key='jp_1'] > div");
    } else {
      listMangas = $("div[q\\:key='MY_0'] > div");
    }
    const mangaList: any[] = [];

    listMangas.each((index: number, element: any) => {
      const titleElement = $(element).find("h3 a span");
      const title = titleElement.first().text().trim();

      const link = $(element).find("h3 a").attr("href");
      const imageElement = $(element).find("img");
      const image = imageElement.attr("src");
      const alt = imageElement.attr("alt");

      // label
      const label =
        $(element).find("div[q\\:key='IP_3'] > span").text().trim() || null;

      // last_updated
      const last_updated = $(element).find("time").data("time") as
        | string
        | undefined;

      // Extract genres from the genre section
      const genres: string[] = [];
      $(element)
        .find(".flex.flex-wrap.text-xs span span")
        .each(function (_: any, genreEl: any) {
          const genre = $(genreEl).text().trim();
          if (genre && genre !== ",") {
            genres.push(genre);
          }
        });

      // Extract rating if available
      const rating = $(element)
        .find(".text-yellow-500 span.font-bold")
        .text()
        .trim();

      // Extract latest chapter info
      const latestChapter = $(element)
        .find("a[class*='link-hover link-primary'] span")
        .last()
        .text()
        .trim();

      if (title) {
        const mangaData = {
          title,
          link,
          image,
          alt,
          label,
          lastUpdated: last_updated ? last_updated : null,
          genres,
          rating: rating || null,
          latestChapter: latestChapter || null,
        };

        mangaList.push(mangaData);
      }
    });

    const response: ApiResponse = {
      success: true,
      data: mangaList,
      pagination: {
        page,
        limit,
        total: 36 * 99,
        totalPages: Math.ceil((36 * 99) / limit),
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
export const getMangaBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    let manga = await get(`/title/${slug}`);
    const $ = cheerio.load(manga.data as string);

    // Extract manga details
    const title = $("h3.text-lg > a").first().text().trim();
    const author = $("div.text-sm > a").first().text().trim();
    const image = $("img").first().attr("src");
    const description = $("div.limit-html-p").text().trim();
    const language = $("div.whitespace-nowrap.overflow-hidden > span")
      .eq(1)
      .text()
      .trim();

    // Extract genres
    const genres: any = {};
    const genreElements = $("div.flex.items-center.flex-wrap > span");
    genreElements.each(function (_: any, element: any) {
      const val = $(element).attr("q:key");
      const val_ = $(element).find("span").first().text().trim();
      if (val && val_ && val !== "undefined") {
        genres[_] = {
          name: val_,
          slug: val,
        };
      }
    });

    // Extract chapters
    const chapters: any[] = [];
    const chapterElements = $("div.scrollable-panel >div >div");
    chapterElements.each(function (_: any, element: any) {
      const chapterTitle = $(element).find("div > a").first().text().trim();
      const chapterLink = $(element).find("div > a").first().attr("href");
      const chapterTimestamp = $(element).find("time").data("time");

      if (chapterTitle && chapterLink) {
        chapters.push({
          title: chapterTitle,
          link: chapterLink,
          timestamp: chapterTimestamp,
        });
      }
    });

    const mangaData = {
      title,
      language,
      author,
      image,
      description,
      genres,
      chapters,
    };

    const response: ApiResponse = {
      success: true,
      data: mangaData,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
