import { useCallback, useRef } from 'react';

/**
 * useTapEvents Hook은 단일 탭, 더블 탭, 그리고 트리플 탭 이벤트를 처리합니다.
 * 각각의 이벤트에 대한 콜백 함수를 제공합니다.
 *
 * @param {Object} param0 - Hook의 옵션 객체입니다.
 * @param {Function} param0.onSingleTouch - 단일 탭 이벤트에 대한 콜백 함수입니다.
 * @param {Function} param0.onDoubleTouch - 더블 탭 이벤트에 대한 콜백 함수입니다.
 * @param {Function} param0.onTripleTouch - 트리플 탭 이벤트에 대한 콜백 함수입니다.
 * @param {number} delay - 더블 및 트리플 탭 감지를 위한 지연 시간입니다. 기본값은 300ms입니다.
 * @returns {Function} 이벤트 핸들러 함수를 반환합니다. 이 함수는 단일, 더블, 트리플 탭 이벤트를 처리합니다.
 */
export default function useTapEvents(
    { onSingleTouch, onDoubleTouch, onTripleTouch }: { onSingleTouch?: () => void, onDoubleTouch?: () => void, onTripleTouch?: () => void },
    delay: number = 300
) {
    const tapCountRef = useRef<number>(0);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTap = useCallback(() => {
        tapCountRef.current += 1;

        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
        }

        touchTimer.current = setTimeout(() => {
            switch (tapCountRef.current) {
                case 1:
                    if (onSingleTouch) onSingleTouch();
                    break;
                case 2:
                    if (onDoubleTouch) onDoubleTouch();
                    break;
                case 3:
                    if (onTripleTouch) onTripleTouch();
                    break;
            }
            tapCountRef.current = 0;
        }, delay);
    }, [onSingleTouch, onDoubleTouch, onTripleTouch, delay]);

    return handleTap;
};
