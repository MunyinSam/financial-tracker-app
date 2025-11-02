export interface BankAccount {
	id: string;
	bankName: string;
	bankLogo?: string;
	accountNumber: string;
	accountName: string;
	balance: number;
	accountType?: 'Savings' | 'Fixed' | 'Other';
	openedDate?: string;
	lastTransaction?: string;
	monthlyChange?: number;
}

export interface BankAccountCreatePayload {
	userId?: string;
	bankName: string;
	bankLogo?: string;
	accountNumber: string;
	accountName: string;
	accountType?: 'Savings' | 'Fixed' | 'Other';
	balance: number;
	openedDate?: string;
}

export interface BankAccountUpdatePayload {
	bankName?: string;
	bankLogo?: string;
	accountNumber?: string;
	accountName?: string;
	accountType?: 'Savings' | 'Fixed' | 'Other';
	balance?: number;
	openedDate?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export const bankAccountApi = {
	async getAll(): Promise<BankAccount[]> {
		const res = await fetch(`${API_URL}/api/bank-accounts`);
		if (!res.ok) throw new Error('Failed to fetch bank accounts');
		return res.json();
	},

	async create(payload: BankAccountCreatePayload): Promise<BankAccount> {
		const res = await fetch(`${API_URL}/api/bank-accounts`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(text || 'Failed to create bank account');
		}
		return res.json();
	},

	async update(
		accountId: string,
		payload: BankAccountUpdatePayload
	): Promise<BankAccount> {
		const res = await fetch(`${API_URL}/api/bank-accounts/${accountId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(text || 'Failed to update bank account');
		}
		return res.json();
	},

	async delete(accountId: string): Promise<void> {
		const res = await fetch(`${API_URL}/api/bank-accounts/${accountId}`, {
			method: 'DELETE',
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(text || 'Failed to delete bank account');
		}
	},
};
