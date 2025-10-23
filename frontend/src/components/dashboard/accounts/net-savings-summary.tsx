'use client';

interface NetSavingsSummaryProps {
    netSavings: number;
    totalIncome: number;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
    }).format(amount);
};

export function NetSavingsSummary({
    netSavings,
    totalIncome,
}: NetSavingsSummaryProps) {
    const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-1">
                        Net Savings (6 months)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Total income minus total spending
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-bold text-blue-600">
                        {formatCurrency(netSavings)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {savingsRate}% savings rate
                    </p>
                </div>
            </div>
        </div>
    );
}