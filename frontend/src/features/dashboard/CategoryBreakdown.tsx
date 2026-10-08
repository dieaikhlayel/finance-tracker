import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchByCategory, setByCategoryType } from '../stats/statsSlice';
import { formatCurrency } from '../../utils/format';
import type { TransactionType } from '../../types';

export function CategoryBreakdown() {
    const dispatch = useAppDispatch();
    const { byCategory, byCategoryType, byCategoryStatus, byCategoryError } = useAppSelector(
        (s) => s.stats,
    );

    function switchType(next: TransactionType) {
        if (next === byCategoryType) return;
        dispatch(setByCategoryType(next));
        dispatch(fetchByCategory(next));
    }

    const max = byCategory.reduce((m, item) => Math.max(m, Number(item.total)), 0);

    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header">
                <h2>By category</h2>
                <div className="type-toggle">
                    <button
                        type="button"
                        className={byCategoryType === 'EXPENSE' ? 'active' : ''}
                        onClick={() => switchType('EXPENSE')}
                    >
                        Expenses
                    </button>
                    <button
                        type="button"
                        className={byCategoryType === 'INCOME' ? 'active' : ''}
                        onClick={() => switchType('INCOME')}
                    >
                        Income
                    </button>
                </div>
            </div>

            {byCategoryStatus === 'loading' && <p className="muted">Loading…</p>}
            {byCategoryStatus === 'failed' && <div className="form-error">{byCategoryError}</div>}

            {byCategoryStatus === 'succeeded' && byCategory.length === 0 && (
                <p className="muted">No {byCategoryType.toLowerCase()} recorded yet.</p>
            )}

            {byCategoryStatus === 'succeeded' && byCategory.length > 0 && (
                <ul className="breakdown-list">
                    {byCategory.map((item) => {
                        const percent = max === 0 ? 0 : (Number(item.total) / max) * 100;
                        return (
                            <li key={item.categoryId} className="breakdown-item">
                                <div className="breakdown-row">
                                    <span className="breakdown-name">{item.categoryName}</span>
                                    <span className="breakdown-total">
                                        {formatCurrency(item.total)}
                                        <span className="breakdown-count"> · {item.count}</span>
                                    </span>
                                </div>
                                <div className="breakdown-bar">
                                    <div
                                        className={`breakdown-bar-fill ${byCategoryType === 'INCOME' ? 'income' : 'expense'}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}