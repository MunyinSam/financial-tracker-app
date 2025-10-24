import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

router.get('/', TransactionController.getAll);
router.get('/:id', TransactionController.getById);
router.get('/account/:accountId', TransactionController.getByAccount);
router.post('/', TransactionController.create);
router.delete('/:id', TransactionController.delete);

export default router;
