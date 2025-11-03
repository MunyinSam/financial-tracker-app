import { useQuery } from '@tanstack/react-query';
import { stocksApi, StockHolding } from './stocks.service';

export const stockKeys = {
	quote: (symbol: string) => ['stock', 'quote', symbol] as const,
	quotes: (symbols: string[]) => ['stock', 'quotes', symbols] as const,
	popular: () => ['stock', 'popular'] as const,
	holdings: () => ['stock', 'holdings'] as const,
};

// Mock holdings - in real app, this would come from your backend
const mockHoldings: StockHolding[] = [
	{
		id: 1,
		symbol: 'AAPL',
		name: 'Apple Inc.',
		shares: 50,
		avgPrice: 150.25,
		logo: '🍎',
	},
	{
		id: 2,
		symbol: 'GOOGL',
		name: 'Alphabet Inc.',
		shares: 30,
		avgPrice: 120.0,
		logo: '🔍',
	},
	{
		id: 3,
		symbol: 'MSFT',
		name: 'Microsoft Corporation',
		shares: 40,
		avgPrice: 310.0,
		logo: '🪟',
	},
];

export const useStockQuote = (symbol: string) => {
	return useQuery({
		queryKey: stockKeys.quote(symbol),
		queryFn: () => stocksApi.getQuote(symbol),
		refetchInterval: 60000, // Refetch every minute
		enabled: !!symbol,
		staleTime: 30000, // Consider data stale after 30 seconds
	});
};

export const useStockHoldings = () => {
	return useQuery({
		queryKey: stockKeys.holdings(),
		queryFn: async () => {
			const symbols = mockHoldings.map((h) => h.symbol);
			const quotes = await stocksApi.getMultipleQuotes(symbols);

			return mockHoldings
				.map((holding) => {
					const quote = quotes.get(holding.symbol);
					if (!quote) return null;

					const currentPrice = quote.price;
					const totalValue = holding.shares * currentPrice;
					const totalCost = holding.shares * holding.avgPrice;
					const gainLoss = totalValue - totalCost;
					const gainLossPercent = (gainLoss / totalCost) * 100;

					return {
						...holding,
						currentPrice,
						totalValue,
						gainLoss,
						gainLossPercent,
						quote,
					};
				})
				.filter(Boolean);
		},
		refetchInterval: 60000,
		staleTime: 30000,
	});
};

export const usePopularStocks = () => {
	return useQuery({
		queryKey: stockKeys.popular(),
		queryFn: () => stocksApi.getPopularStocks(),
		refetchInterval: 60000,
		staleTime: 30000,
	});
};
