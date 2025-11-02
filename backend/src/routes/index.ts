import { Router } from 'express';
import bankAccountRouter from './bankAccount.route';

const router = Router();

router.get('/', (req, res) => {
	res.json({
		message: 'Financial Tracker API',
		version: '1.0.0',
		// endpoints: {
		// 	persons: '/api/persons',
		// 	banks: '/api/banks',
		// 	accounts: '/api/accounts',
		// 	transactions: '/api/transactions',
		// },
	});
});

router.use('/bank-accounts', bankAccountRouter);


export default router;
