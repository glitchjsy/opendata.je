import ChartsPageLayout from "@site/src/components/ChartsPageLayout";
import ChartWrapper, { ChartState } from "@site/src/components/ChartWrapper";
import Heading from "@theme/Heading";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { Bar, Line } from "react-chartjs-2";
// @ts-ignore
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import config from "../../../../../config.json";
import styles from "./styles.module.css";
import { Attribution } from "@site/src/components/Attribution";

interface ChartDisplayProps {
    dataLastYear: any;
    dataThisYear: any;
    state: ChartState;
    setState: (state: ChartState) => void;
    loaded: boolean;
    onRetry: () => void;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function ParkingStatsCharts() {
    const [data, setData] = useState<any>({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/parking-stats`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Parking Statistics"
            subCategory="Transport"
        >
            <Heading as="h1">Parking Statistics</Heading>

            <div className={styles.pageWidth}>
                <CarparkAvailabilityChart
                    dataLastYear={data?.availabilityLastYear}
                    dataThisYear={data?.availabilityThisYear}
                    state={state}
                    setState={setState}
                    loaded={loaded}
                    onRetry={loadData}
                />
            </div>
        </ChartsPageLayout>
    )
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CarparkAvailabilityChart({
    dataThisYear,
    dataLastYear,
    loaded,
    state,
    setState,
    onRetry
}: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});
    const [selectedCarpark, setSelectedCarpark] = useState<string>("");
    const [carparkOptions, setCarparkOptions] = useState<string[]>([]);

    useEffect(() => {
        if (loaded && (dataThisYear?.length || dataLastYear?.length)) {
            const namesThisYear = dataThisYear?.map(d => d.name) || [];
            const namesLastYear = dataLastYear?.map(d => d.name) || [];
            const options: string[] = Array.from(new Set([...namesThisYear, ...namesLastYear]));
            setCarparkOptions(options);

            if (!selectedCarpark && options.length > 0) {
                setSelectedCarpark(options[0]);
            }
        }
    }, [loaded, dataThisYear, dataLastYear]);

    useEffect(() => {
        if (!loaded || !selectedCarpark) return;

        const thisYearRows = dataThisYear.filter(d => d.name === selectedCarpark);
        const lastYearRows = dataLastYear.filter(d => d.name === selectedCarpark);

        const fullLabels: string[] = [];
        const thisYearValues: number[] = [];
        const lastYearValues: number[] = [];

        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;

        for (let month = 1; month <= 12; month++) {
            fullLabels.push(monthNames[month - 1]);

            const thisRow = thisYearRows.find(d => d.year === currentYear && d.month === month);
            const lastRow = lastYearRows.find(d => d.year === prevYear && d.month === month);

            thisYearValues.push(thisRow ? thisRow.availabilityPercentage : 0);
            lastYearValues.push(lastRow ? lastRow.availabilityPercentage : 0);
        }

        setChartData({
            labels: fullLabels,
            datasets: [
                {
                    label: "Last Year",
                    data: lastYearValues,
                    backgroundColor: "rgba(255, 99, 132, 0.4)"
                },
                {
                    label: "This Year",
                    data: thisYearValues,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
            ]
        });

        setState(ChartState.Loaded);
    }, [loaded, selectedCarpark, dataThisYear, dataLastYear]);

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="carpark-select" style={{ marginRight: "0.5rem" }}>Select Carpark:</label>
                <select
                    id="carpark-select"
                    value={selectedCarpark}
                    onChange={e => setSelectedCarpark(e.target.value)}
                >
                    <option value="">-- Select --</option>
                    {carparkOptions.map(code => (
                        <option key={code} value={code}>{code}</option>
                    ))}
                </select>
            </div>

            <ChartWrapper
                title="Carpark Availability - This Year vs Last Year"
                state={state}
                onRetry={onRetry}
            >
                <div className={styles.chartContainer}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: { display: true, text: "Carpark Availability (%)" },
                                datalabels: {
                                    anchor: "center",
                                    align: "center",
                                    color: "black",
                                    font: { weight: "bold" },
                                    formatter: (value: any) => `${value}%`,
                                    rotation: -90
                                }
                            },
                            scales: {
                                x: { title: { display: true, text: "Month" }, stacked: false },
                                y: { title: { display: true, text: "Availability %" }, beginAtZero: true, max: 100 }
                            },
                            maintainAspectRatio: false
                        }}
                        height={400}
                    />
                </div>
            </ChartWrapper>

            <Attribution 
                            link="/docs/endpoints/carparks/parking-spaces#sources--attribution" 
                            style={{ marginTop: "30px" }}
                        />
        </div>
    );
}