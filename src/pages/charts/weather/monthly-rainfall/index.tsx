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
import { useColorMode } from "@docusaurus/theme-common";
import { Attribution } from "@site/src/components/Attribution";

interface ChartDisplayProps {
    data: any;
    state: ChartState;
    setState: (state: ChartState) => void;
    loaded: boolean;
    onRetry: () => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
            const response = await fetch(`${config.apiUrl}/v1/charts/monthly-rainfall`);

            setData((await response.json()).results);
            setLoaded(true);
        } catch (e: any) {
            setState(ChartState.Failed);
            setLoaded(false);
        }
    }

    return (
        <ChartsPageLayout
            title="Monthly Rainfall Between 1894 and 2021"
            subCategory="Weather"
        >
            <Heading as="h1">Monthly Rainfall Between 1894 and 2021</Heading>
            <p>Jersey rainfall data (mm) for the period 1984 to 2021</p>

            <div className={styles.pageWidth}>
                <LineChartDisplay data={data} state={state} setState={setState} loaded={loaded} onRetry={loadData} />
            </div>

            <Attribution
                link="/docs/endpoints/charts/monthly-rainfall#sources--attribution"
                ogl
                style={{ marginTop: "30px" }}
            />
        </ChartsPageLayout>
    )
}

function LineChartDisplay(props: ChartDisplayProps) {
    const [chartData, setChartData] = useState<any>({});
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedYearIndex, setSelectedYearIndex] = useState(0);
    const [availableYears, setAvailableYears] = useState([]);

    const { colorMode } = useColorMode();

    useEffect(() => {
        if (!selectedYear && availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears, selectedYear]);

    useEffect(() => {
        if (props.loaded) {
            setAvailableYears(Array.from(new Set(props.data.map(item => item.Year))).sort().reverse());

            if (!selectedYear) return;

            const yearData = props.data.find(d => d.Year === selectedYear);
            if (!yearData) return;

            const monthlyValues = MONTHS.map(month => yearData[month]);

            setChartData({
                labels: MONTHS,
                datasets: [
                    {
                        label: `Rainfall (mm) in ${selectedYear}`,
                        data: monthlyValues,
                        borderColor: "teal",
                        backgroundColor: "rgba(0,128,128,0.3)",
                        fill: true,
                        tension: 0.3,
                    }
                ]
            });
            props.setState(ChartState.Loaded);
        }
    }, [selectedYear, props.loaded]);

    function handlePrev() {
        if (selectedYearIndex > 0) {
            const newIndex = selectedYearIndex - 1;
            setSelectedYear(availableYears[newIndex]);
            setSelectedYearIndex(newIndex);
        }
    }

    function handleNext() {
        if (selectedYearIndex < availableYears.length - 1) {
            const newIndex = selectedYearIndex + 1;
            setSelectedYear(availableYears[newIndex]);
            setSelectedYearIndex(newIndex);
        }
    }

    return (
        <ChartWrapper
            title="Monthly Rainfall"
            state={props.state}
            onRetry={props.onRetry}
        >
            <div>
                <div className={styles.chartOptionsWrapper}>
                    <div className={styles.yearPicker}>
                        <label>Select Year: </label>
                        <select
                            onChange={e => {
                                const selectedValue = parseInt(e.target.value);
                                const index = availableYears.findIndex(year => year === selectedValue);
                                setSelectedYear(selectedValue);
                                setSelectedYearIndex(index);
                            }}
                            value={selectedYear || ""}
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button onClick={handlePrev} disabled={selectedYearIndex === 0} data-theme={colorMode === "dark" ? "dark" : "light"}>
                            {"<"}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={selectedYearIndex === availableYears.length - 1}
                            data-theme={colorMode === "dark" ? "dark" : "light"}
                        >
                            {">"}
                        </button>
                    </div>
                </div>

                {chartData ? (
                    <div className={styles.chartContainer}>
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: true, text: 'Monthly Rainfall' },
                                    datalabels: null
                                },
                                maintainAspectRatio: false
                            }}
                            height={400}
                        />
                    </div>
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </ChartWrapper>
    )
}