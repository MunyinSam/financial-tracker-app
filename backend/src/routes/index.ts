import { Router } from 'express';
import personRoutes from './person.routes';
import bankRoutes from './bank.routes';
import bankAccountRoutes from './bankAccount.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

router.use('/persons', personRoutes);
router.use('/banks', bankRoutes);
router.use('/accounts', bankAccountRoutes);
router.use('/transactions', transactionRoutes);

// Health check for API
router.get('/', (req, res) => {
	res.json({
		message: 'Financial Tracker API',
		version: '1.0.0',
		endpoints: {
			persons: '/api/persons',
			banks: '/api/banks',
			accounts: '/api/accounts',
			transactions: '/api/transactions',
		},
	});
});

export default router;
