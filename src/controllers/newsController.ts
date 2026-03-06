import { Request, Response } from 'express';
import { NewsModel } from '../models/NewsModel';

// Categorías permitidas por NewsAPI (whitelist para validación)
const VALID_CATEGORIES = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
const VALID_COUNTRIES = ['us', 'mx', 'es', 'ar', 'co'];
const MAX_QUERY_LENGTH = 100;

export const getTopNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = (req.query.category as string) || 'general';
        const country = (req.query.country as string) || 'us';

        // Validación: solo categorías permitidas
        if (!VALID_CATEGORIES.includes(category)) {
            res.status(400).json({ error: `Categoría no válida. Permitidas: ${VALID_CATEGORIES.join(', ')}` });
            return;
        }

        // Validación: solo países permitidos
        if (!VALID_COUNTRIES.includes(country)) {
            res.status(400).json({ error: `País no válido. Permitidos: ${VALID_COUNTRIES.join(', ')}` });
            return;
        }

        const articles = await NewsModel.getTopHeadlines(category, country);

        res.json(articles);
    } catch (error: any) {
        console.error("Error en getTopNews:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener noticias." });
    }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query.q as string;

        if (!q) {
            res.status(400).json({ error: "El parámetro 'q' es requerido para buscar." });
            return;
        }

        // Validación: longitud máxima del query
        if (q.length > MAX_QUERY_LENGTH) {
            res.status(400).json({ error: `La búsqueda no puede exceder ${MAX_QUERY_LENGTH} caracteres.` });
            return;
        }

        // Sanitización: eliminar caracteres potencialmente peligrosos
        const sanitizedQuery = q.replace(/[<>{}]/g, '').trim();

        if (!sanitizedQuery) {
            res.status(400).json({ error: "La búsqueda contiene caracteres no válidos." });
            return;
        }

        const articles = await NewsModel.searchEverything(sanitizedQuery);

        res.json(articles);
    } catch (error: any) {
        console.error("Error en searchNews:", error.message);
        res.status(500).json({ error: "Error interno del servidor al buscar noticias." });
    }
};
