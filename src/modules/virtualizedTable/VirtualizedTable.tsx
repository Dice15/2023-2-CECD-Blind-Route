import React, { useState, useCallback } from 'react';
import styles from "./VirtualizedTable.module.css"


export interface VirtualizedTableProps {
    windowHeight: number;

    numColumns: number;
    columnHeight: number;
    columnWidths: React.CSSProperties[];
    renderColumns: (item: { index: number; columnClassName: string; columnStyle: React.CSSProperties; }) => JSX.Element;

    numRows: number;
    rowHeight: number;
    renderRows: (item: { index: number; rowClassName: string; rowStyle: React.CSSProperties, itemClassName: string; itemStyles: React.CSSProperties[]; }) => JSX.Element;
}


/** 가상 스크롤 테이블 */
export default function VirtualizedTable({
    windowHeight,
    numColumns, columnHeight, columnWidths, renderColumns,
    numRows, rowHeight, renderRows,
}: VirtualizedTableProps) {
    const [scrollTop, setScrollTop] = useState(0);

    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const innerHeight = numRows * rowHeight;
    const headerHeight = columnHeight;
    const bodyHeight = windowHeight - columnHeight;
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(numRows - 1, Math.floor((scrollTop + bodyHeight) / rowHeight));

    const columns = [];
    for (let i = 0; i < numColumns; i++) {
        columns.push(
            React.cloneElement(renderColumns({
                index: i,
                columnClassName: `${styles.virtualizedTable_column}`,
                columnStyle: {
                    flex: `0 0 ${columnWidths?.length ? columnWidths[i].width : "100px"}`,
                    minWidth: `${columnWidths?.length ? columnWidths[i].minWidth : "100px"}`,
                    height: `${columnHeight}px`,
                    textAlign: "center",
                }
            }), { key: `column-${i}` })
        );
    }

    const rows = [];
    for (let i = startIndex; i <= endIndex; i++) {
        rows.push(
            React.cloneElement(renderRows({
                index: i,
                rowClassName: `${styles.virtualizedTable_row}`,
                rowStyle: {
                    display: "flex",
                    position: "absolute",
                    top: `${i * rowHeight}px`,
                    width: "100%",
                    height: `${rowHeight}px`,
                },
                itemClassName: `${styles.virtualizedTable_item}`,
                itemStyles: columnWidths.map((column) => {
                    return {
                        flex: `0 0 ${column.width}`,
                        minWidth: `${column.minWidth}`,
                        height: `100%`,
                        textAlign: "center",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }
                })
            }), { key: `row-${i}` })
        );
    }

    return (
        <div className={styles.virtualizedTable}>
            <div className={styles.table__header} style={{ height: `${headerHeight}px`, maxHeight: `${headerHeight}px` }}>
                <div className={styles.table__headers_columns}>
                    {columns}
                </div>
            </div>

            <div className={styles.table__body} style={{ height: `${bodyHeight}px`, maxHeight: `${bodyHeight}px` }} onScroll={onScroll}>
                <div className={styles.table__body_rows} style={{ height: `${innerHeight}px` }}>
                    {rows}
                </div>
            </div>
        </div>
    );
};