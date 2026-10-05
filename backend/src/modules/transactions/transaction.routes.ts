import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import {
    createTransactionSchema,
    updateTransactionSchema,
    listTransactionsQuerySchema,
} from './transaction.schemas';
import { list, getOne, create, update, remove } from './transaction.controller';

const router = Router();

router.use(authenticate);

router.get('/', validate(listTransactionsQuerySchema, 'query'), list);
router.get('/:id', getOne);
router.post('/', validate(createTransactionSchema), create);
router.put('/:id', validate(updateTransactionSchema), update);
router.delete('/:id', remove);

export default router;