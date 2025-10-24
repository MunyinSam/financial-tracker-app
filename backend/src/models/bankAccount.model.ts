import { query } from '../config/database';
import { BankAccount, CreateBankAccountDTO } from '../types';
import { QueryResult } from 'pg';

export class BankAccountModel {
	static async findAll(): Promise<BankAccount[]> {
		const result: QueryResult<BankAccount> = await query(`
      SELECT * FROM BankAccount ORDER BY AccountId DESC
    `);
		return result.rows;
	}

	// If you want to get accounts with person and bank details
	static async findAllWithDetails(): Promise<any[]> {
		const result = await query(`
      SELECT 
        ba.*,
        p.FName,
        p.LName,
        b.BankName
      FROM BankAccount ba
      JOIN Person p ON ba.PersonId = p.PersonId
      JOIN Bank b ON ba.BankId = b.BankId
      ORDER BY ba.AccountId DESC
    `);
		return result.rows;
	}

	static async findById(id: number): Promise<BankAccount | null> {
		const result: QueryResult<BankAccount> = await query(
			'SELECT * FROM BankAccount WHERE AccountId = $1',
			[id]
		);
		return result.rows[0] || null;
	}

	static async findByPerson(personId: number): Promise<BankAccount[]> {
		const result: QueryResult<BankAccount> = await query(
			'SELECT * FROM BankAccount WHERE PersonId = $1 ORDER BY AccountId DESC',
			[personId]
		);
		return result.rows;
	}

	static async findByAccountNumber(
		accountNumber: string
	): Promise<BankAccount | null> {
		const result: QueryResult<BankAccount> = await query(
			'SELECT * FROM BankAccount WHERE AccountNumber = $1',
			[accountNumber]
		);
		return result.rows[0] || null;
	}

	static async create(data: CreateBankAccountDTO): Promise<BankAccount> {
		const result: QueryResult<BankAccount> = await query(
			`INSERT INTO BankAccount 
       (PersonId, BankId, AccountNumber, Balance, AccountType) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
			[
				data.PersonId,
				data.BankId,
				data.AccountNumber,
				data.Balance || 0,
				data.AccountType || null,
			]
		);
		return result.rows[0];
	}

	static async updateBalance(
		id: number,
		amount: number
	): Promise<BankAccount | null> {
		const result: QueryResult<BankAccount> = await query(
			`UPDATE BankAccount 
       SET Balance = Balance + $1, updated_at = CURRENT_TIMESTAMP
       WHERE AccountId = $2 
       RETURNING *`,
			[amount, id]
		);
		return result.rows[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await query(
			'DELETE FROM BankAccount WHERE AccountId = $1',
			[id]
		);
		return result.rowCount ? result.rowCount > 0 : false;
	}
}
