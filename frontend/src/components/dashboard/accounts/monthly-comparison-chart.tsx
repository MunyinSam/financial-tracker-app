'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface MonthlyData {
    month: string;
    income: number;
    spending: number;
}

interface MonthlyComparisonChartProps {
    data: MonthlyData[];
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
    }).format(amount);
};

const formatShortCurrency = (value: number): string => {
    if (value >= 1000) {
        return `฿${(value / 1000).toFixed(0)}k`;
    }
    return `฿${value}`;
};

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
    return (
        <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Monthly Comparison</h3>
                <p className="text-sm text-muted-foreground">
                    Income and spending by month
                </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatShortCurrency}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="income"
                        fill="#10b981"
                        name="Income"
                        radius={[8, 8, 0, 0]}
                    />
                    <Bar
                        dataKey="spending"
                        fill="#ef4444"
                        name="Spending"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}