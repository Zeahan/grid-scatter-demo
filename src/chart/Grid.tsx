import {CSSProperties} from "react";
import {AxisRange, MarkLines} from "../types";
import {getWidthTemplates} from "../utils";

interface GridProps {
    axisRange: AxisRange;
    markLines: MarkLines;
    gridColors: string[][];
    hoveredArea?: [number, number];
}
const Grid = (props: GridProps) => {
    const { axisRange, markLines, gridColors, hoveredArea } = props;

    const rows = getWidthTemplates(markLines.yAxis, axisRange.yAxis);
    const columns = getWidthTemplates(markLines.xAxis, axisRange.xAxis);

    const gridStyle: CSSProperties = {
        color: '#fff',
        display: 'grid',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        gridTemplateColumns: columns.join(' '),
        gridTemplateRows: [...rows].reverse().join(' ')
    };

    const getIsHovered = (row: number, col: number) => {
        if (!hoveredArea) {
            return false;
        }
        return row === hoveredArea[0] && col === hoveredArea[1];
    }

    return (
        <div style={gridStyle}>
            {
                gridColors.map((row, i) => row.map((color, j) => (
                    <div style={{ backgroundColor: color, opacity: getIsHovered(i, j) ? '.7' : '.5' }}>
                    </div>
                ))).reverse()
            }
        </div>
    )
}

export default Grid;
