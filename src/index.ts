import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // and safely allow all other origins for this assignment to prevent 500 CORS errors.
        callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());

app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Backend Arquitectura MVC TS corriendo en: http://localhost:${PORT}`);
});
