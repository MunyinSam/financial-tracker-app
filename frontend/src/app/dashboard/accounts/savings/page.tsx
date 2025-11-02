'use client';

import { BankAccountsCarousel } from '@/src/components/dashboard/bank-account-carousel';
import { useQuery } from '@tanstack/react-query';
import { BankAccount } from '@/src/types';
import { useBankAccounts } from '@/src/services/bankAccount.hooks';

export default function SummaryPage() {
	const { data: apiResponse = [], isLoading, error } = useBankAccounts();

	const accounts = apiResponse.map((account: any) => ({
		id: account.accountid.toString(),
		bankName: account.bankname,
		bankLogo: account.banklogo,
		accountNumber: account.accountnumber,
		accountName: account.accountname,
		balance: parseFloat(account.balance),
		accountType: account.accounttype,
		openedDate: account.openeddate || '2024-01-15',
		lastTransaction: account.lasttransaction || new Date().toISOString(),
		monthlyChange: parseFloat(account.monthlychange),
	}));

	if (error) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="text-red-500">
					Failed to load bank accounts:{' '}
					{error instanceof Error ? error.message : 'Unknown error'}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Bank Accounts Carousel */}
			{isLoading ? (
				<div className="text-muted-foreground">Loading accounts...</div>
			) : (
				<div className="border-2 p-5 rounded-lg">
					<BankAccountsCarousel accounts={accounts} />
				</div>
			)}
		</div>
	);
}
