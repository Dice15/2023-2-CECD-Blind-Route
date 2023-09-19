import { useEffect, useState } from "react";


/**
 * HTML 요소의 Height를 반환한다
 * 
 * type Default : HTML 요소의 기본 Height
 * 
 * type Pure : Padding, Border가 포함되지 않는 순수 Height
 * 
 * @param htmlElement 
 * @returns number;
 */
export default function useElementHeight<T extends HTMLElement>(htmlElement: React.RefObject<T>, heightType: ("Default" | "Pure")): number {
    const [htmlElementHeight, setHtmlElementHeight] = useState<number>(0);
    const getHeight = heightType === "Default" ? getDefaultHeight : getPureHeight;

    useEffect(() => {
        const currentElement = htmlElement.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newHeight: number = getHeight(htmlElement) || 0;

            if (htmlElementHeight !== newHeight) {
                if (frameId) { cancelAnimationFrame(frameId); }
                frameId = requestAnimationFrame(() => { setHtmlElementHeight(newHeight); });
            }
        };

        const observer = new ResizeObserver(observerCallback);

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [htmlElementHeight]);

    return htmlElementHeight;
}



/** 요소의 높이를 가져옴 */
function getDefaultHeight(htmlElement: React.RefObject<HTMLElement>) {
    return htmlElement.current?.getBoundingClientRect().height;
};



/** 요소의 순수 높이만을 가져옴 */
function getPureHeight(htmlElement: React.RefObject<HTMLElement>) {
    if (htmlElement.current) {
        const styles = window.getComputedStyle(htmlElement.current);
        const height = htmlElement.current?.getBoundingClientRect().height;
        const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
        const border = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        return height - (padding + border);
    }
    return undefined;
};