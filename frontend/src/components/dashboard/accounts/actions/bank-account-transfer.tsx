'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftRight, ArrowRight, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TransferFormData {
	fromAccount: string;
	toAccount: string;
	amount: number;
	note: string;
}

interface BankAccountTransferProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	preSelectedAccountId?: string;
}

export function BankAccountTransfer({
	open,
	onOpenChange,
	preSelectedAccountId,
}: BankAccountTransferProps) {
	const [formData, setFormData] = useState<TransferFormData>({
		fromAccount: '',
		toAccount: '',
		amount: 0,
		note: '',
	});

	// Mock data - replace with actual account data from your API
	const accounts = [
		{ id: '1', name: 'Kasikorn Bank - Savings', balance: 50000 },
		{ id: '2', name: 'Bangkok Bank - Checking', balance: 30000 },
		{ id: '3', name: 'SCB Bank - Fixed', balance: 100000 },
	];

	// Set pre-selected account when dialog opens
	useEffect(() => {
		if (open && preSelectedAccountId) {
			setFormData((prev) => ({
				...prev,
				fromAccount: preSelectedAccountId,
			}));
		}
	}, [open, preSelectedAccountId]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Add transfer logic here
		console.log('Transfer:', formData);
		onOpenChange(false);
		// Reset form
		setFormData({
			fromAccount: '',
			toAccount: '',
			amount: 0,
			note: '',
		});
	};

	const fromAccountData = accounts.find(
		(acc) => acc.id === formData.fromAccount
	);
	const toAccountData = accounts.find((acc) => acc.id === formData.toAccount);

	const canTransfer =
		formData.fromAccount &&
		formData.toAccount &&
		formData.amount > 0 &&
		formData.fromAccount !== formData.toAccount &&
		fromAccountData &&
		formData.amount <= fromAccountData.balance;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ArrowLeftRight className="w-5 h-5 text-blue-500" />
						Transfer Between Accounts
					</DialogTitle>
					<DialogDescription>
						Transfer money between your bank accounts instantly.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						{/* From Account */}
						<div className="grid gap-2">
							<Label htmlFor="fromAccount">From Account</Label>
							<Select
								value={formData.fromAccount}
								onValueChange={(value) =>
									setFormData({
										...formData,
										fromAccount: value,
									})
								}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select source account" />
								</SelectTrigger>
								<SelectContent>
									{accounts.map((account) => (
										<SelectItem
											key={account.id}
											value={account.id}
											disabled={
												account.id ===
												formData.toAccount
											}
										>
											<div className="flex items-center justify-between w-full">
												<span>{account.name}</span>
												<span className="text-xs text-muted-foreground ml-2">
													฿
													{account.balance.toLocaleString()}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fromAccountData && (
								<p className="text-xs text-muted-foreground">
									Available: ฿
									{fromAccountData.balance.toLocaleString()}
								</p>
							)}
						</div>

						{/* Transfer Arrow */}
						<div className="flex justify-center">
							<div className="bg-muted p-2 rounded-full">
								<ArrowRight className="w-5 h-5 text-primary" />
							</div>
						</div>

						{/* To Account */}
						<div className="grid gap-2">
							<Label htmlFor="toAccount">To Account</Label>
							<Select
								value={formData.toAccount}
								onValueChange={(value) =>
									setFormData({
										...formData,
										toAccount: value,
									})
								}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select destination account" />
								</SelectTrigger>
								<SelectContent>
									{accounts.map((account) => (
										<SelectItem
											key={account.id}
											value={account.id}
											disabled={
												account.id ===
												formData.fromAccount
											}
										>
											<div className="flex items-center justify-between w-full">
												<span>{account.name}</span>
												<span className="text-xs text-muted-foreground ml-2">
													฿
													{account.balance.toLocaleString()}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Amount */}
						<div className="grid gap-2">
							<Label htmlFor="amount">Amount (฿)</Label>
							<Input
								id="amount"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={formData.amount || ''}
								onChange={(e) =>
									setFormData({
										...formData,
										amount: parseFloat(e.target.value) || 0,
									})
								}
								required
							/>
							{formData.amount > 0 &&
								fromAccountData &&
								formData.amount > fromAccountData.balance && (
									<p className="text-xs text-destructive">
										Insufficient balance
									</p>
								)}
						</div>

						{/* Note */}
						<div className="grid gap-2">
							<Label htmlFor="note">
								Note{' '}
								<span className="text-muted-foreground">
									(Optional)
								</span>
							</Label>
							<Textarea
								id="note"
								placeholder="Add a note for this transfer..."
								value={formData.note}
								onChange={(e) =>
									setFormData({
										...formData,
										note: e.target.value,
									})
								}
								rows={3}
							/>
						</div>

						{/* Transfer Summary */}
						{canTransfer && (
							<div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
								<h4 className="font-semibold text-sm flex items-center gap-2">
									<Wallet className="w-4 h-4" />
									Transfer Summary
								</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											From:
										</span>
										<span className="font-medium">
											{fromAccountData?.name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											To:
										</span>
										<span className="font-medium">
											{toAccountData?.name}
										</span>
									</div>
									<div className="flex justify-between pt-2 border-t">
										<span className="text-muted-foreground">
											Amount:
										</span>
										<span className="font-bold text-primary">
											฿{formData.amount.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!canTransfer}>
							Transfer Money
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
