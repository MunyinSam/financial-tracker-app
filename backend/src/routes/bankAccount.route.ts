import express from 'express';
import { BankAccountController } from '../controllers/bankAccount.controller';

const router = express.Router();

// POST /api/bank-accounts
router.post('/', BankAccountController.createBankAccount);

// GET /api/bank-accounts
router.get('/', BankAccountController.listBankAccounts);

// GET /api/bank-accounts/:id
router.get('/:id', BankAccountController.getBankAccount);

// PUT /api/bank-accounts/:id
router.put('/:id', BankAccountController.updateBankAccount);

// DELETE /api/bank-accounts/:id
router.delete('/:id', BankAccountController.deleteBankAccount);

export default router;