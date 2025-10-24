import { Request, Response } from 'express';
import { BankAccountService } from '../services/bankAccount.service';

export class BankAccountController {
	static async getAll(req: Request, res: Response) {
		try {
			const accounts = await BankAccountService.getAllAccounts();
			res.json({
				success: true,
				data: accounts,
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
			const account = await BankAccountService.getAccountById(id);

			res.json({
				success: true,
				data: account,
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getByPerson(req: Request, res: Response) {
		try {
			const personId = parseInt(req.params.personId);
			const accounts = await BankAccountService.getAccountsByPerson(
				personId
			);

			res.json({
				success: true,
				data: accounts,
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
			const account = await BankAccountService.createAccount(req.body);

			res.status(201).json({
				success: true,
				data: account,
				message: 'Account created successfully',
			});
		} catch (error: any) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async updateBalance(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const { amount } = req.body;

			if (!amount) {
				return res.status(400).json({
					success: false,
					error: 'Amount is required',
				});
			}

			const account = await BankAccountService.updateAccountBalance(
				id,
				parseFloat(amount)
			);

			res.json({
				success: true,
				data: account,
				message: 'Balance updated successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 400;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			await BankAccountService.deleteAccount(id);

			res.json({
				success: true,
				message: 'Account deleted successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getTotalBalance(req: Request, res: Response) {
		try {
			const personId = parseInt(req.params.personId);
			const totalBalance = await BankAccountService.getTotalBalance(
				personId
			);

			res.json({
				success: true,
				data: { totalBalance },
			});
		} catch (error: any) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}
}
