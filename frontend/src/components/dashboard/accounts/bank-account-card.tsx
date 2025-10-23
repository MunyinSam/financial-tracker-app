'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
	CreditCard,
	User,
	Hash,
	Wallet,
	Calendar,
	TrendingUp,
} from 'lucide-react';

interface BankAccountCardProps {
	id: string;
	bankName: string;
	bankLogo: string;
	accountNumber: string;
	accountName: string;
	balance: number;
	accountType?: 'Savings' | 'Checking' | 'Credit';
	openedDate?: string;
	lastTransaction?: string;
	monthlyChange?: number;
}

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
	}).format(amount);
};

export function BankAccountCard({
	id,
	bankName,
	bankLogo,
	accountNumber,
	accountName,
	balance,
	accountType = 'Savings',
	openedDate = '2024-01-15',
	lastTransaction = '2024-10-20',
	monthlyChange = 2500.5,
}: BankAccountCardProps) {
	const changePercentage = ((monthlyChange / balance) * 100).toFixed(2);

	return (
		<Dialog>
			<div className="w-80 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border">
				{/* Bank Logo Section */}
				<div className="bg-linear-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-center h-32">
					<img
						src={bankLogo}
						alt={bankName}
						className="h-16 w-16 object-contain filter drop-shadow-lg"
					/>
				</div>

				{/* Account Details Section */}
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-3">{bankName}</h2>

					<div className="space-y-2">
						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Account Number
							</p>
							<p className="text-sm font-mono">{accountNumber}</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Account Name
							</p>
							<p className="text-sm">{accountName}</p>
						</div>

						<div className="pt-2 border-t">
							<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
								Balance
							</p>
							<p className="text-xl font-bold text-green-600">
								{formatCurrency(balance)}
							</p>
						</div>
					</div>
				</div>

				{/* Action Button */}
				<div className="px-4 pb-4">
					<DialogTrigger asChild>
						<Button variant="outline" className="w-full" size="sm">
							View Details
						</Button>
					</DialogTrigger>
				</div>
			</div>

			{/* Dialog Content */}
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center gap-4">
						<div className="bg-linear-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
							<img
								src={bankLogo}
								alt={bankName}
								className="h-12 w-12 object-contain filter drop-shadow-lg"
							/>
						</div>
						<div>
							<DialogTitle className="text-2xl">
								{bankName}
							</DialogTitle>
							<DialogDescription>
								Account details and information
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-6 mt-4">
					{/* Account Type Badge */}
					<div className="flex items-center justify-between">
						<Badge variant="secondary" className="text-sm">
							{accountType} Account
						</Badge>
						<Badge
							variant={
								monthlyChange >= 0 ? 'default' : 'destructive'
							}
							className="text-sm"
						>
							<TrendingUp className="w-3 h-3 mr-1" />
							{monthlyChange >= 0 ? '+' : ''}
							{changePercentage}% this month
						</Badge>
					</div>

					<Separator />

					{/* Balance Section */}
					<div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
						<p className="text-sm text-muted-foreground mb-1">
							Current Balance
						</p>
						<p className="text-4xl font-bold text-green-600">
							{formatCurrency(balance)}
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							Monthly Change:{' '}
							<span
								className={
									monthlyChange >= 0
										? 'text-green-600 font-semibold'
										: 'text-red-600 font-semibold'
								}
							>
								{monthlyChange >= 0 ? '+' : ''}
								{formatCurrency(monthlyChange)}
							</span>
						</p>
					</div>

					{/* Account Information Grid */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1 p-4 bg-muted/50 rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Hash className="w-4 h-4" />
								<p className="text-xs uppercase tracking-wide">
									Account Number
								</p>
							</div>
							<p className="text-sm font-mono font-semibold">
								{accountNumber}
							</p>
						</div>

						<div className="space-y-1 p-4 bg-muted/50 rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground">
								<User className="w-4 h-4" />
								<p className="text-xs uppercase tracking-wide">
									Account Name
								</p>
							</div>
							<p className="text-sm font-semibold">
								{accountName}
							</p>
						</div>

						<div className="space-y-1 p-4 bg-muted/50 rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Calendar className="w-4 h-4" />
								<p className="text-xs uppercase tracking-wide">
									Opened Date
								</p>
							</div>
							<p className="text-sm font-semibold">
								{new Date(openedDate).toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									}
								)}
							</p>
						</div>

						<div className="space-y-1 p-4 bg-muted/50 rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Wallet className="w-4 h-4" />
								<p className="text-xs uppercase tracking-wide">
									Last Transaction
								</p>
							</div>
							<p className="text-sm font-semibold">
								{new Date(lastTransaction).toLocaleDateString(
									'en-US',
									{
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									}
								)}
							</p>
						</div>
					</div>

					{/* Quick Actions */}
					<Separator />
					<div>
						<h3 className="text-sm font-semibold mb-3">
							Quick Actions
						</h3>
						<div className="grid grid-cols-3 gap-2">
							<Button
								variant="outline"
								size="sm"
								className="w-full"
							>
								Transfer
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full"
							>
								History
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full text-red-600 hover:text-red-700"
							>
								Close Account
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
