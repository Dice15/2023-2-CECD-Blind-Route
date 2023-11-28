import { useCallback, useRef } from 'react';

export default function useTouchHoldEvents(
    { onTouchStart, onTouchEnd }: { 
        onTouchStart?: { event: () => void, duration: number }, 
        onTouchEnd?: { event: () => void, duration: number } 
    }
) {
    const touchTimer = useRef<NodeJS.Timeout | null>(null);
    const touchEndTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = useCallback(() => {
        touchTimer.current = setTimeout(() => {
            onTouchStart?.event();
        }, onTouchStart?.duration);
    }, [onTouchStart]);

    const handleTouchEnd = useCallback(() => {
        clearTimeout(touchTimer.current as NodeJS.Timeout);

        touchEndTimer.current = setTimeout(() => {
            onTouchEnd?.event();
        }, onTouchEnd?.duration);
    }, [onTouchEnd]);

    const handleTouchCancel = useCallback(() => {
        clearTimeout(touchTimer.current as NodeJS.Timeout);
        clearTimeout(touchEndTimer.current as NodeJS.Timeout);
    }, []);

    return { handleTouchStart, handleTouchEnd, handleTouchCancel };
}
