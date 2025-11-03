'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, TrendingUp } from 'lucide-react';
import { useStockQuote } from '@/src/services/stocks.hooks';
import { useCreateStockHolding } from '@/src/services/stockHoldings.hooks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const stockLogos: { [key: string]: string } = {
	AAPL: '🍎',
	GOOGL: '🔍',
	MSFT: '🪟',
	TSLA: '⚡',
	AMZN: '📦',
	META: '👤',
	NVDA: '🎮',
	NFLX: '🎬',
	DIS: '🏰',
	AMD: '💻',
	INTC: '🔷',
	UBER: '🚗',
	COIN: '🪙',
	PYPL: '💳',
	SQ: '⬜',
};

const stockNames: { [key: string]: string } = {
	AAPL: 'Apple Inc.',
	GOOGL: 'Alphabet Inc.',
	MSFT: 'Microsoft Corporation',
	TSLA: 'Tesla Inc.',
	AMZN: 'Amazon.com Inc.',
	META: 'Meta Platforms Inc.',
	NVDA: 'NVIDIA Corporation',
	NFLX: 'Netflix Inc.',
	DIS: 'The Walt Disney Company',
	AMD: 'Advanced Micro Devices Inc.',
	INTC: 'Intel Corporation',
	UBER: 'Uber Technologies Inc.',
	COIN: 'Coinbase Global Inc.',
	PYPL: 'PayPal Holdings Inc.',
	SQ: 'Block Inc.',
};

interface AddStockDialogProps {
	userId: number;
}

