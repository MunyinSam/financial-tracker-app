'use client';

import {
	LineChart,
	Line,
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

interface IncomeSpendingChartProps {
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

export function IncomeSpendingChart({ data }: IncomeSpendingChartProps) {
	return (
		<div className="bg-card rounded-xl shadow-sm border p-6">
			<div className="mb-4">
				<h3 className="text-lg font-semibold">
					Income vs Spending Trend
				</h3>
				<p className="text-sm text-muted-foreground">
					Last 6 months overview
				</p>
			</div>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data}>
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
					<Line
						type="monotone"
						dataKey="income"
						stroke="#10b981"
						strokeWidth={2}
						name="Income"
						dot={{ fill: '#10b981', r: 4 }}
					/>
					<Line
						type="monotone"
						dataKey="spending"
						stroke="#ef4444"
						strokeWidth={2}
						name="Spending"
						dot={{ fill: '#ef4444', r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
