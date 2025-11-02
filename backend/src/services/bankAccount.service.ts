import { BankAccountModel } from '../models/bankAccount.model';
import { BankAccount } from '../types/bank';

export interface BankAccountPayload {
	userId: string;
	bankName: string;
	bankLogo?: string;
	accountNumber: string;
	accountName: string;
	balance: number;
	accountType?: 'Savings' | 'Fixed';
	openedDate?: string;
}

export const BankAccountService = {
	async createBankAccount(payload: BankAccountPayload): Promise<BankAccount> {
		// Add any business logic/validation here if needed
		const created = await BankAccountModel.create(payload);
		return created;
	},

	async getAll(): Promise<BankAccount[]> {
		return BankAccountModel.findAll();
	},
};
