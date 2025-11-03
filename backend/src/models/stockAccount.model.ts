import pool from '../config/database';
import logger from '../utils/logger';

export interface StockHolding {
	stockid: number;
	userid: number;
	symbol: string;
	companyname: string;
	shares: number;
	averageprice: number;
	purchasedate?: Date;
	notes?: string;
	createdat?: Date;
	updatedat?: Date;
}

export interface CreateStockHolding {
	userid: number;
	symbol: string;
	companyname: string;
	shares: number;
	averageprice: number;
	purchasedate?: Date;
	notes?: string;
}

export interface UpdateStockHolding {
	shares?: number;
	averageprice?: number;
	notes?: string;
}

export const stockAccountModel = {
	// Create a new stock holding
	async create(data: CreateStockHolding): Promise<StockHolding> {
		try {
			const query = `
                INSERT INTO stock_holdings (
                    userid, symbol, companyname, shares, averageprice, purchasedate, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
			const values = [
				data.userid,
				data.symbol.toUpperCase(),
				data.companyname,
				data.shares,
				data.averageprice,
				data.purchasedate || new Date(),
				data.notes || null,
			];
			const result = await pool.query(query, values);
			logger.info(
				`Stock holding created: ${data.symbol} for user ${data.userid}`
			);
			return result.rows[0];
		} catch (error) {
			logger.error('Error creating stock holding:', error);
			throw error;
		}
	},

	// Get all stock holdings for a user
	async getByUserId(userId: number): Promise<StockHolding[]> {
		try {
			const query = `
                SELECT * FROM stock_holdings
                WHERE userid = $1
                ORDER BY createdat DESC
            `;
			const result = await pool.query(query, [userId]);
			return result.rows;
		} catch (error) {
			logger.error('Error fetching stock holdings:', error);
			throw error;
		}
	},

	// Get a specific stock holding
	async getById(
		stockId: number,
		userId: number
	): Promise<StockHolding | null> {
		try {
			const query = `
                SELECT * FROM stock_holdings
                WHERE stockid = $1 AND userid = $2
            `;
			const result = await pool.query(query, [stockId, userId]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error('Error fetching stock holding:', error);
			throw error;
		}
	},

	// Get holdings by symbol for a user
	async getBySymbol(symbol: string, userId: number): Promise<StockHolding[]> {
		try {
			const query = `
                SELECT * FROM stock_holdings
                WHERE symbol = $1 AND userid = $2
                ORDER BY purchasedate DESC
            `;
			const result = await pool.query(query, [
				symbol.toUpperCase(),
				userId,
			]);
			return result.rows;
		} catch (error) {
			logger.error('Error fetching stock holdings by symbol:', error);
			throw error;
		}
	},

	// Update a stock holding
	async update(
		stockId: number,
		userId: number,
		data: UpdateStockHolding
	): Promise<StockHolding | null> {
		try {
			const updates: string[] = [];
			const values: any[] = [];
			let paramCount = 1;

			if (data.shares !== undefined) {
				updates.push(`shares = $${paramCount++}`);
				values.push(data.shares);
			}
			if (data.averageprice !== undefined) {
				updates.push(`averageprice = $${paramCount++}`);
				values.push(data.averageprice);
			}
			if (data.notes !== undefined) {
				updates.push(`notes = $${paramCount++}`);
				values.push(data.notes);
			}

			if (updates.length === 0) {
				return this.getById(stockId, userId);
			}

			updates.push(`updatedat = CURRENT_TIMESTAMP`);
			values.push(stockId, userId);

			const query = `
                UPDATE stock_holdings
                SET ${updates.join(', ')}
                WHERE stockid = $${paramCount++} AND userid = $${paramCount++}
                RETURNING *
            `;

			const result = await pool.query(query, values);
			if (result.rows.length > 0) {
				logger.info(`Stock holding updated: ${stockId}`);
			}
			return result.rows[0] || null;
		} catch (error) {
			logger.error('Error updating stock holding:', error);
			throw error;
		}
	},

	// Delete a stock holding
	async delete(stockId: number, userId: number): Promise<boolean> {
		try {
			const query = `
                DELETE FROM stock_holdings
                WHERE stockid = $1 AND userid = $2
                RETURNING stockid
            `;
			const result = await pool.query(query, [stockId, userId]);
			const deleted = result.rows.length > 0;
			if (deleted) {
				logger.info(`Stock holding deleted: ${stockId}`);
			}
			return deleted;
		} catch (error) {
			logger.error('Error deleting stock holding:', error);
			throw error;
		}
	},

	// Get portfolio summary for a user
	async getPortfolioSummary(userId: number): Promise<any> {
		try {
			const query = `
                SELECT 
                    COUNT(*) as total_stocks,
                    SUM(shares) as total_shares,
                    SUM(shares * averageprice) as total_invested,
                    ARRAY_AGG(DISTINCT symbol) as symbols
                FROM stock_holdings
                WHERE userid = $1
            `;
			const result = await pool.query(query, [userId]);
			return result.rows[0];
		} catch (error) {
			logger.error('Error fetching portfolio summary:', error);
			throw error;
		}
	},
};
