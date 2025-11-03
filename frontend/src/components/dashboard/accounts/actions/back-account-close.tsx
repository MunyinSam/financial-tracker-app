'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { useDeleteBankAccount } from '@/src/services/bankAccount.hooks';

interface BankAccountCloseProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	bankName: string;
	accountName: string;
}

export function BankAccountClose({
	open,
	onOpenChange,
	accountId,
	bankName,
	accountName,
}: BankAccountCloseProps) {
	const deleteMutation = useDeleteBankAccount();

	const handleConfirmClose = () => {
		deleteMutation.mutate(accountId, {
			onSuccess: () => {
				onOpenChange(false);
			},
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2 text-red-600">
						<AlertTriangle className="w-5 h-5" />
						Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete your{' '}
						<span className="font-semibold">
							{bankName} - {accountName}
						</span>{' '}
						account. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirmClose}
						className="bg-red-600 hover:bg-red-700"
					>
						Delete Account
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
