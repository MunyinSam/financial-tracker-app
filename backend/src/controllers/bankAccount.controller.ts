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

			// Minimal validation
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
};
