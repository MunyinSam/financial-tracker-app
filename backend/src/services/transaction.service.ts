import { TransactionModel } from '../models/transaction.model';
import { BankAccountModel } from '../models/bankAccount.model';
import { Transaction, CreateTransactionDTO } from '../types';

export class TransactionService {
	static async getAllTransactions(): Promise<Transaction[]> {
		return await TransactionModel.findAll();
	}

	static async getTransactionById(id: number): Promise<Transaction> {
		if (!id || id <= 0) {
			throw new Error('Invalid transaction ID');
		}

		const transaction = await TransactionModel.findById(id);

		if (!transaction) {
			throw new Error('Transaction not found');
		}

		return transaction;
	}

	static async getTransactionsByAccount(
		accountId: number
	): Promise<Transaction[]> {
		// Verify account exists
		const account = await BankAccountModel.findById(accountId);
		if (!account) {
			throw new Error('Account not found');
		}

		return await TransactionModel.findByAccount(accountId);
	}

	static async createTransaction(
		data: CreateTransactionDTO
	): Promise<Transaction> {
		// Validation
		if (!data.AccountId || data.AccountId <= 0) {
			throw new Error('Valid Account ID is required');
		}

		if (!data.Amount || data.Amount === 0) {
			throw new Error('Amount cannot be zero');
		}

		if (!data.TransactionType || data.TransactionType.trim().length === 0) {
			throw new Error('Transaction type is required');
		}

		// Verify account exists
		const account = await BankAccountModel.findById(data.AccountId);
		if (!account) {
			throw new Error('Account not found');
		}

		// Validate transaction type
		const validTypes = [
			'Deposit',
			'Withdrawal',
			'Transfer',
			'Fee',
			'Interest',
		];
		if (!validTypes.includes(data.TransactionType)) {
			throw new Error(
				'Transaction type must be one of: Deposit, Withdrawal, Transfer, Fee, Interest'
			);
		}

		// For withdrawals, check if sufficient funds
		if (
			['Withdrawal', 'Fee'].includes(data.TransactionType) &&
			data.Amount > 0
		) {
			// Make amount negative for withdrawals
			data.Amount = -Math.abs(data.Amount);
		}

		const newBalance = Number(account.Balance) + data.Amount;
		if (newBalance < 0) {
			throw new Error('Insufficient funds for this transaction');
		}

		// Create transaction
		const transaction = await TransactionModel.create(data);

		// Update account balance
		await BankAccountModel.updateBalance(data.AccountId, data.Amount);

		return transaction;
	}

	static async deleteTransaction(id: number): Promise<void> {
		// Check if transaction exists
		const transaction = await this.getTransactionById(id);

		// Reverse the transaction in the account balance
		await BankAccountModel.updateBalance(
			transaction.AccountId,
			-Number(transaction.Amount)
		);

		const deleted = await TransactionModel.delete(id);

		if (!deleted) {
			throw new Error('Failed to delete transaction');
		}
	}

	static async getAccountBalance(accountId: number): Promise<number> {
		const transactions = await this.getTransactionsByAccount(accountId);
		return transactions.reduce(
			(sum, transaction) => sum + Number(transaction.Amount),
			0
		);
	}
}
