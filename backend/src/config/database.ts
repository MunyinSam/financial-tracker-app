import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'financial_tracker',
	password: String(process.env.DB_PASSWORD || 'postgres123'),
	port: parseInt(process.env.DB_PORT || '5432'),
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
	console.log('✅ Database connected');
});

pool.on('error', (err) => {
	console.error('❌ Unexpected database error:', err);
	process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
