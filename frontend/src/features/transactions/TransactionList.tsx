import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types';

interface TransactionListProps {
    items: Transaction[];
    onDelete: (id: number) => void;
}

export function TransactionList({ items, onDelete }: TransactionListProps) {
    if (items.length === 0) {
        return (
            <div className="empty-state">
                <p>No transactions yet.</p>
            </div>
        );
    }

    return (
        <table className="tx-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="align-right">Amount</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {items.map((t) => (
                    <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    );
}