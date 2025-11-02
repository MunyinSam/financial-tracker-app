// Bank Account

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