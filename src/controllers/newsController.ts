import { Request, Response } from 'express';
import { NewsModel } from '../models/NewsModel';

// Categorías permitidas por NewsAPI (whitelist para validación)
const VALID_CATEGORIES = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
const VALID_COUNTRIES = ['us', 'mx', 'es', 'ar', 'co'];
const MAX_QUERY_LENGTH = 100;

// Utilidad para estandarizar errores
const createError = (code: string, message: string, details: any = {}) => ({
    code,
    message,
    details
});

export const getTopNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = (req.query.category as string) || 'general';
        const country = (req.query.country as string) || 'us';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        // Validación: solo categorías permitidas
        if (!VALID_CATEGORIES.includes(category)) {
            res.status(400).json(createError('INVALID_CATEGORY', `Categoría no válida. Permitidas: ${VALID_CATEGORIES.join(', ')}`, { provided: category, allowed: VALID_CATEGORIES }));
            return;
        }

        // Validación: solo países permitidos
        if (!VALID_COUNTRIES.includes(country)) {
            res.status(400).json(createError('INVALID_COUNTRY', `País no válido. Permitidos: ${VALID_COUNTRIES.join(', ')}`, { provided: country, allowed: VALID_COUNTRIES }));
            return;
        }

        if (page < 1 || limit < 1 || limit > 100) {
            res.status(400).json(createError('INVALID_PAGINATION', 'Los parámetros page y limit deben ser mayores a 0, y limit máximo 100.', { page, limit }));
            return;
        }

        const result = await NewsModel.getTopHeadlines(category, country, page, limit);

        res.json({
            data: result.articles,
            pagination: {
                page,
                limit,
                total: result.totalResults
            }
        });
    } catch (error: any) {
        console.error("Error en getTopNews:", error.message);
        res.status(500).json(createError('INTERNAL_SERVER_ERROR', "Error interno del servidor al obtener noticias.", { origin: "getTopNews", message: error.message }));
    }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!q) {
            res.status(400).json(createError('MISSING_QUERY', "El parámetro 'q' es requerido para buscar.", { parameter: "q" }));
            return;
        }

        // Validación: longitud máxima del query
        if (q.length > MAX_QUERY_LENGTH) {
            res.status(400).json(createError('QUERY_TOO_LONG', `La búsqueda no puede exceder ${MAX_QUERY_LENGTH} caracteres.`, { providedLength: q.length, maxLength: MAX_QUERY_LENGTH }));
            return;
        }

        // Sanitización: eliminar caracteres potencialmente peligrosos
        const sanitizedQuery = q.replace(/[<>{}]/g, '').trim();

        if (!sanitizedQuery) {
            res.status(400).json(createError('INVALID_CHARACTERS', "La búsqueda contiene caracteres no válidos.", { originalQuery: q }));
            return;
        }

        if (page < 1 || limit < 1 || limit > 100) {
            res.status(400).json(createError('INVALID_PAGINATION', 'Los parámetros page y limit deben ser mayores a 0, y limit máximo 100.', { page, limit }));
            return;
        }

        const result = await NewsModel.searchEverything(sanitizedQuery, page, limit);

        res.json({
            data: result.articles,
            pagination: {
                page,
                limit,
                total: result.totalResults
            }
        });
    } catch (error: any) {
        console.error("Error en searchNews:", error.message);
        res.status(500).json(createError('INTERNAL_SERVER_ERROR', "Error interno del servidor al buscar noticias.", { origin: "searchNews", message: error.message }));
    }
};
