import { Request, Response } from 'express';
import { stockAccountService } from '../services/stockAccount.service';
import logger from '../utils/logger';

export const stockAccountController = {
	// Create a new stock holding
	async createHolding(req: Request, res: Response) {
		try {
			const {
				userid,
				symbol,
				companyname,
				shares,
				averageprice,
				purchasedate,
				notes,
			} = req.body;

			const holding = await stockAccountService.createHolding({
				userid,
				symbol,
				companyname,
				shares: parseFloat(shares),
				averageprice: parseFloat(averageprice),
				purchasedate: purchasedate ? new Date(purchasedate) : undefined,
				notes,
			});

			res.status(201).json({
				success: true,
				data: holding,
				message: 'Stock holding created successfully',
			});
		} catch (error) {
			logger.error('Error in createHolding controller:', error);
			res.status(400).json({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Failed to create stock holding',
			});
		}
	},

	// Get all holdings for a user
	async getUserHoldings(req: Request, res: Response) {
		try {
			const userId = parseInt(req.params.userId);
			const holdings = await stockAccountService.getUserHoldings(userId);

			res.status(200).json({
				success: true,
				data: holdings,
				count: holdings.length,
			});
		} catch (error) {
			logger.error('Error in getUserHoldings controller:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch stock holdings',
			});
		}
	},

	// Get a specific holding
	async getHoldingById(req: Request, res: Response) {
		try {
			const stockId = parseInt(req.params.stockId);
			const userId = parseInt(req.query.userId as string);

			const holding = await stockAccountService.getHoldingById(
				stockId,
				userId
			);

			res.status(200).json({
				success: true,
				data: holding,
			});
		} catch (error) {
			logger.error('Error in getHoldingById controller:', error);
			res.status(404).json({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Stock holding not found',
			});
		}
	},

	// Get holdings by symbol
	async getHoldingsBySymbol(req: Request, res: Response) {
		try {
			const symbol = req.params.symbol;
			const userId = parseInt(req.query.userId as string);

			const holdings = await stockAccountService.getHoldingsBySymbol(
				symbol,
				userId
			);

			res.status(200).json({
				success: true,
				data: holdings,
				count: holdings.length,
			});
		} catch (error) {
			logger.error('Error in getHoldingsBySymbol controller:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch stock holdings',
			});
		}
	},

	// Update a holding
	async updateHolding(req: Request, res: Response) {
		try {
			const stockId = parseInt(req.params.stockId);
			const userId = parseInt(req.body.userid);
			const { shares, averageprice, notes } = req.body;

			const updateData: any = {};
			if (shares !== undefined) updateData.shares = parseFloat(shares);
			if (averageprice !== undefined)
				updateData.averageprice = parseFloat(averageprice);
			if (notes !== undefined) updateData.notes = notes;

			const holding = await stockAccountService.updateHolding(
				stockId,
				userId,
				updateData
			);

			res.status(200).json({
				success: true,
				data: holding,
				message: 'Stock holding updated successfully',
			});
		} catch (error) {
			logger.error('Error in updateHolding controller:', error);
			res.status(400).json({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Failed to update stock holding',
			});
		}
	},

	// Delete a holding
	async deleteHolding(req: Request, res: Response) {
		try {
			const stockId = parseInt(req.params.stockId);
			const userId = parseInt(req.body.userid);

			const result = await stockAccountService.deleteHolding(
				stockId,
				userId
			);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			logger.error('Error in deleteHolding controller:', error);
			res.status(404).json({
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Failed to delete stock holding',
			});
		}
	},

	// Get portfolio summary
	async getPortfolioSummary(req: Request, res: Response) {
		try {
			const userId = parseInt(req.params.userId);
			const summary = await stockAccountService.getPortfolioSummary(
				userId
			);

			res.status(200).json({
				success: true,
				data: summary,
			});
		} catch (error) {
			logger.error('Error in getPortfolioSummary controller:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch portfolio summary',
			});
		}
	},
};
