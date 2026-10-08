import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Transaction } from '../../types';

interface TransactionRowProps {
    transaction: Transaction;
    onDelete: (id: number) => void;
    deleteDisabled: boolean;
}

export function TransactionRow({ transaction, onDelete, deleteDisabled }: TransactionRowProps) {
    const { id, type, amount, categoryName, description, date } = transaction;
    const isIncome = type === 'INCOME';

    function handleDelete() {
        if (window.confirm('Delete this transaction?')) {
            onDelete(id);
        }
    }

    return (
        <tr className="tx-row">
            <td className="tx-date">{formatDate(date)}</td>
            <td className="tx-category">
                <span className={`badge badge-${isIncome ? 'income' : 'expense'}`}>
                    {categoryName}
                </span>
            </td>
            <td className="tx-description">{description || <em>—</em>}</td>
            <td className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                {isIncome ? '+' : '−'}
                {formatCurrency(amount)}
            </td>
            <td className="tx-actions">
                <Link to={`/transactions/${id}/edit`} className="btn-link">
                    Edit
                </Link>
                <button
                    type="button"
                    className="btn-link danger"
                    onClick={handleDelete}
                    disabled={deleteDisabled}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
