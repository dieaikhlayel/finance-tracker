export function formatCurrency(value: string | number): string {
    const n = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(n)) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n);
}

export function formatDate(isoDate: string): string {
    // isoDate is 'YYYY-MM-DD' from the backend.
    const [y, m, d] = isoDate.split('-').map(Number);
    if (!y || !m || !d) return isoDate;
    // Use a local Date to avoid the UTC shift. new Date('2025-03-14') is
    // interpreted as UTC midnight, which is March 13 in negative-offset zones.
    const local = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(local);
}

export function formatMonth(yyyymm: string): string {
    // yyyymm is 'YYYY-MM'.
    const [y, m] = yyyymm.split('-').map(Number);
    if (!y || !m) return yyyymm;
    const local = new Date(y, m - 1, 1);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(local);
}