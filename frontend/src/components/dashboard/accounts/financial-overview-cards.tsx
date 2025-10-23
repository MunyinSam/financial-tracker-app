'use client';

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancialOverviewCardsProps {
    totalBalance: number;
    totalIncome: number;
    totalSpending: number;
    avgIncome: number;
    avgSpending: number;
    accountCount: number;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
    }).format(amount);
};

export function FinancialOverviewCards({
    totalBalance,
    totalIncome,
    totalSpending,
    avgIncome,
    avgSpending,
    accountCount,
}: FinancialOverviewCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Balance */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Total Balance
                    </h3>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalBalance)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Across {accountCount} accounts
                </p>
            </div>

            {/* Total Income */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Total Income (6 months)
                    </h3>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Avg: {formatCurrency(avgIncome)}/month
                </p>
            </div>

            {/* Total Spending */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Total Spending (6 months)
                    </h3>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-red-600">
                    {formatCurrency(totalSpending)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Avg: {formatCurrency(avgSpending)}/month
                </p>
            </div>
        </div>
    );
}