import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define log format
const logFormat = printf(
	({ level, message, timestamp, stack, ...metadata }) => {
		let msg = `${timestamp} [${level}]: ${message}`;

		// Add stack trace for errors
		if (stack) {
			msg += `\n${stack}`;
		}

		// Add metadata if present
		if (Object.keys(metadata).length > 0) {
			msg += `\n${JSON.stringify(metadata, null, 2)}`;
		}

		return msg;
	}
);

// Create logger instance
const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: combine(
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		errors({ stack: true }),
		logFormat
	),
	transports: [
		// Console transport
		new winston.transports.Console({
			format: combine(
				colorize(),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				logFormat
			),
		}),
		// File transport for errors
		new winston.transports.File({
			filename: path.join(__dirname, '../../logs/error.log'),
			level: 'error',
		}),
		// File transport for all logs
		new winston.transports.File({
			filename: path.join(__dirname, '../../logs/combined.log'),
		}),
	],
});

// Add http level for request logging
logger.level = 'http';

export default logger;
