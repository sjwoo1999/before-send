import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revisionLabels } from '@/lib/schema';
import { getTempResult } from '@/lib/tempStorage';
import { isMockMode } from '@/lib/mock/config';
import { getMockCheck } from '@/lib/mock/mockHistory';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;

    try {
        // First check temporary storage (works for both mock and production)
        const tempResult = getTempResult(id);
        if (tempResult) {
            return NextResponse.json(tempResult);
        }

        // ========== MOCK MODE ==========
        if (isMockMode()) {
            const mockResult = getMockCheck(id);
            if (mockResult) {
                return NextResponse.json(mockResult);
            }

            return NextResponse.json(
                { error: 'not_found', message: '결과를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // ========== PRODUCTION MODE ==========

        // Check database for authenticated users
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
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'not_found', message: '결과를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // Transform to API response format
        const response = {
            id: data.id,
            situation: data.situation,
            original_message: data.original_message,
            tone_analysis: {
                label: data.tone_label,
                risk_level: determineRiskLevel(data.tone_label),
                problem_summary: data.problem_summary,
            },
            highlighted_words: data.highlighted_words,
            revised_options: [
                { tone: 'soft', label: revisionLabels.soft.ko, message: data.revised_soft },
                { tone: 'neutral', label: revisionLabels.neutral.ko, message: data.revised_neutral },
                { tone: 'assertive', label: revisionLabels.assertive.ko, message: data.revised_assertive },
            ],
            created_at: data.created_at,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'server_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;

    try {
        // ========== MOCK MODE ==========
        if (isMockMode()) {
            const { deleteMockCheck } = await import('@/lib/mock/mockHistory');
            deleteMockCheck(id);
            return new NextResponse(null, { status: 204 });
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

        const { error } = await supabase
            .from('message_checks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json(
                { error: 'server_error', message: '삭제에 실패했습니다.' },
                { status: 500 }
            );
        }

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'server_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

function determineRiskLevel(toneLabel: string): 'high' | 'medium' | 'low' {
    switch (toneLabel) {
        case 'aggressive':
            return 'high';
        case 'passive_aggressive':
        case 'defensive':
            return 'medium';
        case 'neutral':
        default:
            return 'low';
    }
}
