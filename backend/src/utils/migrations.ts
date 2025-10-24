import fs from 'fs';
import path from 'path';
import { query } from '../config/database';
import logger from './logger';

export class DatabaseMigration {
	static async runMigrations(): Promise<void> {
		try {
			logger.info('🔄 Running database migrations...');

			const migrationsPath = path.join(
				__dirname,
				'../database/migrations'
			);

			// Check if migrations folder exists
			if (!fs.existsSync(migrationsPath)) {
				logger.warn('No migrations folder found');
				return;
			}

			// Read all SQL files
			const files = fs
				.readdirSync(migrationsPath)
				.filter((file) => file.endsWith('.sql'))
				.sort(); // Run in order

			for (const file of files) {
				logger.info(`📄 Running migration: ${file}`);

				const filePath = path.join(migrationsPath, file);
				const sql = fs.readFileSync(filePath, 'utf-8');

				// Execute the SQL
				await query(sql);

				logger.info(`✅ Migration completed: ${file}`);
			}

			logger.info('✅ All migrations completed successfully');
		} catch (error) {
			logger.error('❌ Migration failed:', error);
			throw error;
		}
	}

	static async dropAllTables(): Promise<void> {
		try {
			logger.warn('⚠️  Dropping all tables...');

			// Drop in reverse order of dependencies
			await query('DROP TABLE IF EXISTS Transaction CASCADE');
			await query('DROP TABLE IF EXISTS BankAccount CASCADE');
			await query('DROP TABLE IF EXISTS Bank CASCADE');
			await query('DROP TABLE IF EXISTS Person CASCADE');

			logger.info('✅ All tables dropped');
		} catch (error) {
			logger.error('❌ Failed to drop tables:', error);
			throw error;
		}
	}

	static async resetDatabase(): Promise<void> {
		await this.dropAllTables();
		await this.runMigrations();
	}
}
