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
}
