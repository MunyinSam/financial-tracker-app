import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
	static async getAll(req: Request, res: Response) {
		try {
			const transactions = await TransactionService.getAllTransactions();
			res.json({
				success: true,
				data: transactions,
			});
		} catch (error: any) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const transaction = await TransactionService.getTransactionById(id);

			res.json({
				success: true,
				data: transaction,
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getByAccount(req: Request, res: Response) {
		try {
			const accountId = parseInt(req.params.accountId);
			const transactions =
				await TransactionService.getTransactionsByAccount(accountId);

			res.json({
				success: true,
				data: transactions,
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async create(req: Request, res: Response) {
		try {
			const transaction = await TransactionService.createTransaction(
				req.body
			);

			res.status(201).json({
				success: true,
				data: transaction,
				message: 'Transaction created successfully',
			});
		} catch (error: any) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			await TransactionService.deleteTransaction(id);

			res.json({
				success: true,
				message: 'Transaction deleted successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}
}
