import { Router } from 'express';

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

export default router;