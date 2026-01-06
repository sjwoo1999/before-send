'use client';

/**
 * MockModeIndicator - Shows when app is running in mock mode
 * Fixed to bottom-right corner
 */
export function MockModeIndicator() {
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

    if (!isMockMode) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
            <span>🧪</span>
            <span>Mock Mode</span>
        </div>
    );
}
