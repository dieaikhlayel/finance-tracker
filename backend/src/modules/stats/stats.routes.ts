import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { summary, byCategory, monthly } from './stats.controller';

const router = Router();

router.use(authenticate);

router.get('/summary', summary);
router.get('/by-category', byCategory);
router.get('/monthly', monthly);

export default router;