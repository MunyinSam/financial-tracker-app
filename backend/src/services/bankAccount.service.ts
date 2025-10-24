import { BankAccountModel } from '../models/bankAccount.model';
import { PersonModel } from '../models/person.model';
import { BankModel } from '../models/bank.model';
import { BankAccount, CreateBankAccountDTO } from '../types';

export class BankAccountService {
    static async getAllAccounts(): Promise<BankAccount[]> {
        return await BankAccountModel.findAll();
    }

    static async getAccountById(id: number): Promise<BankAccount> {
        if (!id || id <= 0) {
            throw new Error('Invalid account ID');
        }

        const account = await BankAccountModel.findById(id);

        if (!account) {
            throw new Error('Account not found');
        }

        return account;
    }

    static async getAccountsByPerson(personId: number): Promise<BankAccount[]> {
        // Verify person exists
        const person = await PersonModel.findById(personId);
        if (!person) {
            throw new Error('Person not found');
        }

        return await BankAccountModel.findByPerson(personId);
    }

    static async createAccount(
        data: CreateBankAccountDTO
    ): Promise<BankAccount> {
        // Validation
        if (!data.PersonId || data.PersonId <= 0) {
            throw new Error('Valid Person ID is required');
        }

        if (!data.BankId || data.BankId <= 0) {
            throw new Error('Valid Bank ID is required');
        }

        if (!data.AccountNumber || data.AccountNumber.trim().length === 0) {
            throw new Error('Account number is required');
        }

        // Verify person exists
        const person = await PersonModel.findById(data.PersonId);
        if (!person) {
            throw new Error('Person not found');
        }

        // Verify bank exists
        const bank = await BankModel.findById(data.BankId);
        if (!bank) {
            throw new Error('Bank not found');
        }

        // Check if account number already exists
        const existing = await BankAccountModel.findByAccountNumber(
            data.AccountNumber
        );
        if (existing) {
            throw new Error('Account number already exists');
        }

        // Validate initial balance
        if (data.Balance !== undefined && data.Balance < 0) {
            throw new Error('Initial balance cannot be negative');
        }

        // Validate account type
        const validTypes = ['Savings', 'Checking', 'Credit', 'Investment'];
        if (data.AccountType && !validTypes.includes(data.AccountType)) {
            throw new Error(
                'Account type must be one of: Savings, Checking, Credit, Investment'
            );
        }

        return await BankAccountModel.create(data);
    }

    static async updateAccountBalance(
        id: number,
        amount: number
    ): Promise<BankAccount> {
        // Check if account exists
        const account = await this.getAccountById(id);

        // Validate amount
        if (amount === 0) {
            throw new Error('Amount cannot be zero');
        }

        // Check if withdrawal would result in negative balance
        const newBalance = Number(account.Balance) + amount;
        if (newBalance < 0) {
            throw new Error('Insufficient funds');
        }

        const updated = await BankAccountModel.updateBalance(id, amount);

        if (!updated) {
            throw new Error('Failed to update account balance');
        }

        return updated;
    }

    static async deleteAccount(id: number): Promise<void> {
        // Check if account exists
        await this.getAccountById(id);

        const deleted = await BankAccountModel.delete(id);

        if (!deleted) {
            throw new Error('Failed to delete account');
        }
    }

    static async getTotalBalance(personId: number): Promise<number> {
        const accounts = await this.getAccountsByPerson(personId);
        return accounts.reduce(
            (sum, account) => sum + Number(account.Balance),
            0
        );
    }
}