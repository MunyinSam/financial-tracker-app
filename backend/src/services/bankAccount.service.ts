import { BankAccountModel } from '../models/bankAccount.model';
import { BankAccount } from '../types/bank';

export interface BankAccountPayload {
	userId: string;
	bankName: string;
	bankLogo?: string;
	accountNumber: string;
	accountName: string;
	balance: number;
	accountType?: 'Savings' | 'Fixed' | 'Other';
	openedDate?: string;
}

export interface UpdateBankAccountPayload {
	bankName?: string;
	bankLogo?: string;
	accountNumber?: string;
	accountName?: string;
	balance?: number;
	accountType?: 'Savings' | 'Fixed' | 'Other';
	openedDate?: string;
}

export const BankAccountService = {
	async createBankAccount(payload: BankAccountPayload): Promise<BankAccount> {
		const created = await BankAccountModel.create(payload);
		return created;
	},

	async getAll(): Promise<BankAccount[]> {
		return BankAccountModel.findAll();
	},

	async getById(accountId: string): Promise<BankAccount | null> {
		return BankAccountModel.findById(accountId);
	},

	async getByType(
		accountType: 'Savings' | 'Fixed' | 'Other'
	): Promise<BankAccount[]> {
		return BankAccountModel.findByType(accountType);
	},

	async getByUserAndType(
		userId: string,
		accountType: 'Savings' | 'Fixed' | 'Other'
	): Promise<BankAccount[]> {
		return BankAccountModel.findByUserAndType(userId, accountType);
	},

	async getSummaryByUser(userId: string): Promise<{
		totalBalance: number;
		accountCount: number;
		accountsByType: Array<{
			accountType: string;
			count: number;
			totalBalance: number;
		}>;
	}> {
		return BankAccountModel.getSummaryByUser(userId);
	},

	async updateBankAccount(
		accountId: string,
		payload: UpdateBankAccountPayload
	): Promise<BankAccount | null> {
		return BankAccountModel.update(accountId, payload);
	},

	async deleteBankAccount(accountId: string): Promise<boolean> {
		return BankAccountModel.delete(accountId);
	},
};
