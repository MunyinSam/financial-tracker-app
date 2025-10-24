import { query } from '../config/database';
import { Person, CreatePersonDTO } from '../types';
import { QueryResult } from 'pg';

export class PersonModel {
	static async findAll(): Promise<Person[]> {
		try {
			const result: QueryResult<Person> = await query(
				'SELECT * FROM Person ORDER BY PersonId DESC'
			);
			return result.rows;
		} catch (error) {
			throw new Error('Failed to fetch persons');
		}
	}

	static async findById(id: number): Promise<Person | null> {
		try {
			const result: QueryResult<Person> = await query(
				'SELECT * FROM Person WHERE PersonId = $1',
				[id]
			);
			return result.rows[0] || null;
		} catch (error) {
			throw new Error(`Failed to fetch person with id ${id}`);
		}
	}

	static async create(data: CreatePersonDTO): Promise<Person> {
		try {
			const result: QueryResult<Person> = await query(
				`INSERT INTO Person (FName, LName, DateOfBirth) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
				[data.FName, data.LName, data.DateOfBirth || null]
			);
			return result.rows[0];
		} catch (error) {
			throw new Error('Failed to create person');
		}
	}

	static async update(
		id: number,
		data: Partial<CreatePersonDTO>
	): Promise<Person | null> {
		try {
			const fields: string[] = [];
			const values: any[] = [];
			let paramCount = 1;

			if (data.FName !== undefined) {
				fields.push(`FName = $${paramCount++}`);
				values.push(data.FName);
			}
			if (data.LName !== undefined) {
				fields.push(`LName = $${paramCount++}`);
				values.push(data.LName);
			}
			if (data.DateOfBirth !== undefined) {
				fields.push(`DateOfBirth = $${paramCount++}`);
				values.push(data.DateOfBirth);
			}

			if (fields.length === 0) return null;

			fields.push('updated_at = CURRENT_TIMESTAMP');
			values.push(id);

			const result: QueryResult<Person> = await query(
				`UPDATE Person SET ${fields.join(
					', '
				)} WHERE PersonId = $${paramCount} RETURNING *`,
				values
			);
			return result.rows[0] || null;
		} catch (error) {
			throw new Error(`Failed to update person with id ${id}`);
		}
	}

	static async delete(id: number): Promise<boolean> {
		try {
			const result = await query(
				'DELETE FROM Person WHERE PersonId = $1',
				[id]
			);
			return result.rowCount ? result.rowCount > 0 : false;
		} catch (error) {
			throw new Error(`Failed to delete person with id ${id}`);
		}
	}
}
