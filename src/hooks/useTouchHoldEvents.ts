import React, { useRef } from 'react';

// Hook 정의
export default function useTouchHoldEvents(
    { onTouchStart, onTouchEnd, touchDuration }: { onTouchStart: () => void, onTouchEnd?: () => void, touchDuration: number }
) {
    const timer = useRef<NodeJS.Timeout | null>(null);
    const durationReached = useRef<boolean>(false);

    const handleTouchStart = () => {
        durationReached.current = false;
        const newTimer = setTimeout(() => {
            onTouchStart();
            durationReached.current = true;
        }, touchDuration + 500);
        timer.current = newTimer;
    };

    const handleTouchEnd = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        if (durationReached.current) {
            onTouchEnd && onTouchEnd();
        }
    };

    return { handleTouchStart, handleTouchEnd };
}
