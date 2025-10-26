import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
// import { DatabaseMigration } from './utils/migrations';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Initialize database
// const initDatabase = async () => {
// 	try {
// 		await DatabaseMigration.runMigrations();
// 		logger.info('✅ Database initialized successfully');
// 	} catch (error) {
// 		logger.error('❌ Database initialization failed:', error);
// 		process.exit(1); // Exit if database fails
// 	}
// };

// initDatabase();

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	});
});

// API routes
app.use('/api', routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
