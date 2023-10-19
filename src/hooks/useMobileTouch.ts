import { useCallback, useRef } from 'react';

export default function useMobileTouch(
    { onSingleTouch, onDoubleTouch }: { onSingleTouch?: () => void, onDoubleTouch?: () => void },
    delay: number = 300
) {
    const tapRef = useRef<number>(0);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTap = useCallback(() => {
        const now = Date.now();
        if (now - tapRef.current < delay) {
            if (touchTimer.current) {
                clearTimeout(touchTimer.current);
                touchTimer.current = null;
            }
            if (onDoubleTouch) {
                onDoubleTouch();
            }
            tapRef.current = 0;
        } else {
            tapRef.current = now;
            touchTimer.current = setTimeout(() => {
                if (onSingleTouch) {
                    onSingleTouch();
                }
            }, delay);
        }
    }, [onDoubleTouch, onSingleTouch, delay]);

    return handleTap;
};