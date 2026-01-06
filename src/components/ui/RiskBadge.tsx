export function RiskBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
    const config = {
        high: { label: '높음', className: 'bg-red-100 text-red-700' },
        medium: { label: '중간', className: 'bg-amber-100 text-amber-700' },
        low: { label: '낮음', className: 'bg-green-100 text-green-700' },
    };

    const { label, className } = config[level];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${className}`}>
            위험도: {label}
        </span>
    );
}
