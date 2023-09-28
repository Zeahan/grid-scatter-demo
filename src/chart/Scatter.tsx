import { useEffect, useMemo, useRef} from "react";
import * as echarts from 'echarts';
import {ComposeOption, ScatterSeriesOption, EChartsType, EChartsOption} from "echarts";
import {AxisRange, DataZoomActionEvent, DataZoomElementEvent, DataZoomEvent} from "../types";

interface ScatterProps {
    data: [number, number][];
    getColorByPosition: (x: number, y: number) => string;
    updateAxisRange: (update: Partial<AxisRange>) => void;
    updateHoveredArea: (position?: [number, number] | undefined) => void;
    handleGridClick: (position: [number, number]) => void;
}
const Scatter = (props: ScatterProps) => {
    const {data, getColorByPosition, updateAxisRange, updateHoveredArea, handleGridClick} = props;

    const ecRef = useRef<EChartsType>();
    useEffect(() => {
        ecRef.current = echarts.init(document.getElementById('scatter'));
    }, []);

    // 使用ref提供echarts监听所需的回调，避免重复设置监听
    const ecListenersRef = useRef({
        isListening: false,
        updateAxisRange,
        updateHoveredArea,
        handleGridClick
    });
    useEffect(() => {
        const { isListening } = ecListenersRef.current
        ecListenersRef.current = { isListening, updateAxisRange, updateHoveredArea, handleGridClick }
    }, [updateAxisRange, updateHoveredArea, handleGridClick])

    const options: ComposeOption<ScatterSeriesOption> & EChartsOption = useMemo(() => ({
        tooltip: {
            show: true,
            trigger: 'item'
        },
        dataZoom: [
            { name: 'slider-x', type: 'slider', xAxisIndex: 0, start: 0, end: 100 },
            { name: 'slider-y', type: 'slider', yAxisIndex: 0, start: 0, end: 100 },
            { name: 'inside-x', type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
            { name: 'inside-y', type: 'inside', yAxisIndex: 0, start: 0, end: 100 }
        ],
            grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: {
            show: false,
            max: 'dataMax',
            min: 'dataMin'
        },
        yAxis: {
            show: false,
            max: 'dataMax',
            min: 'dataMin'
        },
        series: [
            {
                type: 'scatter',
                symbolSize: 20,
                itemStyle: {
                    color: ({data}) => {
                        const [x, y] = data as [number, number];
                        return getColorByPosition(x, y);
                    }
                },
                tooltip: { formatter: '{c}' },
                data,
            }
        ]
    }), [getColorByPosition, data])

    useEffect(() => {
        if (!ecRef.current || ecListenersRef.current.isListening) {
            return;
        }
        ecRef.current.on('datazoom', (_params) => {
            const params = _params as DataZoomEvent;
            const updateAxisParams: Parameters<typeof ecListenersRef.current.updateAxisRange>[0] = {};
            if (params.batch) {
                const xZoom = (params as DataZoomActionEvent)
                    .batch
                    .find(zoom => zoom.dataZoomId.replaceAll('\x00','') === 'inside-x0');
                const yZoom = (params as DataZoomActionEvent)
                    .batch
                    .find(zoom => zoom.dataZoomId.replaceAll('\x00','') === 'inside-y0');
                if (xZoom) {
                    updateAxisParams.xAxis = [xZoom.start, xZoom.end];
                }
                if (yZoom) {
                    updateAxisParams.yAxis = [yZoom.start, yZoom.end]
                }
            } else {
                if ((params as DataZoomElementEvent).dataZoomId.replaceAll('\x00','') === 'slider-x0') {
                    updateAxisParams.xAxis = [params.start, params.end]
                }
                if ((params as DataZoomElementEvent).dataZoomId.replaceAll('\x00','') === 'slider-y0') {
                    updateAxisParams.yAxis = [params.start, params.end]
                }
            }
            ecListenersRef.current.updateAxisRange(updateAxisParams);
        });
        ecRef.current.getZr().on('mousemove', (params) => {
            const { target, offsetX, offsetY } = params;
            if (!target) {
                const position = ecRef.current?.convertFromPixel('series', [offsetX, offsetY]);
                ecListenersRef.current.updateHoveredArea(position as [number, number])
            } else {
                ecListenersRef.current.updateHoveredArea()
            }
        });
        ecRef.current.getZr().on('click', (params) => {
            console.log('click', params)
            const { target, offsetX, offsetY } = params;
            if (!target) {
                const position = ecRef.current?.convertFromPixel('series', [offsetX, offsetY]);
                if (position) {
                    ecListenersRef.current.handleGridClick(position as [number, number])
                }
            }
        });
        ecListenersRef.current.isListening = true;
    }, [ecRef])

    useEffect(() => {
        if (ecRef.current) {
            ecRef.current?.setOption(options)
        }
    }, [options, data, ecRef])



    return (
        <div id={'scatter'} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
    )
}

export default Scatter;
