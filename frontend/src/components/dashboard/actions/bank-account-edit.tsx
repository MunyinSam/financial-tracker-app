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
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUpdateBankAccount } from '@/src/services/bankAccount.hooks';

interface BankAccountEditProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	accountData: {
		bankName: string;
		bankLogo?: string;
		accountNumber: string;
		accountName: string;
		balance: number;
		accountType?: 'Savings' | 'Fixed' | 'Other';
		openedDate?: string;
	};
}

interface EditFormData {
	bankName: string;
	bankLogo: string;
	accountNumber: string;
	accountName: string;
	balance: number;
	accountType: 'Savings' | 'Fixed' | 'Other';
	openedDate: Date | undefined;
}

const bankOptions = [
	{ name: 'Kasikorn Bank', logo: '/Kbank.svg' },
	{ name: 'Krung Thai Bank', logo: '/Krungthai.svg' },
	{ name: 'KKP Bank', logo: '/Kkp.svg' },
	{ name: 'Bangkok Bank', logo: '/BangkokBank.svg' },
	{ name: 'SCB Bank', logo: '/SCB.svg' },
];

export function BankAccountEdit({
	open,
	onOpenChange,
	accountId,
	accountData,
}: BankAccountEditProps) {
	const updateMutation = useUpdateBankAccount();
	const [formData, setFormData] = useState<EditFormData>({
		bankName: '',
		bankLogo: '',
		accountNumber: '',
		accountName: '',
		balance: 0,
		accountType: 'Savings',
		openedDate: undefined,
	});

	// Populate form when dialog opens
	useEffect(() => {
		if (open && accountData) {
			setFormData({
				bankName: accountData.bankName,
				bankLogo: accountData.bankLogo || '',
				accountNumber: accountData.accountNumber,
				accountName: accountData.accountName,
				balance: accountData.balance,
				accountType: accountData.accountType || 'Savings',
				openedDate: accountData.openedDate
					? new Date(accountData.openedDate)
					: undefined,
			});
		}
	}, [open, accountData]);

	const handleBankChange = (bankName: string) => {
		const selectedBank = bankOptions.find((bank) => bank.name === bankName);
		setFormData({
			...formData,
			bankName,
			bankLogo: selectedBank?.logo || '',
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		updateMutation.mutate(
			{
				accountId,
				payload: {
					bankName: formData.bankName,
					bankLogo: formData.bankLogo,
					accountNumber: formData.accountNumber,
					accountName: formData.accountName,
					balance: formData.balance,
					accountType: formData.accountType,
					openedDate: formData.openedDate?.toISOString(),
				},
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Edit className="w-5 h-5 text-blue-500" />
						Edit Bank Account
					</DialogTitle>
					<DialogDescription>
						Update your bank account details below.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						{/* Bank Name */}
						<div className="grid gap-2">
							<Label htmlFor="bankName">Bank Name</Label>
							<Select
								value={formData.bankName}
								onValueChange={handleBankChange}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select bank" />
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
													className="w-6 h-6"
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
								onValueChange={(
									value: 'Savings' | 'Fixed' | 'Other'
								) =>
									setFormData({
										...formData,
										accountType: value,
									})
								}
								required
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Savings">
										Savings
									</SelectItem>
									<SelectItem value="Fixed">Fixed</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
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

						{/* Balance */}
						<div className="grid gap-2">
							<Label htmlFor="balance">Balance (฿)</Label>
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

						{/* Opened Date */}
						<div className="grid gap-2">
							<Label>Opened Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal',
											!formData.openedDate &&
												'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{formData.openedDate ? (
											format(formData.openedDate, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={formData.openedDate}
										onSelect={(date) =>
											setFormData({
												...formData,
												openedDate: date,
											})
										}
										initialFocus
										disabled={(date) =>
											date > new Date() ||
											date < new Date('1900-01-01')
										}
										fixedWeeks
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={updateMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={updateMutation.isPending}
						>
							{updateMutation.isPending
								? 'Saving...'
								: 'Save Changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
