/**
 * Mock Mode Configuration
 */

/**
 * Check if application is running in mock mode
 */
export function isMockMode(): boolean {
    return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
}

/**
 * Log mock mode status (for debugging)
 */
export function logMockStatus(): void {
    if (isMockMode()) {
        console.log('🧪 Running in MOCK MODE - No external API calls will be made');
    }
}
