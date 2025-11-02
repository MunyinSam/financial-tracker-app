'use client';

import { BankAccountsCarousel } from "@/src/components/dashboard/bank-account-carousel";
import { BankAccount } from "@/src/types";

const mockBankAccounts: BankAccount[] = [
	{
		id: '1',
		bankName: 'Kasikorn Bank',
		bankLogo: '/Kbank.svg',
		accountNumber: '123-4-56789-0',
		accountName: 'John Doe',
		balance: 45678.5,
		accountType: 'Savings',
		openedDate: '2023-03-15',
		lastTransaction: '2024-10-22',
		monthlyChange: 3500.25,
	},
	{
		id: '2',
		bankName: 'Krung Thai Bank',
		bankLogo: '/Krungthai.svg',
		accountNumber: '987-6-54321-0',
		accountName: 'John Doe',
		balance: 23456.75,
		accountType: 'Checking',
		openedDate: '2022-06-10',
		lastTransaction: '2024-10-21',
		monthlyChange: -1200.5,
	},
	{
		id: '3',
		bankName: 'KKP Bank',
		bankLogo: '/Kkp.svg',
		accountNumber: '555-5-55555-5',
		accountName: 'John Doe',
		balance: 12345.0,
		accountType: 'Savings',
		openedDate: '2024-01-20',
		lastTransaction: '2024-10-20',
		monthlyChange: 2100.0,
	},
	{
		id: '4',
		bankName: 'Bangkok Bank',
		bankLogo: '/Kbank.svg',
		accountNumber: '777-8-99999-9',
		accountName: 'John Doe',
		balance: 67890.25,
		accountType: 'Checking',
		openedDate: '2021-11-05',
		lastTransaction: '2024-10-23',
		monthlyChange: 5600.75,
	},
];

const monthlyData = [
	{ month: 'May', income: 65000, spending: 42000 },
	{ month: 'Jun', income: 68000, spending: 45000 },
	{ month: 'Jul', income: 72000, spending: 48000 },
	{ month: 'Aug', income: 70000, spending: 43000 },
	{ month: 'Sep', income: 75000, spending: 51000 },
	{ month: 'Oct', income: 78000, spending: 47000 },
];

export default function SummaryPage() {
	// Calculate totals

	const handleAddAccount = () => {
		console.log('Add new bank account');
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Bank Accounts Carousel */}
			<BankAccountsCarousel
				accounts={mockBankAccounts}
				onAddAccount={handleAddAccount}
			/>
		</div>
	);
}
