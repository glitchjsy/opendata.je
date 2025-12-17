import ChartsPageLayout from "@site/src/components/ChartsPageLayout";
import ChartWrapper, { ChartState } from "@site/src/components/ChartWrapper";
import Heading from "@theme/Heading";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { Line } from "react-chartjs-2";
// @ts-ignore
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import config from "../../../../../config.json";
import styles from "./styles.module.css";
import { Attribution } from "@site/src/components/Attribution";

interface ChartDisplayProps {
    data: any;
    state: ChartState;
    setState: (state: ChartState) => void;
    loaded: boolean;
    onRetry: () => void;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DrivingTestResultCharts() {
    const [data, setData] = useState({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/driving-test-results`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Driving Test Results"
            subCategory="Transport"
        >
            <Heading as="h1">Driving Test Results</Heading>
            <p>Driving test results between 1975 and 2017.</p>
            <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/charts/driving-test-results">documentation</a>.
            </p>

            <div className={styles.pageWidth}>
                <LineChartDisplay data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>

            <Attribution
                link="/docs/endpoints/charts/driving-test-results#sources--attribution"
                ogl
                style={{ marginTop: "30px" }}
            />
        </ChartsPageLayout>
    )
}

function LineChartDisplay(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = props.data.map(item => item.date);
            const totalFailed = props.data.map(item => item.totalFailed ? parseInt(item.totalFailed) : null);
            const totalPassword = props.data.map(item => parseInt(item.totalPassed));

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Failed Tests",
                        data: totalFailed,
                        borderColor: "#b30505",
                        backgroundColor: "#b30505",
                        fill: true,
                        tension: 0.2
                    },
                    {
                        label: "Passed Tests",
                        data: totalPassword,
                        borderColor: "green",
                        backgroundColor: "green",
                        fill: true,
                        tension: 0.2
                    }
                ]
            });
            props.setState(ChartState.Loaded);
        }
    }, [props.loaded]);

    return (
        <ChartWrapper
            title="Driving Test Results"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top"
                            },
                            title: {
                                display: true,
                                text: "Driving Test Results"
                            },
                            datalabels: null
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: "Date"
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Results"
                                },
                                beginAtZero: false
                            }
                        },
                        maintainAspectRatio: false
                    }}
                    height={400}
                />
            </div>
        </ChartWrapper>
    )
}