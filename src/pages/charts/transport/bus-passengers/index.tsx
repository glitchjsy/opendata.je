import ChartsPageLayout from "@site/src/components/ChartsPageLayout";
import ChartWrapper, { ChartState } from "@site/src/components/ChartWrapper";
import { useColorMode } from "@docusaurus/theme-common";
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

export default function BusPassengersWeeklyCharts() {
    const [data, setData] = useState({});
    const [state, setState] = useState(ChartState.Loading);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const response = await fetch(`${config.apiUrl}/v1/charts/bus-passengers`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Bus Passengers Weekly"
            subCategory="Transport"
        >
            <Heading as="h1">Bus Passengers</Heading>
            <p>
                To access this information programmatically, please see the <a href="/docs/endpoints/charts/bus-passengers">documentation</a>.
            </p>

            <div className={styles.pageWidth}>
                <LineChartDisplay data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>

            <Attribution
                link="/docs/endpoints/charts/bus-passengers#sources--attribution"
                ogl
                style={{ marginTop: "30px" }}
            />
        </ChartsPageLayout>
    )
}

type ViewMode = "all" | "monthly" | "yearly";

function LineChartDisplay(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});
    const [data, setData] = useState(props.data);

    const [viewMode, setViewMode] = useState<ViewMode>("all");
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [selection, setSelection] = useState(0);

    const { colorMode } = useColorMode();

    useEffect(() => {
        if (props.loaded) {
            const dates = Object.keys(props.data);
            const values = Object.values(props.data);

            // Group data by year and month
            const groupedData = dates.reduce((acc, date, index) => {
                const [year, month] = date.split("-");
                const yearKey = year;
                const monthKey = `${year}-${month}`;

                // Group by month
                if (!acc[monthKey]) acc[monthKey] = [];
                acc[monthKey].push({ date, value: values[index] });

                // Group by year
                if (!acc[yearKey]) acc[yearKey] = [];
                acc[yearKey].push({ date, value: values[index] });

                return acc;
            }, {});

            const monthKeys = Object.keys(groupedData).filter(key => key.includes("-"));
            const yearKeys = Object.keys(groupedData).filter(key => !key.includes("-"));

            setData(groupedData);
            setMonths(monthKeys);
            setYears(yearKeys);

            updateChartData(dates, values);

            props.setState(ChartState.Loaded);
        }
    }, [props.loaded]);

    function updateChartData(labels, values) {
        setChartData({
            labels,
            datasets: [
                {
                    label: "Passengers",
                    data: values,
                    borderColor: "blue",
                    backgroundColor: "blue",
                    fill: false,
                    tension: 0.4
                }
            ]
        });
    }

    function updateChartDataByKey(key) {
        const selectedData = data[key];
        const labels = selectedData.map(item => item.date);
        const values = selectedData.map(item => item.value);

        updateChartData(labels, values);
    }

    function handleViewAll() {
        setViewMode("all");
        const allDates = Object.keys(data).flatMap((key) => data[key].map((item) => item.date));
        const allValues = Object.keys(data).flatMap((key) => data[key].map((item) => item.value));
        updateChartData(allDates, allValues);
    }

    function handleViewMonthly() {
        setViewMode("monthly");
        setSelection(0);
        updateChartDataByKey(months[0]);
    }

    function handleViewYearly() {
        setViewMode("yearly");
        setSelection(0);
        updateChartDataByKey(years[0]);
    }

    function handleNext() {
        const keys = viewMode === "monthly" ? months : years;
        if (selection < keys.length - 1) {
            const nextSelection = selection + 1;
            setSelection(nextSelection);
            updateChartDataByKey(keys[nextSelection]);
        }
    }

    function handlePrev() {
        if (selection > 0) {
            const prevSelection = selection - 1;
            setSelection(prevSelection);
            const keys = viewMode === "monthly" ? months : years;
            updateChartDataByKey(keys[prevSelection]);
        }
    }

    function getDate() {
        if (viewMode === "monthly") {
            return parseDateToWords(months[selection]);
        }
        if (viewMode === "yearly") {
            return years[selection];
        }
        return "";
    }

    function parseDateToWords(dateString: string) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const [year, month] = dateString.split('-');
        const monthName = months[parseInt(month) - 1];

        return `${monthName} ${year}`;
    }

    return (
        <ChartWrapper
            title="Bus Passengers"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div className={styles.chartOptionsWrapper}>
                <div className={styles.viewTypeWrapper} data-theme={colorMode === "dark" ? "dark" : "light"}>
                    <button onClick={handleViewAll} disabled={viewMode === "all"} data-theme={colorMode === "dark" ? "dark" : "light"}>
                        All
                    </button>
                    <button onClick={handleViewMonthly} disabled={viewMode === "monthly"} data-theme={colorMode === "dark" ? "dark" : "light"}>
                        Monthly
                    </button>
                    <button onClick={handleViewYearly} disabled={viewMode === "yearly"} data-theme={colorMode === "dark" ? "dark" : "light"}>
                        Yearly
                    </button>
                </div>

                {(viewMode === "monthly" || viewMode === "yearly") && (
                    <div>
                        <button onClick={handlePrev} disabled={selection === 0} data-theme={colorMode === "dark" ? "dark" : "light"}>
                            {"<"}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={selection === (viewMode === "monthly" ? months.length - 1 : years.length - 1)}
                            data-theme={colorMode === "dark" ? "dark" : "light"}
                        >
                            {">"}
                        </button>
                    </div>
                )}
            </div>

            <p className={styles.selectedDate}>{getDate()}</p>

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
                                text: "Passengers Over Time"
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
                                    text: "Passengers"
                                },
                                beginAtZero: false
                            }
                        },
                        maintainAspectRatio: false
                    }}
                    height={600}
                />
            </div>
        </ChartWrapper>
    )
}