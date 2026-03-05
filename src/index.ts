import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';

// Silenciamos los logs extra de dotenv usando { debug: false } o puedes no pasarle nada
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Montar Rutas del patrón MVC
app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
    console.log(`Backend Arquitectura MVC TS corriendo en: http://localhost:${PORT}`);
});
