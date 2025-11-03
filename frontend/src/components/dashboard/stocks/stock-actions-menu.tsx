'use client';

import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import {
	useUpdateStockHolding,
	useDeleteStockHolding,
} from '@/src/services/stockHoldings.hooks';

interface StockActionsMenuProps {
	stock: {
		id: number;
		stockid: number;
		symbol: string;
		name: string;
		shares: number;
		avgPrice: number;
	};
	userId: number;
}

export function StockActionsMenu({ stock, userId }: StockActionsMenuProps) {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [shares, setShares] = useState(stock.shares.toString());
	const [avgPrice, setAvgPrice] = useState(stock.avgPrice.toString());
	const [notes, setNotes] = useState('');

	const updateHolding = useUpdateStockHolding();
	const deleteHolding = useDeleteStockHolding();

	const handleUpdate = async () => {
		try {
			await updateHolding.mutateAsync({
				stockId: stock.stockid,
				data: {
					userid: userId,
					shares: parseFloat(shares),
					averageprice: parseFloat(avgPrice),
					notes,
				},
			});
			setEditDialogOpen(false);
		} catch (error) {
			console.error('Error updating stock:', error);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteHolding.mutateAsync({
				stockId: stock.stockid,
				userId,
			});
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error('Error deleting stock:', error);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
						<Edit className="h-4 w-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setDeleteDialogOpen(true)}
						className="text-red-600"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Edit Dialog */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Stock Holding</DialogTitle>
						<DialogDescription>
							Update the details of your {stock.symbol} holding.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="edit-shares">
								Number of Shares
							</Label>
							<Input
								id="edit-shares"
								type="number"
								value={shares}
								onChange={(e) => setShares(e.target.value)}
								min="0"
								step="0.01"
								disabled={updateHolding.isPending}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="edit-avgPrice">Average Price</Label>
							<Input
								id="edit-avgPrice"
								type="number"
								value={avgPrice}
								onChange={(e) => setAvgPrice(e.target.value)}
								min="0"
								step="0.01"
								disabled={updateHolding.isPending}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="edit-notes">Notes (Optional)</Label>
							<Input
								id="edit-notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Add any notes about this holding..."
								disabled={updateHolding.isPending}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditDialogOpen(false)}
							disabled={updateHolding.isPending}
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdate}
							disabled={
								!shares || !avgPrice || updateHolding.isPending
							}
						>
							{updateHolding.isPending ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Updating...
								</>
							) : (
								'Save Changes'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete your {stock.symbol}{' '}
							holding ({stock.shares} shares). This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteHolding.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleteHolding.isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{deleteHolding.isPending ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Deleting...
								</>
							) : (
								'Delete'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
