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

interface ChartDisplayProps {
    data: any;
    state: ChartState;
    setState: (state: ChartState) => void;
    loaded: boolean;
    onRetry: () => void;
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ArcElement, ChartDataLabels);

export default function PetitionStatsCharts() {
    const [data, setData] = useState<any>({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/petition-stats`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Petition Stats"
            subCategory="Other"
        >
            <Heading as="h1">Petition Statistics</Heading>
            {/* <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/other/foi-stats">documentation</a>.
            </p> */}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Stat name="Open" value={data?.petitionsByState?.open} />
                <Stat name="Closed" value={data?.petitionsByState?.closed} />
                <Stat name="Rejected" value={data?.petitionsByState?.rejected} />
                <Stat name="Debated" value={data?.debatedPetitions} />
                <Stat name="Ministers Responses" value={data?.petitionsWithResponses} />
            </div>

            <div className={styles.pageWidth}>
                <TotalPetitionsPerYearChart data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
                <br />
                <TotalSignaturesByParishChart data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
                <br />
                <TotalResponsesPerYearChart data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>
        </ChartsPageLayout>
    )
}

function TotalResponsesPerYearChart(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = Object.keys(props.data.responsesPerYear);
            const values = Object.values(props.data.responsesPerYear);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Year",
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
            title="Total Ministers Responses Per Year"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Number of Responses"
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Total Ministers Responses Per Year"
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
                    height={300}
                />
            </div>
        </ChartWrapper>
    )
}

function TotalPetitionsPerYearChart(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = Object.keys(props.data.petitionsPerYear);
            const values = Object.values(props.data.petitionsPerYear);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Year",
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
            title="Total Petitions Per Year"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Number of Petitions"
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Total Petitions Per Year"
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

function TotalSignaturesByParishChart(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        if (props.loaded) {
            const labels = Object.keys(props.data.signaturesByParish);
            const values = Object.values(props.data.signaturesByParish);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Parish",
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
            title="Total Signatures By Parish"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartContainer}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Number of Signatures (all time)"
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Total Signatures By Parish (all time)"
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