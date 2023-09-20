import { useEffect, useState } from "react";



/**  HTML 요소의 dimensions (width와 height) */
interface HtmlElementDimensions {
    width: number;
    height: number;
}


/**
 * HTML 요소의 dimensions (width와 height)를 반환한다
 *
 * type Default : HTML 요소의 기본 dimensions
 *
 * type Pure : Padding, Border가 포함되지 않는 순수 dimensions
 *
 * @param htmlElement 
 * @returns [width: number, height: number];
 */
export default function useElementDimensions<T extends HTMLElement>(htmlElement: React.RefObject<T>, dimensionType: "Default" | "Pure"): [width: number, height: number] {
    const [dimensions, setDimensions] = useState<HtmlElementDimensions>({ width: 0, height: 0 });
    const getDimensions = dimensionType === "Default" ? getDefaultDimensions : getPureDimensions;

    useEffect(() => {
        const currentElement = htmlElement.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newDimensions: HtmlElementDimensions = getDimensions(htmlElement);

            if (
                dimensions.width !== newDimensions.width ||
                dimensions.height !== newDimensions.height
            ) {
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
                frameId = requestAnimationFrame(() => {
                    setDimensions(newDimensions);
                });
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
    }, [dimensions, getDimensions, htmlElement]);

    return [dimensions.width, dimensions.height];
}

/** 요소의 dimensions를 가져옴 */
function getDefaultDimensions(htmlElement: React.RefObject<HTMLElement>): HtmlElementDimensions {
    return {
        width: htmlElement.current?.getBoundingClientRect().width || 0,
        height: htmlElement.current?.getBoundingClientRect().height || 0,
    };
}

/** 요소의 순수 dimensions만을 가져옴 */
function getPureDimensions(htmlElement: React.RefObject<HTMLElement>): HtmlElementDimensions {
    if (htmlElement.current) {
        const styles = window.getComputedStyle(htmlElement.current);

        const width = htmlElement.current?.getBoundingClientRect().width || 0;
        const height = htmlElement.current?.getBoundingClientRect().height || 0;

        const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

        const borderX = parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth);
        const borderY = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);

        return {
            width: width - (paddingX + borderX),
            height: height - (paddingY + borderY),
        };
    }

    return { width: 0, height: 0 };
}
