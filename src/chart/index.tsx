import Grid from "./Grid";
import Scatter from "./Scatter";
import {AxisRange, MarkLines} from "../types";
import {useCallback, useMemo, useState} from "react";
import {getAreaByPosition, getColorByIndex, getGridIndexByPosition, getRangeByArea} from "../utils";
import { message } from "antd";

const palette = [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3',
    '#dd6b66',
    '#759aa0',
    '#e69d87',
    '#8dc1a9',
    '#ea7e53',
    '#eedd78',
    '#73a373',
    '#73b9bc',
    '#7289ab',
    '#91ca8c',
    '#f49f42'
]

interface ChartProps {
    axisRange: AxisRange;
    chartData: [number, number][];
    markLines: MarkLines;
    updateAxisRange: (update: Partial<AxisRange>) => void;
}
const Chart = (props: ChartProps) => {
    const { axisRange, chartData, markLines, updateAxisRange } = props;

    const [hoveredArea, setHoveredArea] = useState<[number, number]>();

    const gridColors = useMemo(() => {
        const result = [];
        for (let i = 0; i < markLines.yAxis.length + 1; i++) {
            const row = [];
            for (let j = 0; j < markLines.xAxis.length + 1; j++) {
                const index = i * (markLines.xAxis.length + 1) + j;
                row.push(palette[index % palette.length]);
            }
            result.push(row);
        }
        return result;
    }, [markLines]);

    const getColorByPosition = useCallback((x: number, y: number) => {
        const rowIndex = getGridIndexByPosition(y, markLines.yAxis);
        const colIndex = getGridIndexByPosition(x, markLines.xAxis);
        return getColorByIndex(rowIndex, colIndex, gridColors);
    }, [markLines, gridColors]);

    const updateHoveredArea = useCallback((position?: [number, number]) => {
        if (!position) {
            return setHoveredArea(undefined);
        }
        setHoveredArea(getAreaByPosition(position as [number, number], markLines));
    }, [setHoveredArea, markLines]);

    const handleGridClick = (position: [number, number]) => {
        const area = getAreaByPosition(position, markLines);
        const color = getColorByIndex(...area, gridColors);
        const range = getRangeByArea(area, markLines);
        const messageContent = (
            <>
                <p>
                    点击了
                    <span style={{ color }}>第{area[0]}行-第{area[1]}列的区域</span>
                </p>
                <p>
                    该区域的范围是：<br/>
                    x - {range.x[0] || '-∞'} ~ {range.x[1] || '∞'}<br/>
                    y - {range.y[0] || '-∞'} ~ {range.y[1] || '∞'}
                </p>
            </>
        );
        message.info(messageContent);
    }

    return (
        <div style={{ width: 600, height: 600, position: 'relative' }}>
            <Grid axisRange={axisRange} markLines={markLines}
                  gridColors={gridColors} hoveredArea={hoveredArea}
            />
            <Scatter data={chartData} getColorByPosition={getColorByPosition} handleGridClick={handleGridClick}
                     updateHoveredArea={updateHoveredArea} updateAxisRange={updateAxisRange}
            />
        </div>
    )
}

export default Chart;
