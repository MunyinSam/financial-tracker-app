import { BankModel } from '../models/bank.model';
import { Bank, CreateBankDTO } from '../types';

export class BankService {
	static async getAllBanks(): Promise<Bank[]> {
		return await BankModel.findAll();
	}

	static async getBankById(id: number): Promise<Bank> {
		if (!id || id <= 0) {
			throw new Error('Invalid bank ID');
		}

		const bank = await BankModel.findById(id);

		if (!bank) {
			throw new Error('Bank not found');
		}

		return bank;
	}

	static async createBank(data: CreateBankDTO): Promise<Bank> {
		// Validation
		if (!data.BankName || data.BankName.trim().length === 0) {
			throw new Error('Bank name is required');
		}

		if (!data.RoutingNumber || data.RoutingNumber.trim().length === 0) {
			throw new Error('Routing number is required');
		}

		if (data.BankName.length > 255) {
			throw new Error('Bank name must be less than 255 characters');
		}

		// Check if routing number already exists
		const existing = await BankModel.findByRoutingNumber(
			data.RoutingNumber
		);
		if (existing) {
			throw new Error('Routing number already exists');
		}

		// Validate routing number format (9 digits)
		const routingRegex = /^\d{9}$/;
		if (!routingRegex.test(data.RoutingNumber)) {
			throw new Error('Routing number must be exactly 9 digits');
		}

		return await BankModel.create(data);
	}

	static async updateBank(
		id: number,
		data: Partial<CreateBankDTO>
	): Promise<Bank> {
		// Check if bank exists
		await this.getBankById(id);

		// Validation
		if (data.BankName !== undefined && data.BankName.trim().length === 0) {
			throw new Error('Bank name cannot be empty');
		}

		if (
			data.RoutingNumber !== undefined &&
			data.RoutingNumber.trim().length === 0
		) {
			throw new Error('Routing number cannot be empty');
		}

		// Check routing number uniqueness if being updated
		if (data.RoutingNumber) {
			const existing = await BankModel.findByRoutingNumber(
				data.RoutingNumber
			);
			if (existing && existing.BankId !== id) {
				throw new Error('Routing number already exists');
			}
		}

		const updated = await BankModel.update(id, data);

		if (!updated) {
			throw new Error('Failed to update bank');
		}

		return updated;
	}

	static async deleteBank(id: number): Promise<void> {
		// Check if bank exists
		await this.getBankById(id);

		const deleted = await BankModel.delete(id);

		if (!deleted) {
			throw new Error('Failed to delete bank');
		}
	}
}
