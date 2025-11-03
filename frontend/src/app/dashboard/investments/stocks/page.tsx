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
	Plus,
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
import { useStockHoldings } from '@/src/services/stocks.hooks';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
};

export default function StocksPage() {
	const { data: holdings = [], isLoading, error } = useStockHoldings();

	// Calculate portfolio summary
	const portfolioSummary = holdings.reduce(
		(acc, stock) => ({
			totalValue: acc.totalValue + (stock?.totalValue || 0),
			totalInvested:
				acc.totalInvested +
				(stock?.shares || 0) * (stock?.avgPrice || 0),
			totalGainLoss: acc.totalGainLoss + (stock?.gainLoss || 0),
		}),
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
					<p className="text-sm text-muted-foreground mt-2">
						Note: Free API has 5 requests/minute limit. Please wait
						and refresh.
					</p>
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
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Stock
				</Button>
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
										{holdings.length}
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
										Loading stock data... (This may take a
										moment)
									</span>
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
										{holdings.map((stock: any) => (
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
																{stock.symbol}
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
														stock.currentPrice
													)}
												</TableCell>
												<TableCell className="text-right font-semibold">
													{formatCurrency(
														stock.totalValue
													)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex flex-col items-end">
														<span
															className={`font-semibold ${
																stock.gainLoss >=
																0
																	? 'text-green-600'
																	: 'text-red-600'
															}`}
														>
															{stock.gainLoss >= 0
																? '+'
																: ''}
															{formatCurrency(
																stock.gainLoss
															)}
														</span>
														<Badge
															variant={
																stock.gainLoss >=
																0
																	? 'default'
																	: 'destructive'
															}
															className="text-xs"
														>
															{stock.gainLoss >= 0
																? '+'
																: ''}
															{stock.gainLossPercent.toFixed(
																2
															)}
															%
														</Badge>
													</div>
												</TableCell>
												<TableCell>
													<Button
														variant="ghost"
														size="sm"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</TabsContent>

						<TabsContent value="gainers" className="mt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Stock</TableHead>
										<TableHead className="text-right">
											Current Price
										</TableHead>
										<TableHead className="text-right">
											Gain
										</TableHead>
										<TableHead className="text-right">
											%
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{holdings
										.filter(
											(stock: any) => stock.gainLoss > 0
										)
										.sort(
											(a: any, b: any) =>
												b.gainLossPercent -
												a.gainLossPercent
										)
										.map((stock: any) => (
											<TableRow key={stock.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<span className="text-2xl">
															{stock.logo}
														</span>
														<div>
															<div className="font-semibold">
																{stock.symbol}
															</div>
															<div className="text-xs text-muted-foreground">
																{stock.name}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-right">
													{formatCurrency(
														stock.currentPrice
													)}
												</TableCell>
												<TableCell className="text-right text-green-600 font-semibold">
													+
													{formatCurrency(
														stock.gainLoss
													)}
												</TableCell>
												<TableCell className="text-right">
													<Badge variant="default">
														+
														{stock.gainLossPercent.toFixed(
															2
														)}
														%
													</Badge>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TabsContent>

						<TabsContent value="losers" className="mt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Stock</TableHead>
										<TableHead className="text-right">
											Current Price
										</TableHead>
										<TableHead className="text-right">
											Loss
										</TableHead>
										<TableHead className="text-right">
											%
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{holdings
										.filter(
											(stock: any) => stock.gainLoss < 0
										)
										.sort(
											(a: any, b: any) =>
												a.gainLossPercent -
												b.gainLossPercent
										)
										.map((stock: any) => (
											<TableRow key={stock.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<span className="text-2xl">
															{stock.logo}
														</span>
														<div>
															<div className="font-semibold">
																{stock.symbol}
															</div>
															<div className="text-xs text-muted-foreground">
																{stock.name}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-right">
													{formatCurrency(
														stock.currentPrice
													)}
												</TableCell>
												<TableCell className="text-right text-red-600 font-semibold">
													{formatCurrency(
														stock.gainLoss
													)}
												</TableCell>
												<TableCell className="text-right">
													<Badge variant="destructive">
														{stock.gainLossPercent.toFixed(
															2
														)}
														%
													</Badge>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TabsContent>
					</Tabs>
				</CardHeader>
			</Card>
		</div>
	);
}
