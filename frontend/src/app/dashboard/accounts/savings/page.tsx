'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BankAccount {
	id: string;
	bankName: string;
	bankLogo: string;
	accountNumber: string;
	accountName: string;
	balance: number;
}

const mockBankAccounts: BankAccount[] = [
	{
		id: '1',
		bankName: 'Kasikorn Bank',
		bankLogo: '/Kbank.svg',
		accountNumber: '123-4-56789-0',
		accountName: 'John Doe',
		balance: 45678.5,
	},
	{
		id: '2',
		bankName: 'Krung Thai Bank',
		bankLogo: '/Krungthai.svg',
		accountNumber: '987-6-54321-0',
		accountName: 'John Doe',
		balance: 23456.75,
	},
	{
		id: '3',
		bankName: 'KKP Bank',
		bankLogo: '/Kkp.svg',
		accountNumber: '555-5-55555-5',
		accountName: 'John Doe',
		balance: 12345.0,
	},
	{
		id: '4',
		bankName: 'Bangkok Bank',
		bankLogo: '/Kbank.svg',
		accountNumber: '777-8-99999-9',
		accountName: 'John Doe',
		balance: 67890.25,
	},
];

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
	}).format(amount);
};

export default function SummaryPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Horizontal Scrollable Bank Cards Container */}
			<div className="w-full">
				<div className="overflow-x-auto pb-4 -mx-4 px-4">
					<div className="flex gap-4 w-max">
						{mockBankAccounts.map((account) => (
							<div
								key={account.id}
								className="w-80 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border"
							>
								{/* Bank Logo Section */}
								<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-center h-32">
									<img
										src={account.bankLogo}
										alt={account.bankName}
										className="h-16 w-16 object-contain filter drop-shadow-lg"
									/>
								</div>

								{/* Account Details Section */}
								<div className="p-4">
									<h2 className="text-lg font-semibold mb-3">
										{account.bankName}
									</h2>

									<div className="space-y-2">
										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wide">
												Account Number
											</p>
											<p className="text-sm font-mono">
												{account.accountNumber}
											</p>
										</div>

										<div>
											<p className="text-xs text-muted-foreground uppercase tracking-wide">
												Account Name
											</p>
											<p className="text-sm">
												{account.accountName}
											</p>
										</div>

										<div className="pt-2 border-t">
											<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
												Balance
											</p>
											<p className="text-xl font-bold text-green-600">
												{formatCurrency(
													account.balance
												)}
											</p>
										</div>
									</div>
								</div>

								{/* Action Button */}
								<div className="px-4 pb-4">
									<Button
										variant="outline"
										className="w-full"
										size="sm"
									>
										View Details
									</Button>
								</div>
							</div>
						))}

						{/* Add Bank Account Card */}
						<div className="w-80">
							<button className="w-full h-full bg-card rounded-xl shadow-sm hover:shadow-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
								<div className="h-full flex flex-col items-center justify-center p-6 min-h-[380px]">
									<div className="bg-primary/10 rounded-full p-6 mb-4 group-hover:bg-primary/20 transition-colors">
										<Plus className="w-12 h-12 text-primary" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										Add Bank Account
									</h3>
									<p className="text-sm text-muted-foreground text-center">
										Connect a new bank account to track your
										finances
									</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Total Balance Summary */}
			<div className="bg-card rounded-xl shadow-sm border p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Total Balance</h2>
					<p className="text-3xl font-bold text-green-600">
						{formatCurrency(
							mockBankAccounts.reduce(
								(sum, account) => sum + account.balance,
								0
							)
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
