'use client';

import { BankAccountsCarousel } from '@/src/components/dashboard/accounts/bank-account-carousel';
import { useBankAccountsByType } from '@/src/services/bankAccount.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { AddBankAccountCard } from '@/src/components/dashboard/accounts/add-bank-account-card';

export default function OtherPage() {
	const {
		data: apiResponse = [],
		isLoading,
		error,
	} = useBankAccountsByType('Other', '1');

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
					Failed to load other accounts:{' '}
					{error instanceof Error ? error.message : 'Unknown error'}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="mb-4 mt-6 ml-2">
				<h1 className="text-3xl font-bold">Other Accounts</h1>
				<p className="text-muted-foreground">
					View and manage your other accounts
				</p>
			</div>

			{isLoading ? (
				<div className="border-2 p-5 rounded-lg">
					<div className="space-y-4">
						<Skeleton className="h-[200px] w-full rounded-xl" />
						<div className="flex gap-2 justify-center">
							<Skeleton className="h-2 w-2 rounded-full" />
							<Skeleton className="h-2 w-2 rounded-full" />
							<Skeleton className="h-2 w-2 rounded-full" />
						</div>
					</div>
				</div>
			) : accounts.length === 0 ? (
				<div className="border-2 p-5 rounded-lg">
					<p className="text-muted-foreground mb-4">
						No other accounts found
					</p>
					<div className="overflow-x-auto pb-4 -mx-4 px-4">
						<div className="flex gap-4 w-max">
							<AddBankAccountCard />
						</div>
					</div>
				</div>
			) : (
				<div className="border-2 p-5 rounded-lg">
					<BankAccountsCarousel accounts={accounts} />
				</div>
			)}
		</div>
	);
}
