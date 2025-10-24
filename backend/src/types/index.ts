// Person types
export interface Person {
	PersonId: number;
	FName: string;
	LName: string;
	DateOfBirth?: Date;
	created_at: Date;
	updated_at: Date;
}

export interface CreatePersonDTO {
	FName: string;
	LName: string;
	DateOfBirth?: Date;
}

// Bank types
export interface Bank {
	BankId: number;
	BankName: string;
	RoutingNumber: string;
	created_at: Date;
	updated_at: Date;
}

export interface CreateBankDTO {
	BankName: string;
	RoutingNumber: string;
}

// BankAccount types
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

export interface CreateBankAccountDTO {
	PersonId: number;
	BankId: number;
	AccountNumber: string;
	Balance?: number;
	AccountType?: string;
}

// Transaction types
export interface Transaction {
	TransactionId: number;
	AccountId: number;
	Amount: number;
	TransactionTimestamp: Date;
	TransactionType: string;
	Description?: string;
}

export interface CreateTransactionDTO {
	AccountId: number;
	Amount: number;
	TransactionType: string;
	Description?: string;
}

// API Response type
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
