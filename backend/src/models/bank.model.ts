import { query } from '../config/database';
import { Bank, CreateBankDTO } from '../types';
import { QueryResult } from 'pg';

export class BankModel {
	static async findAll(): Promise<Bank[]> {
		const result: QueryResult<Bank> = await query(
			'SELECT * FROM Bank ORDER BY BankId DESC'
		);
		return result.rows;
	}

	static async findById(id: number): Promise<Bank | null> {
		const result: QueryResult<Bank> = await query(
			'SELECT * FROM Bank WHERE BankId = $1',
			[id]
		);
		return result.rows[0] || null;
	}

	static async findByRoutingNumber(
		routingNumber: string
	): Promise<Bank | null> {
		const result: QueryResult<Bank> = await query(
			'SELECT * FROM Bank WHERE RoutingNumber = $1',
			[routingNumber]
		);
		return result.rows[0] || null;
	}

	static async create(data: CreateBankDTO): Promise<Bank> {
		const result: QueryResult<Bank> = await query(
			`INSERT INTO Bank (BankName, RoutingNumber) 
       VALUES ($1, $2) 
       RETURNING *`,
			[data.BankName, data.RoutingNumber]
		);
		return result.rows[0];
	}

	static async update(
		id: number,
		data: Partial<CreateBankDTO>
	): Promise<Bank | null> {
		const fields: string[] = [];
		const values: any[] = [];
		let paramCount = 1;

		if (data.BankName !== undefined) {
			fields.push(`BankName = $${paramCount++}`);
			values.push(data.BankName);
		}
		if (data.RoutingNumber !== undefined) {
			fields.push(`RoutingNumber = $${paramCount++}`);
			values.push(data.RoutingNumber);
		}

		if (fields.length === 0) return null;

		fields.push('updated_at = CURRENT_TIMESTAMP');
		values.push(id);

		const result: QueryResult<Bank> = await query(
			`UPDATE Bank SET ${fields.join(
				', '
			)} WHERE BankId = $${paramCount} RETURNING *`,
			values
		);
		return result.rows[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await query('DELETE FROM Bank WHERE BankId = $1', [id]);
		return result.rowCount ? result.rowCount > 0 : false;
	}
}
