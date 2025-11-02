import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const startTime = process.hrtime();

	const { method, url } = req;
	const userAgent = req.get('user-agent') || '-';

	res.on('finish', () => {
		const diff = process.hrtime(startTime);
		const durationInMs = diff[0] * 1e3 + diff[1] * 1e-6;

		const { statusCode } = res;

		logger.http(
			`${method} ${url} ${statusCode} - ${durationInMs.toFixed(2)}ms`,
			{
				method,
				url,
				statusCode,
				userAgent,
				duration: durationInMs,
			}
		);
	});

	next();
};
