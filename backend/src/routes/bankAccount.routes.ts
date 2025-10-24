import { Router } from 'express';
import { BankAccountController } from '../controllers/bankAccount.controller';

const router = Router();

router.get('/', BankAccountController.getAll);
router.get('/:id', BankAccountController.getById);
router.get('/person/:personId', BankAccountController.getByPerson);
router.get(
	'/person/:personId/total-balance',
	BankAccountController.getTotalBalance
);
router.post('/', BankAccountController.create);
router.patch('/:id/balance', BankAccountController.updateBalance);
router.delete('/:id', BankAccountController.delete);

export default router;
