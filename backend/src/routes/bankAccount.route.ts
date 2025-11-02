import express from 'express';
import { BankAccountController } from '../controllers/bankAccount.controller';

const router = express.Router();

// POST /api/bank-accounts
router.post('/', BankAccountController.createBankAccount);

// GET /api/bank-accounts
router.get('/', BankAccountController.listBankAccounts);

export default router;