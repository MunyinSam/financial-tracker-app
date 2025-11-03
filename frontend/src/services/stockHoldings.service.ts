const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface StockHolding {
    stockid: number;
    userid: number;
    symbol: string;
    companyname: string;
    shares: number;
    averageprice: number;
    purchasedate?: string;
    notes?: string;
    createdat?: string;
    updatedat?: string;
}

export interface CreateStockHoldingRequest {
    userid: number;
    symbol: string;
    companyname: string;
    shares: number;
    averageprice: number;
    purchasedate?: string;
    notes?: string;
}

export interface UpdateStockHoldingRequest {
    userid: number;
    shares?: number;
    averageprice?: number;
    notes?: string;
}

export const stockHoldingsApi = {
    // Create a new stock holding
    async create(data: CreateStockHoldingRequest): Promise<StockHolding> {
        const response = await fetch(`${API_URL}/api/stocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create stock holding');
        }

        const result = await response.json();
        return result.data;
    },

    // Get all holdings for a user
    async getUserHoldings(userId: number): Promise<StockHolding[]> {
        const response = await fetch(`${API_URL}/api/stocks/user/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch stock holdings');
        }

        const result = await response.json();
        return result.data;
    },

    // Get a specific holding
    async getHoldingById(stockId: number, userId: number): Promise<StockHolding> {
        const response = await fetch(
            `${API_URL}/api/stocks/${stockId}?userId=${userId}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch stock holding');
        }

        const result = await response.json();
        return result.data;
    },

    // Update a holding
    async update(
        stockId: number,
        data: UpdateStockHoldingRequest
    ): Promise<StockHolding> {
        const response = await fetch(`${API_URL}/api/stocks/${stockId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update stock holding');
        }

        const result = await response.json();
        return result.data;
    },

    // Delete a holding
    async delete(stockId: number, userId: number): Promise<void> {
        const response = await fetch(`${API_URL}/api/stocks/${stockId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete stock holding');
        }
    },
};