export function AddStockDialog({ userId }: AddStockDialogProps) {
	const [open, setOpen] = useState(false);
	const [symbol, setSymbol] = useState('');
	const [shares, setShares] = useState('');
	const [avgPrice, setAvgPrice] = useState('');
	const [searchedSymbol, setSearchedSymbol] = useState('');

	const {
		data: quote,
		isLoading: isSearching,
		error: searchError,
	} = useStockQuote(searchedSymbol);

	const createHolding = useCreateStockHolding();

	const handleSearch = () => {
		const upperSymbol = symbol.toUpperCase().trim();
		if (upperSymbol) {
			setSearchedSymbol(upperSymbol);
		}
	};

	const handleAddStock = async () => {
		if (searchedSymbol && shares && avgPrice) {
			try {
				await createHolding.mutateAsync({
					userid: userId,
					symbol: searchedSymbol,
					companyname:
						stockNames[searchedSymbol] || `${searchedSymbol} Inc.`,
					shares: parseFloat(shares),
					averageprice: parseFloat(avgPrice),
					purchasedate: new Date().toISOString(),
				});

				// Reset form
				setSymbol('');
				setShares('');
				setAvgPrice('');
				setSearchedSymbol('');
				setOpen(false);
			} catch (error) {
				console.error('Error adding stock:', error);
			}
		}
	};

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const useCurrentPrice = () => {
		if (quote) {
			setAvgPrice(quote.price.toFixed(2));
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<TrendingUp className="h-4 w-4" />
					Add Stock
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add Stock to Portfolio</DialogTitle>
					<DialogDescription>
						Search for a stock symbol and add it to your portfolio.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Stock Symbol Search */}
					<div className="grid gap-2">
						<Label htmlFor="symbol">Stock Symbol</Label>
						<div className="flex gap-2">
							<Input
								id="symbol"
								placeholder="e.g., AAPL, GOOGL, MSFT"
								value={symbol}
								onChange={(e) =>
									setSymbol(e.target.value.toUpperCase())
								}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										handleSearch();
									}
								}}
								disabled={createHolding.isPending}
							/>
							<Button
								onClick={handleSearch}
								disabled={
									!symbol ||
									isSearching ||
									createHolding.isPending
								}
								variant="outline"
							>
								{isSearching ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Search className="h-4 w-4" />
								)}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Popular: AAPL, GOOGL, MSFT, TSLA, AMZN
						</p>
					</div>

					{/* Stock Preview */}
					{isSearching && (
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span className="text-sm">
										Searching...
									</span>
								</div>
							</CardContent>
						</Card>
					)}

					{searchError && (
						<Card className="border-destructive">
							<CardContent className="p-4">
								<p className="text-sm text-destructive">
									Stock not found or API limit reached. Please
									try again.
								</p>
							</CardContent>
						</Card>
					)}

					{quote && !isSearching && (
						<Card className="border-green-500">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="text-3xl">
											{stockLogos[searchedSymbol] || '📈'}
										</span>
										<div>
											<div className="font-semibold">
												{searchedSymbol}
											</div>
											<div className="text-xs text-muted-foreground">
												{stockNames[searchedSymbol] ||
													`${searchedSymbol} Inc.`}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-lg font-bold">
											{formatCurrency(quote.price)}
										</div>
										<Badge
											variant={
												quote.change >= 0
													? 'default'
													: 'destructive'
											}
											className="text-xs"
										>
											{quote.change >= 0 ? '+' : ''}
											{quote.changePercent.toFixed(2)}%
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Number of Shares */}
					<div className="grid gap-2">
						<Label htmlFor="shares">Number of Shares</Label>
						<Input
							id="shares"
							type="number"
							placeholder="e.g., 10"
							value={shares}
							onChange={(e) => setShares(e.target.value)}
							min="0"
							step="0.01"
							disabled={createHolding.isPending}
						/>
					</div>

					{/* Average Purchase Price */}
					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="avgPrice">
								Average Purchase Price
							</Label>
							{quote && (
								<Button
									variant="link"
									size="sm"
									onClick={useCurrentPrice}
									className="h-auto p-0 text-xs"
									disabled={createHolding.isPending}
								>
									Use current price
								</Button>
							)}
						</div>
						<Input
							id="avgPrice"
							type="number"
							placeholder="e.g., 150.25"
							value={avgPrice}
							onChange={(e) => setAvgPrice(e.target.value)}
							min="0"
							step="0.01"
							disabled={createHolding.isPending}
						/>
					</div>

					{/* Investment Summary */}
					{shares && avgPrice && (
						<Card className="bg-muted">
							<CardContent className="p-4">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">
											Total Investment
										</p>
										<p className="font-semibold">
											{formatCurrency(
												parseFloat(shares) *
													parseFloat(avgPrice)
											)}
										</p>
									</div>
									{quote && (
										<div>
											<p className="text-muted-foreground">
												Current Value
											</p>
											<p className="font-semibold">
												{formatCurrency(
													parseFloat(shares) *
														quote.price
												)}
											</p>
										</div>
									)}
								</div>
								{quote && (
									<div className="mt-3 pt-3 border-t">
										<div className="flex items-center justify-between">
											<span className="text-xs text-muted-foreground">
												Estimated Gain/Loss
											</span>
											<span
												className={`text-sm font-semibold ${
													parseFloat(shares) *
														quote.price -
														parseFloat(shares) *
															parseFloat(
																avgPrice
															) >=
													0
														? 'text-green-600'
														: 'text-red-600'
												}`}
											>
												{parseFloat(shares) *
													quote.price -
													parseFloat(shares) *
														parseFloat(avgPrice) >=
												0
													? '+'
													: ''}
												{formatCurrency(
													parseFloat(shares) *
														quote.price -
														parseFloat(shares) *
															parseFloat(avgPrice)
												)}
											</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							setOpen(false);
							setSymbol('');
							setShares('');
							setAvgPrice('');
							setSearchedSymbol('');
						}}
						disabled={createHolding.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleAddStock}
						disabled={
							!searchedSymbol ||
							!shares ||
							!avgPrice ||
							createHolding.isPending
						}
					>
						{createHolding.isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Adding...
							</>
						) : (
							'Add to Portfolio'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
