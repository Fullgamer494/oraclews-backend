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
    static async getTopHeadlines(category: string, country: string): Promise<NewsArticle[]> {
        if (!this.apiKey) throw new Error("API_KEY no configurada");

        const url = `${this.baseUrl}/top-headlines?country=${country}&category=${category}&apiKey=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en NewsAPI: ${response.statusText}`);
        }

        const data = await response.json();
        return data.articles.map((article: any, index: number) => this.mapToArticle(article, index));
    }

    // buscar noticias, pasar como query param
    static async searchEverything(query: string): Promise<NewsArticle[]> {
        if (!this.apiKey) throw new Error("API_KEY no configurada");

        const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en NewsAPI: ${response.statusText}`);
        }

        const data = await response.json();
        return data.articles.map((article: any, index: number) => this.mapToArticle(article, index));
    }
}
