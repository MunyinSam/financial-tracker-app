export interface BankAccount {
	AccountId: number;
	PersonId: number;
	BankId: number;
	AccountNumber: string;
	Balance: number;
	AccountType?: string;
	created_at: Date;
	updated_at: Date;
}