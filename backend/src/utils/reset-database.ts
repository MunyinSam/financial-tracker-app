import { DatabaseMigration } from './migrations';
import logger from './logger';

async function resetDatabase() {
	try {
		await DatabaseMigration.resetDatabase();
		logger.info('Database reset successfully');
		process.exit(0);
	} catch (error) {
		logger.error('Database reset failed:', error);
		process.exit(1);
	}
}

resetDatabase();
