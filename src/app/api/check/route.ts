import { NextRequest, NextResponse } from 'next/server';
import { messageInputSchema, revisionLabels } from '@/lib/schema';
import { checkBlockedKeywords, BLOCKED_MESSAGE } from '@/lib/safety';
import { analyzeMessage, getFallbackResponse } from '@/lib/claude';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rateLimit';
import { createClient } from '@/lib/supabase/server';
import { setTempResult } from '@/lib/tempStorage';
import { isMockMode } from '@/lib/mock/config';
import { getMockAnalysis } from '@/lib/mock/mockAnalysis';
import { addMockCheck } from '@/lib/mock/mockHistory';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input
        const parseResult = messageInputSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'validation_error', message: parseResult.error.issues[0]?.message || '입력값이 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        const input = parseResult.data;

        // Safety pre-check (works in both mock and production)
        const blockCheck = checkBlockedKeywords(input.original_message);
        if (blockCheck.isBlocked) {
            return NextResponse.json(
                { error: 'blocked', blocked: true, message: BLOCKED_MESSAGE },
                { status: 400 }
            );
        }

        // Generate a unique ID for this check
        const checkId = crypto.randomUUID();

        // ========== MOCK MODE ==========
        if (isMockMode()) {
            console.log('🧪 Mock mode: Using simulated AI analysis');

            const mockResponse = getMockAnalysis(input.original_message, input.preferred_tone);

            const mockResult = {
                id: checkId,
                situation: input.situation || null,
                original_message: input.original_message,
                tone_analysis: {
                    label: mockResponse.tone_label,
                    risk_level: mockResponse.risk_level,
                    problem_summary: mockResponse.problem_summary,
                },
                highlighted_words: mockResponse.highlighted_words,
                revised_options: [
                    { tone: 'soft' as const, label: revisionLabels.soft.ko, message: mockResponse.revised.soft },
                    { tone: 'neutral' as const, label: revisionLabels.neutral.ko, message: mockResponse.revised.neutral },
                    { tone: 'assertive' as const, label: revisionLabels.assertive.ko, message: mockResponse.revised.assertive },
                ],
                created_at: new Date().toISOString(),
            };

            // Store in mock history and temp storage
            addMockCheck(mockResult);
            setTempResult(checkId, mockResult);

            return NextResponse.json(
                { id: checkId, status: 'ok', mock: true },
                { status: 201 }
            );
        }

        // ========== PRODUCTION MODE ==========

        // Get user info for rate limiting
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get IP for anonymous rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Check rate limit
        const rateLimitId = getRateLimitIdentifier(user?.id, ip);
        const rateLimit = await checkRateLimit(rateLimitId);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'rate_limited',
                    message: '하루 무료 사용량(3회)을 초과했습니다.',
                    reset: rateLimit.reset.toISOString(),
                },
                { status: 429 }
            );
        }

        // Call Claude API for analysis
        let aiResponse;
        try {
            aiResponse = await analyzeMessage(input);
        } catch (error) {
            console.error('Claude API error:', error);
            aiResponse = getFallbackResponse(input.original_message);
        }

        // Check if AI blocked the content
        if (aiResponse.blocked) {
            return NextResponse.json(
                { error: 'blocked', blocked: true, message: BLOCKED_MESSAGE },
                { status: 400 }
            );
        }

        // Store in database if user is authenticated
        if (user) {
            const { error: dbError } = await supabase
                .from('message_checks')
                .insert({
                    id: checkId,
                    user_id: user.id,
                    situation: input.situation || null,
                    original_message: input.original_message,
                    tone_label: aiResponse.tone_label,
                    problem_summary: aiResponse.problem_summary,
                    highlighted_words: aiResponse.highlighted_words,
                    revised_soft: aiResponse.revised.soft,
                    revised_neutral: aiResponse.revised.neutral,
                    revised_assertive: aiResponse.revised.assertive,
                    selected_tone: input.preferred_tone || null,
                    prompt_version: 'v1',
                });

            if (dbError) {
                console.error('Database error:', dbError);
            }
        }

        // Store result temporarily for anonymous users
        if (!user) {
            setTempResult(checkId, {
                id: checkId,
                situation: input.situation || null,
                original_message: input.original_message,
                tone_analysis: {
                    label: aiResponse.tone_label,
                    risk_level: aiResponse.risk_level,
                    problem_summary: aiResponse.problem_summary,
                },
                highlighted_words: aiResponse.highlighted_words,
                revised_options: [
                    { tone: 'soft', label: revisionLabels.soft.ko, message: aiResponse.revised.soft },
                    { tone: 'neutral', label: revisionLabels.neutral.ko, message: aiResponse.revised.neutral },
                    { tone: 'assertive', label: revisionLabels.assertive.ko, message: aiResponse.revised.assertive },
                ],
                created_at: new Date().toISOString(),
            });
        }

        return NextResponse.json(
            { id: checkId, status: 'ok' },
            { status: 201 }
        );

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'server_error', message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
