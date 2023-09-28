import {MarkLines} from "./types";
import {Button, Form, InputNumber, Space} from "antd";
import {CloseOutlined} from '@ant-design/icons';
import {useEffect} from "react";

interface PanelProps {
    setMarkLines: (markLines: MarkLines) => void;
    generateChartData: (min: number, max: number, total: number) => void;
}
interface ChartDataFormFields {
    min: number;
    max: number;
    total: number;
}
interface MarkLineFormFields {
    xAxis: number[];
    yAxis: number[];
}
const Panel = (props: PanelProps) => {
    const { generateChartData, setMarkLines } = props;

    const [chartDataForm] = Form.useForm<ChartDataFormFields>();
    const [markLineForm] = Form.useForm<MarkLineFormFields>();

    const updateChartData = async () => {
        await chartDataForm.validateFields();
        const { min, max, total } = chartDataForm.getFieldsValue();
        generateChartData(min, max, total);
    };

    const updateMarkLines = () => {
        const { xAxis, yAxis } = markLineForm.getFieldsValue();
        setMarkLines({
            xAxis: xAxis.filter(v => v !== null && v !== undefined).sort((a, b) => a - b),
            yAxis: yAxis.filter(v => v !== null && v !== undefined).sort((a, b) => a - b)
        })
    };

    useEffect(() => {
        updateChartData();
        updateMarkLines();
    }, []);

    return (
        <div>
            <Form name="chartDataForm" form={chartDataForm}
                  initialValues={{ min: 0, max: 100, total: 300}}
            >
                <Form.Item label="范围" required name={'range'} dependencies={['min', 'max']}
                    rules={[{validator: async () => {
                        const min = chartDataForm.getFieldValue('min');
                        const max = chartDataForm.getFieldValue('max');
                        if (min === undefined || max === undefined || min <= max - 10) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject('最大最小值之间至少相差10')
                        }
                    }}]}
                >
                    <Space>
                        <Form.Item<ChartDataFormFields> name="min" rules={[{required: true}]} noStyle>
                            <InputNumber precision={0}/>
                        </Form.Item>
                        <Form.Item<ChartDataFormFields> name="max" rules={[{required: true}]} noStyle>
                            <InputNumber precision={0}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item<ChartDataFormFields> name="total" label={'数量'} required rules={[{required: true}]}>
                    <InputNumber min={0} precision={0} />
                </Form.Item>
                <Form.Item>
                    <Button type={'primary'} onClick={updateChartData}>更新数据</Button>
                </Form.Item>
            </Form>
            <Form<MarkLineFormFields> name="markLineForm" form={markLineForm}
                  initialValues={{ xAxis: [25, 50, 75], yAxis: [25, 50, 75]}}
            >
                <Form.Item noStyle>
                    <Space size={'middle'} align={'start'}>
                        <Form.Item<MarkLineFormFields> name={'xAxis'} label={'X'}>
                            <Form.List name={'xAxis'}>
                                {(fields, {add, remove}) => (
                                    <>
                                        {
                                            fields.map((field, index) => (
                                                <Form.Item label={`x-mark-line-${index + 1}`} key={field.name}>
                                                    <Space>
                                                        <Form.Item noStyle name={[field.name]}>
                                                            <InputNumber/>
                                                        </Form.Item>
                                                        <CloseOutlined onClick={() => remove(field.name)}/>
                                                    </Space>
                                                </Form.Item>
                                            ))
                                        }
                                        <Form.Item noStyle>
                                            <Button type="dashed" onClick={() => add()}>
                                                + Add
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                        <Form.Item<MarkLineFormFields> name={'yAxis'} label={'Y'}>
                            <Form.List name={'yAxis'}>
                                {(fields, {add, remove}) => (
                                    <>
                                        {
                                            fields.map((field, index) => (
                                                <Form.Item label={`y-mark-line-${index + 1}`} key={field.name}>
                                                    <Space>
                                                        <Form.Item noStyle name={[field.name]}>
                                                            <InputNumber/>
                                                        </Form.Item>
                                                        <CloseOutlined onClick={() => remove(field.name)}/>
                                                    </Space>
                                                </Form.Item>
                                            ))
                                        }
                                        <Form.Item noStyle>
                                            <Button type="dashed" onClick={() => add()}>
                                                + Add
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item>
                    <Button type={'primary'}
                            onClick={updateMarkLines}
                    >
                        更新网格
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Panel;
