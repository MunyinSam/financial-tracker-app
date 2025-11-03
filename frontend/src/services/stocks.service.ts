const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const API_BASE = 'https://www.alphavantage.co/query';

export interface StockQuote {
	symbol: string;
	price: number;
	change: number;
	changePercent: number;
	high: number;
	low: number;
	open: number;
	previousClose: number;
	volume: number;
}

export interface StockHolding {
	id: number;
	symbol: string;
	name: string;
	shares: number;
	avgPrice: number;
	logo?: string;
}

export const stocksApi = {
	async getQuote(symbol: string): Promise<StockQuote> {
		const url = `${API_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch stock quote');

		const data = await response.json();

		if (data['Error Message'] || data['Note']) {
			throw new Error('API rate limit exceeded or invalid symbol');
		}

		const quote = data['Global Quote'];

		if (!quote || Object.keys(quote).length === 0) {
			throw new Error('No data available for this symbol');
		}

		return {
			symbol: quote['01. symbol'],
			price: parseFloat(quote['05. price']),
			change: parseFloat(quote['09. change']),
			changePercent: parseFloat(
				quote['10. change percent'].replace('%', '')
			),
			high: parseFloat(quote['03. high']),
			low: parseFloat(quote['04. low']),
			open: parseFloat(quote['02. open']),
			previousClose: parseFloat(quote['08. previous close']),
			volume: parseInt(quote['06. volume']),
		};
	},

	async getMultipleQuotes(
		symbols: string[]
	): Promise<Map<string, StockQuote>> {
		const quotes = new Map<string, StockQuote>();

		// Alpha Vantage free tier: 5 requests per minute, 25 per day
		// Add delay between requests to avoid rate limiting
		for (const symbol of symbols) {
			try {
				const quote = await this.getQuote(symbol);
				quotes.set(symbol, quote);
				// Wait 12 seconds between requests (5 per minute limit)
				if (symbols.indexOf(symbol) < symbols.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, 12000));
				}
			} catch (error) {
				console.error(`Failed to fetch quote for ${symbol}:`, error);
			}
		}

		return quotes;
	},

	// For demo purposes, get a few popular stocks
	async getPopularStocks(): Promise<StockQuote[]> {
		const symbols = ['AAPL', 'GOOGL', 'MSFT'];
		const quotes: StockQuote[] = [];

		for (const symbol of symbols) {
			try {
				const quote = await this.getQuote(symbol);
				quotes.push(quote);
				// Wait between requests
				if (symbols.indexOf(symbol) < symbols.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, 12000));
				}
			} catch (error) {
				console.error(`Failed to fetch ${symbol}:`, error);
			}
		}

		return quotes;
	},
};
