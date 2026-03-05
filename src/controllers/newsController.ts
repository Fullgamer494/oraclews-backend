import { Request, Response } from 'express';
import { NewsModel } from '../models/NewsModel';

export const getTopNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = (req.query.category as string) || 'general';
        const country = (req.query.country as string) || 'us';

        const articles = await NewsModel.getTopHeadlines(category, country);

        res.json(articles);
    } catch (error: any) {
        console.error("Error en getTopNews:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query.q as string;

        if (!q) {
            res.status(400).json({ error: "El parámetro 'q' es requerido para buscar" });
            return;
        }

        const articles = await NewsModel.searchEverything(q);

        res.json(articles);
    } catch (error: any) {
        console.error("Error en searchNews:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};
