import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware de Seguridad 1: Helmet ──
// Configura cabeceras HTTP seguras (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet());

// ── Middleware de Seguridad 2: Rate Limiting ──
// Previene abuso y ataques de denegación de servicio (DoS)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ventana de 15 minutos
    max: 100,                  // máximo 100 peticiones por IP por ventana
    standardHeaders: true,     // devuelve info de rate limit en headers `RateLimit-*`
    legacyHeaders: false,      // deshabilita headers `X-RateLimit-*`
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.',
    },
});

app.use('/api/', apiLimiter);

// ── Middleware de Seguridad 3: CORS ──
// Restringe los orígenes permitidos para proteger la API de peticiones no autorizadas
const allowedOrigins = ['http://localhost:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (herramientas como curl, Postman, o server-to-server)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Rechazar orígenes no autorizados sin lanzar un error 500
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Parser de JSON ──
app.use(express.json({ limit: '1mb' }));

// ── Rutas ──
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'OracleWS API is running' });
});

// ── Inicio del servidor ──
app.listen(PORT, () => {
    console.log(`Backend Arquitectura MVC TS corriendo en: http://localhost:${PORT}`);
});
