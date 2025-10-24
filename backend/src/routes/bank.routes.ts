import { Router } from 'express';
import { BankController } from '../controllers/bank.controller';

const router = Router();

router.get('/', BankController.getAll);
router.get('/:id', BankController.getById);
router.post('/', BankController.create);
router.put('/:id', BankController.update);
router.delete('/:id', BankController.delete);

export default router;
