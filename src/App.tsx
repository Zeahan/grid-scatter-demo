import Chart from "./chart";
import {useCallback, useEffect, useMemo, useState} from "react";
import {AxisRange, MarkLines} from "./types";
import {getRandomData, percentageToValue} from "./utils";
import Panel from "./Panel";

function App() {
    const [chartData, setChartData] = useState<[number, number][]>([]);

    const [axisRange, setAxisRange] = useState<AxisRange>({
        xAxis: [0, 100],
        yAxis: [0, 100]
    });

    const [markLines, setMarkLines] = useState<MarkLines>({
        xAxis: [50],
        yAxis: [50]
    })

    const chartDataRange = useMemo<AxisRange>(() => {
        if (chartData.length === 0) {
            return {
                xAxis: [0, 100],
                yAxis: [0, 100]
            }
        }
        const sortByX = [...chartData].sort(([x1,], [x2,]) => x1 - x2);
        const sortByY = [...chartData].sort(([, y1], [, y2]) => y1 - y2);
        console.log({ sortByX, sortByY })
        return {
            xAxis: [sortByX[0][0], sortByX[sortByX.length - 1][0]],
            yAxis: [sortByY[0][1], sortByY[sortByY.length - 1][1]]
        }
    }, [chartData]);

    useEffect(() => {
        setAxisRange(chartDataRange);
    }, [chartDataRange]);

    const generateChartData = useCallback((min = 0, max = 100, total = 100) => {
        const data = getRandomData(min, max, total);
        setChartData(data);
    }, []);

    const updateAxisRange = useCallback((update: Partial<AxisRange>) => {
        if (update.xAxis) {
            update.xAxis = [percentageToValue(update.xAxis[0], chartDataRange.xAxis), percentageToValue(update.xAxis[1], chartDataRange.xAxis)]
        }
        if (update.yAxis) {
            update.yAxis = [percentageToValue(update.yAxis[0], chartDataRange.yAxis), percentageToValue(update.yAxis[1], chartDataRange.yAxis)]
        }
        setAxisRange({ ...axisRange, ...update });
    }, [axisRange, chartDataRange])

    return (
        <div>
            <Chart
                axisRange={axisRange}
                chartData={chartData}
                markLines={markLines}
                updateAxisRange={updateAxisRange}
            />
            <Panel setMarkLines={setMarkLines} generateChartData={generateChartData}/>
        </div>
    )
}

export default App
