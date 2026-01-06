import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isMockMode } from '@/lib/mock/config';
import { getMockHistory } from '@/lib/mock/mockHistory';

export async function GET() {
    try {
        // ========== MOCK MODE ==========
        if (isMockMode()) {
            const items = getMockHistory();
            return NextResponse.json({ items, mock: true });
        }

        // ========== PRODUCTION MODE ==========
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'unauthorized', message: '로그인이 필요합니다.' },
                { status: 401 }
            );
        }

        const { data, error } = await supabase
            .from('message_checks')
            .select('id, tone_label, original_message, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'server_error', message: '기록을 불러오는데 실패했습니다.' },
                { status: 500 }
            );
        }

        // Transform to expected format with snippets
        const items = (data || []).map(item => ({
            id: item.id,
            tone_label: item.tone_label,
            original_snippet: item.original_message.length > 50
                ? item.original_message.substring(0, 50) + '...'
                : item.original_message,
            created_at: item.created_at,
        }));

        return NextResponse.json({ items });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'server_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
