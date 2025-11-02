import { Request, Response, NextFunction } from 'express';
import { BankAccountService } from '../services/bankAccount.service';

export const BankAccountController = {
	async createBankAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				userId,
				bankName,
				bankLogo,
				accountNumber,
				accountName,
				balance,
				accountType,
				openedDate,
			} = req.body;

			if (
				!userId ||
				!bankName ||
				!accountNumber ||
				!accountName ||
				typeof balance !== 'number'
			) {
				return res
					.status(400)
					.json({ error: 'Missing required fields' });
			}

			const created = await BankAccountService.createBankAccount({
				userId,
				bankName,
				bankLogo,
				accountNumber,
				accountName,
				balance,
				accountType,
				openedDate,
			});

			return res.status(201).json(created);
		} catch (err) {
			next(err);
		}
	},

	async listBankAccounts(req: Request, res: Response, next: NextFunction) {
		try {
			const rows = await BankAccountService.getAll();
			res.json(rows);
		} catch (err) {
			next(err);
		}
	},

	async getBankAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const account = await BankAccountService.getById(id);

			if (!account) {
				return res
					.status(404)
					.json({ error: 'Bank account not found' });
			}

			res.json(account);
		} catch (err) {
			next(err);
		}
	},

	async updateBankAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const payload = req.body;

			const updated = await BankAccountService.updateBankAccount(
				id,
				payload
			);

			if (!updated) {
				return res
					.status(404)
					.json({ error: 'Bank account not found' });
			}

			res.json(updated);
		} catch (err) {
			next(err);
		}
	},

	async getSummary(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.query;

			if (!userId || typeof userId !== 'string') {
				return res.status(400).json({ error: 'User ID is required' });
			}

			const summary = await BankAccountService.getSummaryByUser(userId);
			res.json(summary);
		} catch (err) {
			next(err);
		}
	},

	async getByType(req: Request, res: Response, next: NextFunction) {
		try {
			const { type } = req.params;
			const { userId } = req.query;

			// Validate account type
			if (!['Savings', 'Fixed', 'Other'].includes(type)) {
				return res.status(400).json({
					error: 'Invalid account type. Must be Savings, Fixed, or Other',
				});
			}

			const accountType = type as 'Savings' | 'Fixed' | 'Other';

			// If userId is provided, filter by user
			let accounts;
			if (userId && typeof userId === 'string') {
				accounts = await BankAccountService.getByUserAndType(
					userId,
					accountType
				);
			} else {
				accounts = await BankAccountService.getByType(accountType);
			}

			res.json(accounts);
		} catch (err) {
			next(err);
		}
	},

	async deleteBankAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const deleted = await BankAccountService.deleteBankAccount(id);

			if (!deleted) {
				return res
					.status(404)
					.json({ error: 'Bank account not found' });
			}

			res.json({ message: 'Bank account deleted successfully' });
		} catch (err) {
			next(err);
		}
	},
};
