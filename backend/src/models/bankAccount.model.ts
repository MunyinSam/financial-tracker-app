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

	static async findById(accountId: string): Promise<BankAccount | null> {
		const text = `SELECT * FROM BankAccount WHERE AccountId = $1`;
		const result: QueryResult<BankAccount> = await query(text, [accountId]);
		return result.rows[0] || null;
	}

	static async findByType(
		accountType: 'Savings' | 'Fixed' | 'Other'
	): Promise<BankAccount[]> {
		const text = `
            SELECT * FROM BankAccount 
            WHERE AccountType = $1 
            ORDER BY AccountId DESC
        `;
		const result: QueryResult<BankAccount> = await query(text, [
			accountType,
		]);
		return result.rows;
	}

	static async findByUserAndType(
		userId: string,
		accountType: 'Savings' | 'Fixed' | 'Other'
	): Promise<BankAccount[]> {
		const text = `
            SELECT * FROM BankAccount 
            WHERE UserId = $1 AND AccountType = $2 
            ORDER BY AccountId DESC
        `;
		const result: QueryResult<BankAccount> = await query(text, [
			userId,
			accountType,
		]);
		return result.rows;
	}

	static async getSummaryByUser(userId: string): Promise<{
		totalBalance: number;
		accountCount: number;
		accountsByType: Array<{
			accountType: string;
			count: number;
			totalBalance: number;
		}>;
	}> {
		// Get total balance and count
		const summaryQuery = `
            SELECT 
                COUNT(*)::int as account_count,
                COALESCE(SUM(Balance), 0)::numeric as total_balance
            FROM BankAccount
            WHERE UserId = $1
        `;
		const summaryResult = await query(summaryQuery, [userId]);

		// Get breakdown by account type
		const typeQuery = `
            SELECT 
                AccountType as account_type,
                COUNT(*)::int as count,
                COALESCE(SUM(Balance), 0)::numeric as total_balance
            FROM BankAccount
            WHERE UserId = $1
            GROUP BY AccountType
            ORDER BY total_balance DESC
        `;
		const typeResult = await query(typeQuery, [userId]);

		return {
			totalBalance: parseFloat(
				summaryResult.rows[0]?.total_balance || '0'
			),
			accountCount: summaryResult.rows[0]?.account_count || 0,
			accountsByType: typeResult.rows.map((row: any) => ({
				accountType: row.account_type || 'Other',
				count: row.count,
				totalBalance: parseFloat(row.total_balance),
			})),
		};
	}

	static async create(payload: {
		userId: string;
		bankName: string;
		bankLogo?: string;
		accountNumber: string;
		accountName: string;
		balance: number;
		accountType?: 'Savings' | 'Fixed' | 'Other';
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

	static async update(
		accountId: string,
		payload: {
			bankName?: string;
			bankLogo?: string;
			accountNumber?: string;
			accountName?: string;
			balance?: number;
			accountType?: 'Savings' | 'Fixed' | 'Other';
			openedDate?: string;
		}
	): Promise<BankAccount | null> {
		const updates: string[] = [];
		const values: any[] = [];
		let paramIndex = 1;

		if (payload.bankName !== undefined) {
			updates.push(`BankName = $${paramIndex++}`);
			values.push(payload.bankName);
		}
		if (payload.bankLogo !== undefined) {
			updates.push(`BankLogo = $${paramIndex++}`);
			values.push(payload.bankLogo);
		}
		if (payload.accountNumber !== undefined) {
			updates.push(`AccountNumber = $${paramIndex++}`);
			values.push(payload.accountNumber);
		}
		if (payload.accountName !== undefined) {
			updates.push(`AccountName = $${paramIndex++}`);
			values.push(payload.accountName);
		}
		if (payload.balance !== undefined) {
			updates.push(`Balance = $${paramIndex++}`);
			values.push(payload.balance);
		}
		if (payload.accountType !== undefined) {
			updates.push(`AccountType = $${paramIndex++}`);
			values.push(payload.accountType);
		}
		if (payload.openedDate !== undefined) {
			updates.push(`OpenedDate = $${paramIndex++}`);
			values.push(payload.openedDate);
		}

		if (updates.length === 0) {
			throw new Error('No fields to update');
		}

		updates.push(`UpdatedAt = CURRENT_TIMESTAMP`);
		values.push(accountId);

		const text = `
            UPDATE BankAccount
            SET ${updates.join(', ')}
            WHERE AccountId = $${paramIndex}
            RETURNING *
        `;

		const result: QueryResult<BankAccount> = await query(text, values);
		return result.rows[0] || null;
	}

	static async delete(accountId: string): Promise<boolean> {
		const text = `DELETE FROM BankAccount WHERE AccountId = $1 RETURNING AccountId`;
		const result: QueryResult = await query(text, [accountId]);
		return result.rowCount !== null && result.rowCount > 0;
	}
}
