import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchSummary, fetchByCategory, fetchMonthly } from '../stats/statsSlice';
import { SummaryCards } from './SummaryCards';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyChart } from './MonthlyChart';

export function DashboardPage() {
    const dispatch = useAppDispatch();
    const {
        summary,
        summaryStatus,
        summaryError,
        byCategoryType,
        monthly,
        monthlyStatus,
        monthlyError,
    } = useAppSelector((s) => s.stats);

    useEffect(() => {
        dispatch(fetchSummary());
        dispatch(fetchByCategory(byCategoryType));
        dispatch(fetchMonthly(12));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            {summaryStatus === 'failed' && <div className="form-error">{summaryError}</div>}
            <SummaryCards summary={summary} loading={summaryStatus !== 'succeeded'} />

            <div className="dashboard-grid">
                <CategoryBreakdown />
                <MonthlyChart data={monthly} loading={monthlyStatus === 'loading'} error={monthlyError} />
            </div>
        </div>
    );
}