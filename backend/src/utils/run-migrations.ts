import { DatabaseMigration } from './migrations';
import logger from './logger';

async function runMigrations() {
	try {
		await DatabaseMigration.runMigrations();
		logger.info('Migrations completed successfully');
		process.exit(0);
	} catch (error) {
		logger.error('Migration failed:', error);
		process.exit(1);
	}
}

runMigrations();
