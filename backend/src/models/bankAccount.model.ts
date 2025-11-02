// ...existing code...
import { query } from '../config/database';
import { QueryResult } from 'pg';
import { BankAccount } from '../types/bank';

export class BankAccountModel {
    static async findAll(): Promise<BankAccount[]> {
        const result: QueryResult<BankAccount> = await query(`
      SELECT * FROM BankAccount ORDER BY AccountId DESC
    `);
        return result.rows;
    }

    static async create(payload: {
        userId: string;
        bankName: string;
        bankLogo?: string;
        accountNumber: string;
        accountName: string;
        balance: number;
        accountType?: 'Savings' | 'Fixed';
        openedDate?: string;
    }): Promise<BankAccount> {
        const text = `
      INSERT INTO BankAccount
        (UserId, BankName, BankLogo, AccountNumber, AccountName, Balance, AccountType, OpenedDate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        const values = [
            payload.userId,
            payload.bankName,
            payload.bankLogo ?? null,
            payload.accountNumber,
            payload.accountName,
            payload.balance,
            payload.accountType ?? null,
            payload.openedDate ?? null,
        ];

        const result: QueryResult<BankAccount> = await query(text, values);
        return result.rows[0];
    }
}