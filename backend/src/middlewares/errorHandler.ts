import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// Log the error
	logger.error('Error occurred:', {
		error: err.message,
		stack: err.stack,
		method: req.method,
		url: req.url,
		body: req.body,
		params: req.params,
		query: req.query,
	});

	// Send response
	res.status(500).json({
		success: false,
		error: err.message || 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
};

export const notFoundHandler = (req: Request, res: Response): void => {
	logger.warn(`Route not found: ${req.method} ${req.url}`);

	res.status(404).json({
		success: false,
		error: 'Route not found',
		path: req.url,
	});
};
