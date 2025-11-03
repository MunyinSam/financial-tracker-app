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
};
