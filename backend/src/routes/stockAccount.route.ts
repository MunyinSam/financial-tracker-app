import express from 'express';
import { stockAccountController } from '../controllers/stockAccount.controller';

const router = express.Router();

// Create a new stock holding
router.post('/', stockAccountController.createHolding);

// Get all holdings for a user
router.get('/user/:userId', stockAccountController.getUserHoldings);

// Get portfolio summary
router.get('/user/:userId/summary', stockAccountController.getPortfolioSummary);

// Get holdings by symbol
router.get('/symbol/:symbol', stockAccountController.getHoldingsBySymbol);

// Get a specific holding
router.get('/:stockId', stockAccountController.getHoldingById);

// Update a holding
router.put('/:stockId', stockAccountController.updateHolding);

// Delete a holding
router.delete('/:stockId', stockAccountController.deleteHolding);

export default router;
