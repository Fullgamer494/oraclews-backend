import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// middleware helmet
app.use(helmet());

// middleware rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.',
        details: {}
    },
});

app.use('/api/', apiLimiter);

// middleware cors
const allowedOrigins = ['http://localhost:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // rechazar orígenes no autorizados
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// parser de JSON
app.use(express.json({ limit: '1mb' }));

// rutas
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'OracleWS API is running' });
});

app.listen(PORT, () => {
    console.log(`Backend Arquitectura MVC TS corriendo en: http://localhost:${PORT}`);
});
