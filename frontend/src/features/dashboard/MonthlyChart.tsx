import { formatCurrency, formatMonth } from '../../utils/format';
import type { MonthlyItem } from '../../types';

interface MonthlyChartProps {
    data: MonthlyItem[];
    loading: boolean;
    error: string | null;
}

export function MonthlyChart({ data, loading, error }: MonthlyChartProps) {
    if (loading) return <p className="muted">Loading…</p>;
    if (error) return <div className="form-error">{error}</div>;
    if (data.length === 0) return <p className="muted">No monthly data yet.</p>;

    const max = data.reduce(
        (m, item) => Math.max(m, Number(item.income), Number(item.expense)),
        0,
    );

    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header">
                <h2>Monthly income vs expenses</h2>
            </div>

            <div className="monthly-chart">
                {data.map((item) => {
                    const incomeHeight = max === 0 ? 0 : (Number(item.income) / max) * 100;
                    const expenseHeight = max === 0 ? 0 : (Number(item.expense) / max) * 100;
                    return (
                        <div key={item.month} className="monthly-group">
                            <div className="monthly-bars">
                                <div
                                    className="monthly-bar income"
                                    style={{ height: `${incomeHeight}%` }}
                                    title={`Income: ${formatCurrency(item.income)}`}
                                />
                                <div
                                    className="monthly-bar expense"
                                    style={{ height: `${expenseHeight}%` }}
                                    title={`Expenses: ${formatCurrency(item.expense)}`}
                                />
                            </div>
                            <div className="monthly-label">{formatMonth(item.month)}</div>
                        </div>
                    );
                })}
            </div>

            <div className="chart-legend">
                <span className="legend-item">
                    <span className="legend-swatch income" /> Income
                </span>
                <span className="legend-item">
                    <span className="legend-swatch expense" /> Expenses
                </span>
            </div>
        </div>
    );
}