import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TransactionForm } from './TransactionForm';
import {
    fetchTransactionById,
    createTransaction,
    updateTransaction,
    clearMutationError,
    clearCurrent,
} from './transactionSlice';
import type { TransactionPayload } from '../../types';

export function TransactionFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const transactionId = id ? Number(id) : null;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { current, currentStatus, mutationStatus, mutationError } = useAppSelector(
        (s) => s.transactions,
    );

    useEffect(() => {
        if (isEdit && transactionId) {
            dispatch(fetchTransactionById(transactionId));
        }
        return () => {
            dispatch(clearMutationError());
            dispatch(clearCurrent());
        };
    }, [isEdit, transactionId, dispatch]);

    async function handleSubmit(payload: TransactionPayload) {
        if (isEdit && transactionId) {
            const result = await dispatch(updateTransaction({ id: transactionId, payload }));
            if (updateTransaction.fulfilled.match(result)) {
                navigate('/transactions');
            }
        } else {
            const result = await dispatch(createTransaction(payload));
            if (createTransaction.fulfilled.match(result)) {
                navigate('/transactions');
            }
        }
    }

    function handleCancel() {
        navigate('/transactions');
    }

    if (isEdit && currentStatus === 'loading') {
        return <p className="page-loading">Loading…</p>;
    }

    if (isEdit && currentStatus === 'failed') {
        return (
            <div>
                <h1>Transaction not found</h1>
                <button className="btn-secondary" onClick={handleCancel}>
                    Back to list
                </button>
            </div>
        );
    }

    return (
        <div className="tx-form-page">
            <h1>{isEdit ? 'Edit transaction' : 'New transaction'}</h1>
            <TransactionForm
                initial={isEdit ? current ?? undefined : undefined}
                submitLabel={isEdit ? 'Save changes' : 'Create transaction'}
                submitting={mutationStatus === 'loading'}
                error={mutationError}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}