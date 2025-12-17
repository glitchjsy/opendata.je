import ChartsPageLayout from "@site/src/components/ChartsPageLayout";
import ChartWrapper, { ChartState } from "@site/src/components/ChartWrapper";
import Heading from "@theme/Heading";
import React, { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
// @ts-ignore
import { Bar, Pie } from "react-chartjs-2";
// @ts-ignore
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend, ArcElement } from "chart.js";
import config from "../../../../../config.json";
import styles from "./styles.module.css";
import Stat from "@site/src/components/ui/Stat";
import { Attribution } from "@site/src/components/Attribution";

interface ChartDisplayProps {
    data: any;
    state: ChartState;
    setState: (state: ChartState) => void;
    loaded: boolean;
    onRetry: () => void;
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ArcElement, ChartDataLabels);

export default function FoiStatsCharts() {
    const [data, setData] = useState<any>({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/foi-requests/stats`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="FOI Stats"
            subCategory="Other"
        >
            <Heading as="h1">Freedom of Information Statistics</Heading>
            {/* <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/other/foi-stats">documentation</a>.
            </p> */}
            <p>
                To search Freedom of Information requests, please see the <a href="/tools/foi-search">FOI Search Tool</a>.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Stat name="Total Requests" value={data?.totalRequests} />
                <Stat name="Distinct Response Authors" value={data?.distinctAuthors} />
            </div>

            <div className={styles.pageWidth}>
                <br />
                <TotalPerYearChart data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
                <br />
                <Top10AuthorsChart data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>
        </ChartsPageLayout>
    )
}

function TotalPerYearChart(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = Object.keys(props.data.totalsPerYear);
            const values = Object.values(props.data.totalsPerYear);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "FOI Requests Published",
                        data: values,
                        backgroundColor: "rgba(54, 162, 235, 1)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }
                ]
            });
            props.setState(ChartState.Loaded);
        }
    }, [props.loaded]);

    return (
        <ChartWrapper
            title="Total Requests Published Per Year"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Total FOI Requests Published Per Year"
                            },
                            datalabels: {
                                anchor: "end",
                                align: "top",
                                color: "black",
                                font: {
                                    weight: "bold"
                                },
                                formatter: (value: any) => value
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


function Top10AuthorsChart(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = Object.keys(props.data.topAuthors);
            const values = Object.values(props.data.topAuthors);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "FOI Requests Published",
                        data: values,
                        backgroundColor: "rgba(54, 162, 235, 1)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }
                ]
            });
            props.setState(ChartState.Loaded);
        }
    }, [props.loaded]);

    return (
        <ChartWrapper
            title="Top 10 Authors"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Top 10 FOI Response Authors"
                            },
                            datalabels: {
                                anchor: "end",
                                align: "top",
                                color: "black",
                                font: {
                                    weight: "bold"
                                },
                                formatter: (value: any) => value
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