import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    fetchTransactions,
    deleteTransaction,
} from './transactionSlice';
import { TransactionList } from './TransactionList';

export function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { items, page, totalPages, total, listStatus, listError } = useAppSelector(
        (s) => s.transactions,
    );

    // Phase 12 will replace this with filtered params from filterSlice
    useEffect(() => {
        dispatch(fetchTransactions({ page: 1, limit: 20 }));
    }, [dispatch]);

    function handleDelete(id: number) {
        dispatch(deleteTransaction(id));
    }

    function gotoPage(nextPage: number) {
        dispatch(fetchTransactions({ page: nextPage, limit: 20 }));
    }

    return (
        <div>
            <div className="page-header">
                <h1>Transactions</h1>
                <Link to="/transactions/new" className="btn-primary">
                    + New transaction
                </Link>
            </div>

            {listStatus === 'loading' && <p className="page-loading">Loading…</p>}

            {listStatus === 'failed' && (
                <div className="form-error">{listError}</div>
            )}

            {listStatus === 'succeeded' && (
                <>
                    <TransactionList items={items} onDelete={handleDelete} />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        onChange={gotoPage}
                    />
                </>
            )}
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    total,
    onChange,
}: {
    page: number;
    totalPages: number;
    total: number;
    onChange: (p: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                className="btn-secondary"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
            >
                ← Previous
            </button>
            <span className="pagination-info">
                Page {page} of {totalPages} · {total} total
            </span>
            <button
                className="btn-secondary"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next →
            </button>
        </div>
    );
}