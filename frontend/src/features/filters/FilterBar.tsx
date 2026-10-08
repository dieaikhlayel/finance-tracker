import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    setSearch,
    setType,
    setCategoryId,
    setFrom,
    setTo,
    setSort,
    resetFilters,
    type SortOption,
} from './filterSlice';
import { applyFiltersAndFetch } from '../transactions/transactionSlice';
import type { TransactionType } from '../../types';

export function FilterBar() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((s) => s.filters);
    const categories = useAppSelector((s) => s.categories.items);

    // Local mirror of the search box, debounced before it hits Redux.
    const [searchInput, setSearchInput] = useState(filters.search);

    // Debounce search changes by 300ms.
    useEffect(() => {
        if (searchInput === filters.search) return;
        const handle = window.setTimeout(() => {
            dispatch(setSearch(searchInput));
            dispatch(applyFiltersAndFetch());
        }, 300);
        return () => window.clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    // Non-debounced filters (dropdowns, dates) fire immediately.
    function applyNow(action: () => void) {
        action();
        dispatch(applyFiltersAndFetch());
    }

    const categoriesForType = categories.filter(
        (c) => !filters.type || c.type === filters.type,
    );

    const hasActiveFilters =
        filters.search !== '' ||
        filters.type !== '' ||
        filters.categoryId !== '' ||
        filters.from !== '' ||
        filters.to !== '' ||
        filters.sort !== 'date_desc';

    function handleReset() {
        setSearchInput('');
        dispatch(resetFilters());
        dispatch(applyFiltersAndFetch());
    }

    return (
        <div className="filter-bar">
            <div className="filter-row">
                <div className="form-field filter-search">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search description…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="filter-type">Type</label>
                    <select
                        id="filter-type"
                        value={filters.type}
                        onChange={(e) =>
                            applyNow(() => dispatch(setType(e.target.value as TransactionType | '')))
                        }
                    >
                        <option value="">All</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="filter-category">Category</label>
                    <select
                        id="filter-category"
                        value={filters.categoryId === '' ? '' : String(filters.categoryId)}
                        onChange={(e) => {
                            const raw = e.target.value;
                            applyNow(() => dispatch(setCategoryId(raw === '' ? '' : Number(raw))));
                        }}
                    >
                        <option value="">All</option>
                        {categoriesForType.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="filter-sort">Sort</label>
                    <select
                        id="filter-sort"
                        value={filters.sort}
                        onChange={(e) => applyNow(() => dispatch(setSort(e.target.value as SortOption)))}
                    >
                        <option value="date_desc">Newest first</option>
                        <option value="date_asc">Oldest first</option>
                        <option value="amount_desc">Largest amount</option>
                        <option value="amount_asc">Smallest amount</option>
                    </select>
                </div>
            </div>

            <div className="filter-row">
                <div className="form-field">
                    <label htmlFor="filter-from">From</label>
                    <input
                        id="filter-from"
                        type="date"
                        value={filters.from}
                        onChange={(e) => applyNow(() => dispatch(setFrom(e.target.value)))}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="filter-to">To</label>
                    <input
                        id="filter-to"
                        type="date"
                        value={filters.to}
                        onChange={(e) => applyNow(() => dispatch(setTo(e.target.value)))}
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn-secondary filter-clear"
                        onClick={handleReset}
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}