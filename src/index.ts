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
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json());

app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Backend Arquitectura MVC TS corriendo en: http://localhost:${PORT}`);
});
