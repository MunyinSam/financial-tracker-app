import { query } from '../config/database';
import { Transaction, CreateTransactionDTO } from '../types';
import { QueryResult } from 'pg';

export class TransactionModel {
	static async findAll(): Promise<Transaction[]> {
		const result: QueryResult<Transaction> = await query(
			'SELECT * FROM Transactions ORDER BY TransactionTimestamp DESC'
		);
		return result.rows;
	}

	static async findById(id: number): Promise<Transaction | null> {
		const result: QueryResult<Transaction> = await query(
			'SELECT * FROM Transactions WHERE TransactionId = $1',
			[id]
		);
		return result.rows[0] || null;
	}

	static async findByAccount(accountId: number): Promise<Transaction[]> {
		const result: QueryResult<Transaction> = await query(
			'SELECT * FROM Transactions WHERE AccountId = $1 ORDER BY TransactionTimestamp DESC',
			[accountId]
		);
		return result.rows;
	}

	static async create(data: CreateTransactionDTO): Promise<Transaction> {
		const result: QueryResult<Transaction> = await query(
			`INSERT INTO Transactions 
       (AccountId, Amount, TransactionType, Description) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
			[
				data.AccountId,
				data.Amount,
				data.TransactionType,
				data.Description || null,
			]
		);
		return result.rows[0];
	}

	static async delete(id: number): Promise<boolean> {
		const result = await query(
			'DELETE FROM Transactions WHERE TransactionId = $1',
			[id]
		);
		return result.rowCount ? result.rowCount > 0 : false;
	}
}
