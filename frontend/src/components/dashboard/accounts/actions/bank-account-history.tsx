'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	History,
	ArrowUpRight,
	ArrowDownLeft,
	Search,
	Filter,
	Download,
	Calendar,
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
	id: string;
	type: 'transfer-in' | 'transfer-out' | 'deposit' | 'withdrawal';
	amount: number;
	date: string;
	description: string;
	fromAccount?: string;
	toAccount?: string;
	status: 'completed' | 'pending' | 'failed';
}

interface BankAccountHistoryProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	accountName: string;
}

// Demo transaction data
const demoTransactions: Transaction[] = [
	{
		id: '1',
		type: 'transfer-out',
		amount: 5000,
		date: '2024-11-02T10:30:00',
		description: 'Transfer to Bangkok Bank',
		fromAccount: 'Kasikorn Bank - Savings',
		toAccount: 'Bangkok Bank - Checking',
		status: 'completed',
	},
	{
		id: '2',
		type: 'transfer-in',
		amount: 12000,
		date: '2024-11-01T14:20:00',
		description: 'Transfer from SCB Bank',
		fromAccount: 'SCB Bank - Fixed',
		toAccount: 'Kasikorn Bank - Savings',
		status: 'completed',
	},
	{
		id: '3',
		type: 'deposit',
		amount: 50000,
		date: '2024-10-30T09:15:00',
		description: 'Salary deposit',
		status: 'completed',
	},
	{
		id: '4',
		type: 'transfer-out',
		amount: 3500,
		date: '2024-10-29T16:45:00',
		description: 'Transfer to KKP Bank',
		fromAccount: 'Kasikorn Bank - Savings',
		toAccount: 'KKP Bank - Savings',
		status: 'completed',
	},
	{
		id: '5',
		type: 'withdrawal',
		amount: 2000,
		date: '2024-10-28T11:00:00',
		description: 'ATM withdrawal',
		status: 'completed',
	},
	{
		id: '6',
		type: 'transfer-in',
		amount: 8500,
		date: '2024-10-27T13:30:00',
		description: 'Transfer from Bangkok Bank',
		fromAccount: 'Bangkok Bank - Checking',
		toAccount: 'Kasikorn Bank - Savings',
		status: 'completed',
	},
	{
		id: '7',
		type: 'transfer-out',
		amount: 15000,
		date: '2024-10-26T10:00:00',
		description: 'Transfer to SCB Bank',
		fromAccount: 'Kasikorn Bank - Savings',
		toAccount: 'SCB Bank - Fixed',
		status: 'pending',
	},
	{
		id: '8',
		type: 'deposit',
		amount: 25000,
		date: '2024-10-25T08:30:00',
		description: 'Bonus payment',
		status: 'completed',
	},
];

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('th-TH', {
		style: 'currency',
		currency: 'THB',
	}).format(amount);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

const formatTime = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export function BankAccountHistory({
	open,
	onOpenChange,
	accountId,
	accountName,
}: BankAccountHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filterType, setFilterType] = useState<string>('all');

	const filteredTransactions = demoTransactions.filter((transaction) => {
		const matchesSearch =
			transaction.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			transaction.fromAccount
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			transaction.toAccount
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesFilter =
			filterType === 'all' || transaction.type === filterType;

		return matchesSearch && matchesFilter;
	});

	const getTransactionIcon = (type: string) => {
		switch (type) {
			case 'transfer-in':
			case 'deposit':
				return (
					<div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
						<ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
					</div>
				);
			case 'transfer-out':
			case 'withdrawal':
				return (
					<div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
						<ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
					</div>
				);
			default:
				return null;
		}
	};

	const getTransactionColor = (type: string) => {
		switch (type) {
			case 'transfer-in':
			case 'deposit':
				return 'text-green-600 dark:text-green-400';
			case 'transfer-out':
			case 'withdrawal':
				return 'text-red-600 dark:text-red-400';
			default:
				return 'text-gray-600';
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<Badge
						variant="secondary"
						className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
					>
						Completed
					</Badge>
				);
			case 'pending':
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
					>
						Pending
					</Badge>
				);
			case 'failed':
				return (
					<Badge
						variant="secondary"
						className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
					>
						Failed
					</Badge>
				);
			default:
				return null;
		}
	};

	const totalIn = demoTransactions
		.filter((t) => t.type === 'transfer-in' || t.type === 'deposit')
		.reduce((sum, t) => sum + t.amount, 0);

	const totalOut = demoTransactions
		.filter((t) => t.type === 'transfer-out' || t.type === 'withdrawal')
		.reduce((sum, t) => sum + t.amount, 0);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-[700px] max-h-screen"
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<History className="w-5 h-5 text-blue-500" />
						Transaction History
					</DialogTitle>
					<DialogDescription>{accountName}</DialogDescription>
				</DialogHeader>

				{/* Summary Cards */}
				<div className="grid grid-cols-2 gap-4 py-4">
					<div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
						<p className="text-xs text-green-700 dark:text-green-400 mb-1">
							Total In
						</p>
						<p className="text-xl font-bold text-green-600 dark:text-green-400">
							{formatCurrency(totalIn)}
						</p>
					</div>
					<div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
						<p className="text-xs text-red-700 dark:text-red-400 mb-1">
							Total Out
						</p>
						<p className="text-xl font-bold text-red-600 dark:text-red-400">
							{formatCurrency(totalOut)}
						</p>
					</div>
				</div>

				<Separator />

				{/* Filters */}
				<div className="flex gap-2">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search transactions..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={filterType} onValueChange={setFilterType}>
						<SelectTrigger className="w-[180px]">
							<Filter className="w-4 h-4 mr-2" />
							<SelectValue placeholder="Filter" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="transfer-in">
								Transfer In
							</SelectItem>
							<SelectItem value="transfer-out">
								Transfer Out
							</SelectItem>
							<SelectItem value="deposit">Deposit</SelectItem>
							<SelectItem value="withdrawal">
								Withdrawal
							</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" size="icon">
						<Download className="w-4 h-4" />
					</Button>
				</div>

				{/* Transaction List */}
				<div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
					{filteredTransactions.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<History className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>No transactions found</p>
						</div>
					) : (
						filteredTransactions.map((transaction) => (
							<div
								key={transaction.id}
								className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
							>
								{getTransactionIcon(transaction.type)}

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<p className="font-semibold text-sm">
											{transaction.description}
										</p>
										{getStatusBadge(transaction.status)}
									</div>
									{(transaction.fromAccount ||
										transaction.toAccount) && (
										<p className="text-xs text-muted-foreground">
											{transaction.type === 'transfer-out'
												? `To: ${transaction.toAccount}`
												: `From: ${transaction.fromAccount}`}
										</p>
									)}
									<div className="flex items-center gap-2 mt-1">
										<Calendar className="w-3 h-3 text-muted-foreground" />
										<p className="text-xs text-muted-foreground">
											{formatDate(transaction.date)} at{' '}
											{formatTime(transaction.date)}
										</p>
									</div>
								</div>

								<div className="text-right">
									<p
										className={`font-bold text-lg ${getTransactionColor(
											transaction.type
										)}`}
									>
										{transaction.type === 'transfer-in' ||
										transaction.type === 'deposit'
											? '+'
											: '-'}
										{formatCurrency(transaction.amount)}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
