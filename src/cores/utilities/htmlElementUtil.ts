import { RefObject } from 'react';

/** 요소의 높이를 가져옴 */
export function getHeight(htmlElement: RefObject<HTMLElement>) {
    return htmlElement.current?.getBoundingClientRect().height;
};


/** 요소의 순수 높이만을 가져옴 */
export function getPureHeight(htmlElement: RefObject<HTMLElement>) {
    if (htmlElement.current) {
        const styles = window.getComputedStyle(htmlElement.current);
        const height = htmlElement.current?.getBoundingClientRect().height;
        const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
        const border = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        return height - (padding + border);
    }
    return undefined;
};