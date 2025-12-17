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

export default function RegisteredVehiclesCharts() {
    const [data, setData] = useState({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/registered-vehicles`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Registered Vehicles"
            subCategory="Transport"
        >
            <Heading as="h1">Registered Vehicles</Heading>
            <p>
                Total number of vehicles in Jersey registered with Driver and Vehicle Standards (DVS). Figures include all motor vehicles including commercial and private vehicles.
            </p>
            <p>
                Figures up to 1993 include only taxed vehicles. Figures from 1994 onwards include all vehicles recorded on the DVS register at 31 December of each year.
            </p>
            <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/charts/registered-vehicles">documentation</a>.
            </p>

            <div className={styles.pageWidth}>
                <LineChartDisplay data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>

            <Attribution
                link="/docs/endpoints/charts/registered-vehicles#sources--attribution"
                ogl
                style={{ marginTop: "30px" }}
            />
        </ChartsPageLayout>
    )
}

function LineChartDisplay(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded && props.data) {
            const labels = Object.keys(props.data);
            const values = Object.values(props.data).map((value: string) => parseInt(value));

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Vehicles",
                        data: values,
                        borderColor: "blue",
                        backgroundColor: "blue",
                        fill: false,
                        tension: 0.2
                    }
                ]
            });

            props.setState(ChartState.Loaded);
        }
    }, [props.loaded, props.data]);

    return (
        <ChartWrapper
            title="Total Registered Vehicles Per Year"
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
                                text: "Total Registered Vehicles Per Year"
                            },
                            datalabels: null
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: "Year"
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Vehicles"
                                },
                                beginAtZero: false
                            }
                        },
                        maintainAspectRatio: false
                    }}
                    height={500}
                />
            </div>
        </ChartWrapper>
    );
}