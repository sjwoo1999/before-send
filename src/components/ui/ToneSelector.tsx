'use client';

interface ToneSelectorProps {
    value: 'soft' | 'neutral' | 'assertive' | null;
    onChange: (value: 'soft' | 'neutral' | 'assertive' | null) => void;
}

const toneOptions: {
    value: 'soft' | 'neutral' | 'assertive';
    label: string;
    description: string;
}[] = [
        { value: 'soft', label: '부드럽게', description: '따뜻하지만 굽히지 않는' },
        { value: 'neutral', label: '중립', description: '사실 중심, 감정 최소화' },
        { value: 'assertive', label: '단호하게', description: '명확한 경계 설정' },
    ];

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-caption block">
                원하는 톤 선택 (선택사항)
            </label>
            <div className="flex flex-wrap gap-2">
                {toneOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(value === option.value ? null : option.value)}
                        className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus-ring
              ${value === option.value
                                ? 'bg-[#19C2A0] text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }
            `}
                        aria-pressed={value === option.value}
                        title={option.description}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            {value && (
                <p className="text-xs text-slate-500">
                    {toneOptions.find(o => o.value === value)?.description}
                </p>
            )}
        </div>
    );
}
