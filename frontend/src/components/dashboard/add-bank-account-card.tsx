'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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

interface AddBankAccountCardProps {
	onAddAccount?: (accountData: BankAccountFormData) => void;
}

interface BankAccountFormData {
	bankName: string;
	accountNumber: string;
	accountName: string;
	accountType: 'Savings' | 'Fixed' | 'Other';
	balance: number;
	bankLogo: string;
}

const bankOptions = [
	{ name: 'Kasikorn Bank', logo: '/Kbank.svg' },
	{ name: 'Krung Thai Bank', logo: '/Krungthai.svg' },
	{ name: 'KKP Bank', logo: '/Kkp.svg' },
	{ name: 'Bangkok Bank', logo: '/BangkokBank.svg' },
	{ name: 'SCB Bank', logo: '/SCB.svg' },
];

export function AddBankAccountCard({ onAddAccount }: AddBankAccountCardProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<BankAccountFormData>({
		bankName: '',
		accountNumber: '',
		accountName: '',
		accountType: 'Savings',
		balance: 0,
		bankLogo: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (onAddAccount) {
			onAddAccount(formData);
		}
		setOpen(false);
		// Reset form
		setFormData({
			bankName: '',
			accountNumber: '',
			accountName: '',
			accountType: 'Savings',
			balance: 0,
			bankLogo: '',
		});
	};

	const handleBankChange = (bankName: string) => {
		const selectedBank = bankOptions.find((bank) => bank.name === bankName);
		setFormData({
			...formData,
			bankName,
			bankLogo: selectedBank?.logo || '',
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
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
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add New Bank Account</DialogTitle>
					<DialogDescription>
						Enter your bank account details to add it to your
						financial tracker.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						{/* Bank Name Select */}
						<div className="grid gap-2">
							<Label htmlFor="bankName">Bank Name</Label>
							<Select
								value={formData.bankName}
								onValueChange={handleBankChange}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a bank" />
								</SelectTrigger>
								<SelectContent>
									{bankOptions.map((bank) => (
										<SelectItem
											key={bank.name}
											value={bank.name}
										>
											<div className="flex items-center gap-2">
												<img
													src={bank.logo}
													alt={bank.name}
													className="w-6 h-6 object-contain"
												/>
												{bank.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Account Type */}
						<div className="grid gap-2">
							<Label htmlFor="accountType">Account Type</Label>
							<Select
								value={formData.accountType}
								onValueChange={(value) =>
									setFormData({
										...formData,
										accountType: value as
											| 'Savings'
											| 'Fixed'
											| 'Other',
									})
								}
								required
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Savings">
										Savings Account
									</SelectItem>
									<SelectItem value="Checking">
										Fixed Account
									</SelectItem>
									<SelectItem value="Credit">
										Other Account
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Account Number */}
						<div className="grid gap-2">
							<Label htmlFor="accountNumber">
								Account Number
							</Label>
							<Input
								id="accountNumber"
								placeholder="XXX-X-XXXXX-X"
								value={formData.accountNumber}
								onChange={(e) =>
									setFormData({
										...formData,
										accountNumber: e.target.value,
									})
								}
								required
							/>
						</div>

						{/* Account Name */}
						<div className="grid gap-2">
							<Label htmlFor="accountName">Account Name</Label>
							<Input
								id="accountName"
								placeholder="John Doe"
								value={formData.accountName}
								onChange={(e) =>
									setFormData({
										...formData,
										accountName: e.target.value,
									})
								}
								required
							/>
						</div>

						{/* Initial Balance */}
						<div className="grid gap-2">
							<Label htmlFor="balance">Initial Balance (฿)</Label>
							<Input
								id="balance"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={formData.balance || ''}
								onChange={(e) =>
									setFormData({
										...formData,
										balance:
											parseFloat(e.target.value) || 0,
									})
								}
								required
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Add Account</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
