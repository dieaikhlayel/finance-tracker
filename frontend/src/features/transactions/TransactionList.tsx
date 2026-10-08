import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types';

interface TransactionListProps {
    items: Transaction[];
    onDelete: (id: number) => void;
    hasActiveFilters: boolean;
    deleteDisabled: boolean;
}

export function TransactionList({
    items,
    onDelete,
    hasActiveFilters,
    deleteDisabled,
}: TransactionListProps) {
    if (items.length === 0) {
        return (
            <div className="empty-state">
                <p>{hasActiveFilters ? 'No transactions match your filters.' : 'No transactions yet.'}</p>
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
                    <TransactionRow
                        key={t.id}
                        transaction={t}
                        onDelete={onDelete}
                        deleteDisabled={deleteDisabled}
                    />
                ))}
            </tbody>
        </table>
    );
}
