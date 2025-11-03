import {
	stockAccountModel,
	CreateStockHolding,
	UpdateStockHolding,
} from '../models/stockAccount.model';
import logger from '../utils/logger';

export const stockAccountService = {
	async createHolding(data: CreateStockHolding) {
		try {
			// Validate data
			if (
				!data.symbol ||
				!data.companyname ||
				!data.shares ||
				!data.averageprice
			) {
				throw new Error('Missing required fields');
			}

			if (data.shares <= 0 || data.averageprice <= 0) {
				throw new Error('Shares and average price must be positive');
			}

			return await stockAccountModel.create(data);
		} catch (error) {
			logger.error('Error in createHolding service:', error);
			throw error;
		}
	},

	async getUserHoldings(userId: number) {
		try {
			return await stockAccountModel.getByUserId(userId);
		} catch (error) {
			logger.error('Error in getUserHoldings service:', error);
			throw error;
		}
	},

	async getHoldingById(stockId: number, userId: number) {
		try {
			const holding = await stockAccountModel.getById(stockId, userId);
			if (!holding) {
				throw new Error('Stock holding not found');
			}
			return holding;
		} catch (error) {
			logger.error('Error in getHoldingById service:', error);
			throw error;
		}
	},

	async getHoldingsBySymbol(symbol: string, userId: number) {
		try {
			return await stockAccountModel.getBySymbol(symbol, userId);
		} catch (error) {
			logger.error('Error in getHoldingsBySymbol service:', error);
			throw error;
		}
	},

	async updateHolding(
		stockId: number,
		userId: number,
		data: UpdateStockHolding
	) {
		try {
			// Validate data
			if (data.shares !== undefined && data.shares <= 0) {
				throw new Error('Shares must be positive');
			}
			if (data.averageprice !== undefined && data.averageprice <= 0) {
				throw new Error('Average price must be positive');
			}

			const holding = await stockAccountModel.update(
				stockId,
				userId,
				data
			);
			if (!holding) {
				throw new Error('Stock holding not found');
			}
			return holding;
		} catch (error) {
			logger.error('Error in updateHolding service:', error);
			throw error;
		}
	},

	async deleteHolding(stockId: number, userId: number) {
		try {
			const deleted = await stockAccountModel.delete(stockId, userId);
			if (!deleted) {
				throw new Error('Stock holding not found');
			}
			return { message: 'Stock holding deleted successfully' };
		} catch (error) {
			logger.error('Error in deleteHolding service:', error);
			throw error;
		}
	},

	async getPortfolioSummary(userId: number) {
		try {
			return await stockAccountModel.getPortfolioSummary(userId);
		} catch (error) {
			logger.error('Error in getPortfolioSummary service:', error);
			throw error;
		}
	},
};
