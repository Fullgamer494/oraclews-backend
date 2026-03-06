import * as dotenv from 'dotenv';
dotenv.config();


// modelo artículo
export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
    url: string;
}

export class NewsModel {
    private static readonly baseUrl = 'https://newsapi.org/v2';
    private static readonly apiKey = process.env.NEWS_API_KEY;

    // mapeo
    private static mapToArticle(article: any, index: number): NewsArticle {
        return {
            id: `${article.publishedAt}-${index}`,
            title: article.title,
            description: article.description,
            imageUrl: article.urlToImage,
            source: article.source?.name || 'Desconocido',
            publishedAt: article.publishedAt,
            url: article.url,
        };
    }

    // top headlines
    static async getTopHeadlines(category: string, country: string, page: number = 1, pageSize: number = 20): Promise<{ articles: NewsArticle[], totalResults: number }> {
        if (!this.apiKey) throw new Error("API_KEY_MISSING");

        const url = `${this.baseUrl}/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en NewsAPI: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            articles: data.articles ? data.articles.map((article: any, index: number) => this.mapToArticle(article, index)) : [],
            totalResults: data.totalResults || 0
        };
    }

    // buscar noticias, pasar como query param
    static async searchEverything(query: string, page: number = 1, pageSize: number = 20): Promise<{ articles: NewsArticle[], totalResults: number }> {
        if (!this.apiKey) throw new Error("API_KEY_MISSING");

        const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en NewsAPI: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            articles: data.articles ? data.articles.map((article: any, index: number) => this.mapToArticle(article, index)) : [],
            totalResults: data.totalResults || 0
        };
    }
}
