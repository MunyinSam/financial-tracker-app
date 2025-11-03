import { useQuery } from '@tanstack/react-query';
import { stocksApi } from './stocks.service';

export const stockKeys = {
	quote: (symbol: string) => ['stock', 'quote', symbol] as const,
};

export const useStockQuote = (symbol: string) => {
	return useQuery({
		queryKey: stockKeys.quote(symbol),
		queryFn: () => stocksApi.getQuote(symbol),
		refetchInterval: 60000, // Refetch every minute
		enabled: !!symbol,
		staleTime: 30000,
	});
};
