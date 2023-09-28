import {MarkLines} from "./types";

export const getRandomData = (min: number, max: number, total = 100): [number, number][] => {
    const getRandomInt = () => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    return new Array(Math.floor(total))
        .fill(0)
        .map(() => [getRandomInt(), getRandomInt()]);
}

export const percentageToValue = (percentage: number, [start, end]: [number, number]) => {
    return start + (end - start) * percentage / 100;
}
export const valueToPercentage = (value: number, [start, end]: [number, number]) => {
    return Math.floor((value - start) / (end - start) * 100);
}

export const getWidthTemplates = (lines: number[], [start, end]: [number, number]) => {
    return [...lines, Math.max(end, lines[lines.length - 1])]
        .map((curr, index) => {
            const prev = index > 0 ? lines[index - 1] : start;
            const width = curr - prev;
            if (width <= 0) {
                return '0';
            }
            if (curr <= start || prev >= end) {
                return '0';
            }
            if (width >= end - prev) {
                return '1fr';
            }
            return `${valueToPercentage(curr, [start, end]) - valueToPercentage(Math.max(prev, start), [start, end])}%`
        });
}

export const getGridIndexByPosition = (val: number, lines: number[]) => lines
    .reduce((result, line) => val >= line ? result + 1 : result, 0);

export const getAreaByPosition = (position: [number, number], markLines: MarkLines): [number, number] => {
    const [x, y] = position;
    const row = getGridIndexByPosition(y, markLines.yAxis);
    const col = getGridIndexByPosition(x, markLines.xAxis);
    return [row, col];
}

export const getRangeByArea = ([row, col]: [number, number], markLines: MarkLines) => {
    const xStart = markLines.xAxis[col - 1];
    const xEnd = markLines.xAxis[col];
    const yStart = markLines.yAxis[row - 1];
    const yEnd = markLines.yAxis[row];

    return {
        x: [xStart, xEnd],
        y: [yStart, yEnd]
    }
}

export const getColorByIndex = (row: number, col: number, grid: string[][]) => {
    return grid[row][col]
}
