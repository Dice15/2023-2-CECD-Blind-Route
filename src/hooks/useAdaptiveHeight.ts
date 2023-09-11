import { useState, useEffect, RefObject } from "react";
import { getPureHeight } from "../cores/utilities/htmlElementUtil";



function useAdaptiveHeight<T extends HTMLElement>(elementRef: RefObject<T>) {
  const [elementHeight, setElementHeight] = useState<number>(0);

  /*useEffect(() => {
    const observerCallback = () => {
      if (elementRef.current) {
      //  const newHeight: number = getPureHeight(elementRef.current) || 0;
        if (elementHeight !== newHeight) {
          setElementHeight(newHeight);
        }
      }
    };

    const observer = new ResizeObserver(observerCallback);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementHeight, elementRef]);*/

  return elementHeight;
}
