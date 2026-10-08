// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import {
//     fetchTransactions,
//     deleteTransaction,
// } from './transactionSlice';
// import { TransactionList } from './TransactionList';
// import type { RootState } from '../../app/store';

// export function TransactionsPage() {
//     const dispatch = useAppDispatch();
//     const { items, page, totalPages, total, listStatus, listError } = useAppSelector(
//         (s) => s.transactions,
//     );

//     // Phase 12 will replace this with filtered params from filterSlice
//     useEffect(() => {
//         dispatch(fetchTransactions({ page: 1, limit: 20 }));
//     }, [dispatch]);

//     function handleDelete(id: number) {
//         dispatch(deleteTransaction(id));
//     }

//     function gotoPage(nextPage: number) {
//         dispatch(fetchTransactions({ page: nextPage, limit: 20 }));
//     }

//     return (
//         <div>
//             <div className="page-header">
//                 <h1>Transactions</h1>
//                 <Link to="/transactions/new" className="btn-primary">
//                     + New transaction
//                 </Link>
//             </div>

//             {listStatus === 'loading' && <p className="page-loading">Loading…</p>}

//             {listStatus === 'failed' && (
//                 <div className="form-error">{listError}</div>
//             )}

//             {listStatus === 'succeeded' && (
//                 <>
//                     <TransactionList items={items} onDelete={handleDelete} />
//                     <Pagination
//                         page={page}
//                         totalPages={totalPages}
//                         total={total}
//                         onChange={gotoPage}
//                     />
//                 </>
//             )}
//         </div>
//     );
// }



// function Pagination({
//     page,
//     totalPages,
//     total,
//     onChange,
// }: {
//     page: number;
//     totalPages: number;
//     total: number;
//     onChange: (p: number) => void;
// }) {
//     if (totalPages <= 1) return null;

//     return (
//         <div className="pagination">
//             <button
//                 className="btn-secondary"
//                 onClick={() => onChange(page - 1)}
//                 disabled={page <= 1}
//             >
//                 ← Previous
//             </button>
//             <span className="pagination-info">
//                 Page {page} of {totalPages} · {total} total
//             </span>
//             <button
//                 className="btn-secondary"
//                 onClick={() => onChange(page + 1)}
//                 disabled={page >= totalPages}
//             >
//                 Next →
//             </button>
//         </div>
//     );
// }

// export const applyFiltersAndFetch = createAsyncThunk(
//     'transactions/applyFiltersAndFetch',
//     async (_: void, { getState, rejectWithValue }) => {
//         const { filters } = getState() as RootState;

//         // Strip empty filter values so the backend never sees them
//         const params: TransactionListParams = {
//             page: filters.page,
//             limit: filters.limit,
//             sort: filters.sort,
//         };
//         if (filters.search) params.search = filters.search;
//         if (filters.type) params.type = filters.type;
//         if (filters.categoryId !== '') params.categoryId = filters.categoryId;
//         if (filters.from) params.from = filters.from;
//         if (filters.to) params.to = filters.to;

//         try {
//             return await txApi.list(params);
//         } catch (err) {
//             return rejectWithValue(extractErrorMessage(err));
//         }
//     },
// );


import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteTransaction, applyFiltersAndFetch } from './transactionSlice';
import { setPage } from '../filters/filterSlice';
import { TransactionList } from './TransactionList';
import { FilterBar } from '../filters/FilterBar';

export function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { items, total, listStatus, listError, mutationStatus } = useAppSelector((s) => s.transactions);
    const filters = useAppSelector((s) => s.filters);
    const { page, limit } = filters;
    const totalPages = Math.ceil(total / limit) || 0;
    const hasActiveFilters =
        filters.search !== '' ||
        filters.type !== '' ||
        filters.categoryId !== '' ||
        filters.from !== '' ||
        filters.to !== '' ||
        filters.sort !== 'date_desc';

    // Fetch on mount, and whenever the filters/pagination are already set
    // (e.g. user navigates back to this page).
    useEffect(() => {
        dispatch(applyFiltersAndFetch());
    }, [dispatch]);

    function handleDelete(id: number) {
        dispatch(deleteTransaction(id));
    }

    function gotoPage(nextPage: number) {
        dispatch(setPage(nextPage));
        dispatch(applyFiltersAndFetch());
    }

    return (
        <div>
            <div className="page-header">
                <h1>Transactions</h1>
                <Link to="/transactions/new" className="btn-primary">
                    + New transaction
                </Link>
            </div>

            <FilterBar />

            {listStatus === 'loading' && <p className="page-loading">Loading…</p>}

            {listStatus === 'failed' && <div className="form-error">{listError}</div>}

            {listStatus === 'succeeded' && (
                <>
                    <TransactionList
                        items={items}
                        onDelete={handleDelete}
                        hasActiveFilters={hasActiveFilters}
                        deleteDisabled={mutationStatus === 'loading'}
                    />
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
