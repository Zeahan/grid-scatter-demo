import {ECElementEvent} from "echarts/types/dist/echarts";
import {ECActionEvent} from "echarts/types/src/util/types";

export interface AxisRange {
    xAxis: [number, number]
    yAxis: [number, number]
}

export interface MarkLines {
    xAxis: number[],
    yAxis: number[]
}

export interface DataZoomElementEvent extends ECElementEvent {
    dataZoomId: string;
    start: number;
    end: number;
}

export interface DataZoomActionEvent extends ECActionEvent {
    batch: {
        dataZoomId: string;
        start: number;
        end: number;
    }[];
}

export type DataZoomEvent = DataZoomActionEvent | DataZoomElementEvent;
