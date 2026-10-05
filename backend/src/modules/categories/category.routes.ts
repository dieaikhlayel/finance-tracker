import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { getCategories } from './category.controller';

const router = Router();

router.get('/', authenticate, getCategories);

export default router;