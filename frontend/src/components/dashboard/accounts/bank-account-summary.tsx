'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBankAccountSummary } from '@/src/services/bankAccount.hooks';
import { Wallet, CreditCard, TrendingUp, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BankAccountSummaryProps {
	userId: string;
}

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
	}).format(amount);
};

const getAccountTypeColor = (type: string) => {
	switch (type) {
		case 'Savings':
			return 'bg-green-500';
		case 'Fixed':
			return 'bg-blue-500';
		case 'Other':
			return 'bg-purple-500';
		default:
			return 'bg-gray-500';
	}
};

export function BankAccountSummary({ userId }: BankAccountSummaryProps) {
	const { data: summary, isLoading, error } = useBankAccountSummary(userId);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-[120px] mb-2" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card className="border-red-200">
				<CardContent className="pt-6">
					<p className="text-red-600 text-sm">
						Failed to load summary:{' '}
						{error instanceof Error
							? error.message
							: 'Unknown error'}
					</p>
				</CardContent>
			</Card>
		);
	}

	if (!summary) {
		return null;
	}

	return (
		<div className="space-y-4">
			{/* Main Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Total Balance */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Balance
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{formatCurrency(summary.totalBalance)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Across all accounts
						</p>
					</CardContent>
				</Card>

				{/* Account Count */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Accounts
						</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{summary.accountCount}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Active bank accounts
						</p>
					</CardContent>
				</Card>

				{/* Average Balance */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Balance
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{formatCurrency(
								summary.accountCount > 0
									? summary.totalBalance /
											summary.accountCount
									: 0
							)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Per account
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Accounts by Type */}
			{summary.accountsByType.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="h-5 w-5" />
							Accounts by Type
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{summary.accountsByType.map((type) => {
								const percentage =
									summary.totalBalance > 0
										? (type.totalBalance /
												summary.totalBalance) *
										  100
										: 0;

								return (
									<div
										key={type.accountType}
										className="space-y-2"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div
													className={`w-3 h-3 rounded-full ${getAccountTypeColor(
														type.accountType
													)}`}
												/>
												<span className="text-sm font-medium">
													{type.accountType ||
														'Other'}
												</span>
												<span className="text-xs text-muted-foreground">
													({type.count}{' '}
													{type.count === 1
														? 'account'
														: 'accounts'}
													)
												</span>
											</div>
											<div className="text-right">
												<div className="text-sm font-semibold">
													{formatCurrency(
														type.totalBalance
													)}
												</div>
												<div className="text-xs text-muted-foreground">
													{percentage.toFixed(1)}%
												</div>
											</div>
										</div>
										{/* Progress Bar */}
										<div className="w-full bg-muted rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all ${getAccountTypeColor(
													type.accountType
												)}`}
												style={{
													width: `${percentage}%`,
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
