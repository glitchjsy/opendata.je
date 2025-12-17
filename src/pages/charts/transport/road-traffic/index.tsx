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

export default function RoadTrafficCharts() {
    const [data, setData] = useState({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/road-traffic`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Road Traffic"
            subCategory="Transport"
        >
            <Heading as="h1">Road Traffic</Heading>
            <p>Road traffic on the underpass and tunnel between 2019 and 2022.</p>
            <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/charts/road-traffic">documentation</a>.
            </p>

            <div className={styles.pageWidth}>
                <LineChartDisplay data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>

            <Attribution
                link="/docs/endpoints/charts/road-traffic#sources--attribution"
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
            const tunnelMovements = props.data.map(item => item.tunnelMovements ? parseInt(item.tunnelMovements) : null);
            const overpassMovements = props.data.map(item => parseInt(item.overpassMovements));

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Tunnel Movements",
                        data: tunnelMovements,
                        borderColor: "blue",
                        backgroundColor: "blue",
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: "Overpass Movements",
                        data: overpassMovements,
                        borderColor: "purple",
                        backgroundColor: "purple",
                        fill: false,
                        tension: 0.4
                    }
                ]
            });
            props.setState(ChartState.Loaded);
        }
    }, [props.loaded]);

    return (
        <ChartWrapper
            title="Road Traffic"
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
                                text: "Tunnel vs Overpass Movements"
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
                                    text: "Movements"
                                },
                                beginAtZero: false
                            }
                        },
                        maintainAspectRatio: false
                    }}
                    height={550}
                />
            </div>
        </ChartWrapper>
    )
}