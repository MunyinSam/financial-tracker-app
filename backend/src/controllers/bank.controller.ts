import { Request, Response } from 'express';
import { BankService } from '../services/bank.service';

export class BankController {
	static async getAll(req: Request, res: Response) {
		try {
			const banks = await BankService.getAllBanks();
			res.json({
				success: true,
				data: banks,
			});
		} catch (error: any) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const bank = await BankService.getBankById(id);

			res.json({
				success: true,
				data: bank,
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async create(req: Request, res: Response) {
		try {
			const bank = await BankService.createBank(req.body);

			res.status(201).json({
				success: true,
				data: bank,
				message: 'Bank created successfully',
			});
		} catch (error: any) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async update(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			const bank = await BankService.updateBank(id, req.body);

			res.json({
				success: true,
				data: bank,
				message: 'Bank updated successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 400;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const id = parseInt(req.params.id);
			await BankService.deleteBank(id);

			res.json({
				success: true,
				message: 'Bank deleted successfully',
			});
		} catch (error: any) {
			const status = error.message.includes('not found') ? 404 : 500;
			res.status(status).json({
				success: false,
				error: error.message,
			});
		}
	}
}
