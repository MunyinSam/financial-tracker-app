'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	PieChart,
	Search,
	Filter,
	MoreVertical,
	Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddStockDialog } from '@/src/components/dashboard/stocks/add-stock-dialog';
import { StockActionsMenu } from '@/src/components/dashboard/stocks/stock-actions-menu';
import { useUserStockHoldings } from '@/src/services/stockHoldings.hooks';

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
};

const getStockLogo = (symbol: string): string => {
	const logos: { [key: string]: string } = {
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
	return logos[symbol] || '📈';
};

export default function StocksPage() {
	const userId = 1; // TODO: Get from auth context
	const {
		data: holdings = [],
		isLoading,
		error,
	} = useUserStockHoldings(userId);

	// Enhance holdings with logos
	const enrichedHoldings = holdings.map((holding: any) => ({
		...holding,
		id: holding.stockid,
		symbol: holding.symbol,
		name: holding.companyname,
		shares: holding.shares,
		avgPrice: holding.averageprice,
		logo: getStockLogo(holding.symbol),
	}));

	// Calculate portfolio summary
	const portfolioSummary = enrichedHoldings.reduce(
		(acc, stock) => {
			const currentPrice = stock.avgPrice; // TODO: Fetch real-time prices
			const totalValue = stock.shares * currentPrice;
			const totalCost = stock.shares * stock.avgPrice;
			const gainLoss = totalValue - totalCost;

			return {
				totalValue: acc.totalValue + totalValue,
				totalInvested: acc.totalInvested + totalCost,
				totalGainLoss: acc.totalGainLoss + gainLoss,
			};
		},
		{ totalValue: 0, totalInvested: 0, totalGainLoss: 0 }
	);

	const totalGainLossPercent =
		portfolioSummary.totalInvested > 0
			? (portfolioSummary.totalGainLoss /
					portfolioSummary.totalInvested) *
			  100
			: 0;

	if (error) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="text-red-500">
					Failed to load stocks:{' '}
					{error instanceof Error ? error.message : 'Unknown error'}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-full overflow-x-hidden">
			{/* Header with Actions */}
			<div className="flex items-center justify-between mb-2 mt-4">
				<div>
					<h1 className="text-2xl font-bold">Stock Portfolio</h1>
					<p className="text-sm text-muted-foreground">
						Track and manage your investments
					</p>
				</div>
				<AddStockDialog userId={userId} />
			</div>

			{/* Compact Portfolio Summary */}
			<div className="grid gap-3 md:grid-cols-4">
				<Card className="border-l-4 border-l-green-500">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">
									Total Value
								</p>
								{isLoading ? (
									<Skeleton className="h-7 w-32 mt-1" />
								) : (
									<p className="text-xl font-bold text-green-600">
										{formatCurrency(
											portfolioSummary.totalValue
										)}
									</p>
								)}
							</div>
							<DollarSign className="h-8 w-8 text-green-500 opacity-20" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">
									Invested
								</p>
								{isLoading ? (
									<Skeleton className="h-7 w-32 mt-1" />
								) : (
									<p className="text-xl font-bold">
										{formatCurrency(
											portfolioSummary.totalInvested
										)}
									</p>
								)}
							</div>
							<PieChart className="h-8 w-8 text-muted-foreground opacity-20" />
						</div>
					</CardContent>
				</Card>

				<Card
					className={`border-l-4 ${
						portfolioSummary.totalGainLoss >= 0
							? 'border-l-green-500'
							: 'border-l-red-500'
					}`}
				>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">
									Gain/Loss
								</p>
								{isLoading ? (
									<Skeleton className="h-7 w-32 mt-1" />
								) : (
									<>
										<p
											className={`text-xl font-bold ${
												portfolioSummary.totalGainLoss >=
												0
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{portfolioSummary.totalGainLoss >= 0
												? '+'
												: ''}
											{formatCurrency(
												portfolioSummary.totalGainLoss
											)}
										</p>
										<p
											className={`text-xs ${
												portfolioSummary.totalGainLoss >=
												0
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{totalGainLossPercent >= 0
												? '+'
												: ''}
											{totalGainLossPercent.toFixed(2)}%
										</p>
									</>
								)}
							</div>
							{portfolioSummary.totalGainLoss >= 0 ? (
								<TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
							) : (
								<TrendingDown className="h-8 w-8 text-red-500 opacity-20" />
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">
									Positions
								</p>
								{isLoading ? (
									<Skeleton className="h-7 w-16 mt-1" />
								) : (
									<p className="text-xl font-bold">
										{enrichedHoldings.length}
									</p>
								)}
							</div>
							<TrendingUp className="h-8 w-8 text-muted-foreground opacity-20" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filter */}
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search stocks..."
						className="pl-10 h-9"
					/>
				</div>
				<Button variant="outline" size="sm" className="gap-2">
					<Filter className="h-4 w-4" />
					Filter
				</Button>
			</div>

			{/* Professional Table View */}
			<Card>
				<CardHeader className="pb-3">
					<Tabs defaultValue="holdings" className="w-full">
						<TabsList className="h-9">
							<TabsTrigger value="holdings" className="text-xs">
								All Holdings
							</TabsTrigger>
							<TabsTrigger value="gainers" className="text-xs">
								Gainers
							</TabsTrigger>
							<TabsTrigger value="losers" className="text-xs">
								Losers
							</TabsTrigger>
						</TabsList>

						<TabsContent value="holdings" className="mt-4">
							{isLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
									<span className="ml-2 text-muted-foreground">
										Loading stock data...
									</span>
								</div>
							) : enrichedHoldings.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
									<TrendingUp className="h-12 w-12 mb-2 opacity-20" />
									<p>No stocks in your portfolio yet</p>
									<p className="text-sm">
										Click "Add Stock" to get started
									</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[200px]">
												Stock
											</TableHead>
											<TableHead className="text-right">
												Shares
											</TableHead>
											<TableHead className="text-right">
												Avg Price
											</TableHead>
											<TableHead className="text-right">
												Current
											</TableHead>
											<TableHead className="text-right">
												Value
											</TableHead>
											<TableHead className="text-right">
												Gain/Loss
											</TableHead>
											<TableHead className="w-[50px]"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{enrichedHoldings.map((stock: any) => {
											const currentPrice = stock.avgPrice; // TODO: Real-time price
											const totalValue =
												stock.shares * currentPrice;
											const totalCost =
												stock.shares * stock.avgPrice;
											const gainLoss =
												totalValue - totalCost;
											const gainLossPercent =
												(gainLoss / totalCost) * 100;

											return (
												<TableRow
													key={stock.id}
													className="hover:bg-muted/50 cursor-pointer"
												>
													<TableCell>
														<div className="flex items-center gap-3">
															<span className="text-2xl">
																{stock.logo}
															</span>
															<div>
																<div className="font-semibold">
																	{
																		stock.symbol
																	}
																</div>
																<div className="text-xs text-muted-foreground">
																	{stock.name}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell className="text-right">
														{stock.shares}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(
															stock.avgPrice
														)}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(
															currentPrice
														)}
													</TableCell>
													<TableCell className="text-right font-semibold">
														{formatCurrency(
															totalValue
														)}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex flex-col items-end">
															<span
																className={`font-semibold ${
																	gainLoss >=
																	0
																		? 'text-green-600'
																		: 'text-red-600'
																}`}
															>
																{gainLoss >= 0
																	? '+'
																	: ''}
																{formatCurrency(
																	gainLoss
																)}
															</span>
															<Badge
																variant={
																	gainLoss >=
																	0
																		? 'default'
																		: 'destructive'
																}
																className="text-xs"
															>
																{gainLoss >= 0
																	? '+'
																	: ''}
																{gainLossPercent.toFixed(
																	2
																)}
																%
															</Badge>
														</div>
													</TableCell>
													<TableCell>
														<StockActionsMenu
															stock={stock}
															userId={userId}
														/>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							)}
						</TabsContent>

						<TabsContent value="gainers" className="mt-4">
							<p className="text-center text-muted-foreground py-8">
								Coming soon...
							</p>
						</TabsContent>

						<TabsContent value="losers" className="mt-4">
							<p className="text-center text-muted-foreground py-8">
								Coming soon...
							</p>
						</TabsContent>
					</Tabs>
				</CardHeader>
			</Card>
		</div>
	);
}
