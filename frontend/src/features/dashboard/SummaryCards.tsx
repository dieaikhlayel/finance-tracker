import { formatCurrency } from '../../utils/format';
import type { StatsSummary } from '../../types';

interface SummaryCardsProps {
    summary: StatsSummary | null;
    loading: boolean;
}

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
    if (loading || !summary) {
        return (
            <div className="summary-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="summary-card skeleton" />
                ))}
            </div>
        );
    }

    const { totalIncome, totalExpense, balance, transactionCount } = summary;
    const balanceNumber = Number(balance);
    const balancePositive = balanceNumber >= 0;

    return (
        <div className="summary-grid">
            <div className="summary-card">
                <div className="summary-label">Income</div>
                <div className="summary-value income">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="summary-card">
                <div className="summary-label">Expenses</div>
                <div className="summary-value expense">{formatCurrency(totalExpense)}</div>
            </div>
            <div className="summary-card">
                <div className="summary-label">Balance</div>
                <div className={`summary-value ${balancePositive ? 'income' : 'expense'}`}>
                    {formatCurrency(balance)}
                </div>
            </div>
            <div className="summary-card">
                <div className="summary-label">Transactions</div>
                <div className="summary-value">{transactionCount}</div>
            </div>
        </div>
    );
}