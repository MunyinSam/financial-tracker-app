'use client';

import { BankAccountsCarousel } from '@/src/components/dashboard/accounts/bank-account-carousel';
import { BankAccountSummary } from '@/src/components/dashboard/accounts/bank-account-summary';
import { useBankAccounts } from '@/src/services/bankAccount.hooks';

export default function SummaryPage() {
	const { data: apiResponse = [], isLoading, error } = useBankAccounts();

	// TODO: Replace with actual user ID from auth
	const userId = '1';

	const accounts = apiResponse.map((account: any) => ({
		id: account.accountid.toString(),
		bankName: account.bankname,
		bankLogo: account.banklogo,
		accountNumber: account.accountnumber,
		accountName: account.accountname,
		balance: parseFloat(account.balance),
		accountType: account.accounttype,
		openedDate: account.openeddate || '2024-01-15',
		lastTransaction: account.lasttransaction || '2024-10-20',
		monthlyChange: parseFloat(account.monthlychange || '0'),
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
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-full overflow-x-hidden">
			<div className="mb-4 mt-6 ml-2">
				<h1 className="text-3xl font-bold">Summary</h1>
				<p className="text-muted-foreground">accounts summary</p>
			</div>

			{/* Summary Cards */}
			<BankAccountSummary userId={userId} />

			{/* Bank Accounts Carousel */}
			{/* {isLoading ? (
				<div className="text-muted-foreground">Loading accounts...</div>
			) : (
				<div className="border-2 p-5 rounded-lg w-450">
					<BankAccountsCarousel accounts={accounts} />
				</div>
			)} */}
		</div>
	);
}
