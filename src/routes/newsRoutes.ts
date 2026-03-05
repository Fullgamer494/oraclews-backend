import { Router } from 'express';
import { getTopNews, searchNews } from '../controllers/newsController';

const router = Router();

// endpoints
router.get('/top', getTopNews);
router.get('/search', searchNews);

export default router;
