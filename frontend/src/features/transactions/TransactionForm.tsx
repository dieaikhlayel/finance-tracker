import { useState, useEffect, type FormEvent } from 'react';
import { useAppSelector } from '../../app/hooks';
import type { Transaction, TransactionPayload, TransactionType } from '../../types';

interface TransactionFormProps {
    initial?: Transaction;
    submitLabel: string;
    submitting: boolean;
    error: string | null;
    onSubmit: (payload: TransactionPayload) => void;
    onCancel: () => void;
}

export function TransactionForm({
    initial,
    submitLabel,
    submitting,
    error,
    onSubmit,
    onCancel,
}: TransactionFormProps) {
    const categories = useAppSelector((s) => s.categories.items);

    const [type, setType] = useState<TransactionType>(initial?.type ?? 'EXPENSE');
    const [amount, setAmount] = useState<string>(initial?.amount ?? '');
    const [categoryId, setCategoryId] = useState<string>(
        initial ? String(initial.categoryId) : '',
    );
    const [description, setDescription] = useState(initial?.description ?? '');
    const [date, setDate] = useState(initial?.date ?? todayIso());
    const [localError, setLocalError] = useState<string | null>(null);

    // If the user switches type, clear the selected category if it doesn't match
    useEffect(() => {
        if (!categoryId) return;
        const selected = categories.find((c) => String(c.id) === categoryId);
        if (selected && selected.type !== type) {
            setCategoryId('');
        }
    }, [type, categoryId, categories]);

    const filteredCategories = categories.filter((c) => c.type === type);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLocalError(null);

        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setLocalError('Amount must be a positive number');
            return;
        }
        if (!categoryId) {
            setLocalError('Please choose a category');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            setLocalError('Date must be in YYYY-MM-DD format');
            return;
        }

        onSubmit({
            type,
            amount: parsedAmount,
            categoryId: Number(categoryId),
            description: description.trim() || undefined,
            date,
        });
    }

    const shownError = localError ?? error;

    return (
        <form onSubmit={handleSubmit} className="tx-form">
            <div className="form-field">
                <label>Type</label>
                <div className="radio-group">
                    <label className="radio">
                        <input
                            type="radio"
                            name="type"
                            value="EXPENSE"
                            checked={type === 'EXPENSE'}
                            onChange={() => setType('EXPENSE')}
                        />
                        Expense
                    </label>
                    <label className="radio">
                        <input
                            type="radio"
                            name="type"
                            value="INCOME"
                            checked={type === 'INCOME'}
                            onChange={() => setType('INCOME')}
                        />
                        Income
                    </label>
                </div>
            </div>

            <div className="form-field">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="0.00"
                />
            </div>

            <div className="form-field">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">— Select a category —</option>
                    {filteredCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="date">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="description">Description (optional)</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                    placeholder="e.g. Lunch with team"
                />
            </div>

            {shownError && <div className="form-error">{shownError}</div>}

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}

function todayIso(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}