import ChartsPageLayout from "@site/src/components/ChartsPageLayout";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import React, { PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { FaParking } from "react-icons/fa";
import { useColorMode } from "@docusaurus/theme-common";

export default function Charts() {
    return (
        <ChartsPageLayout title="Charts" isChartsPage>
            <Heading as="h1">Charts</Heading>
            <p>
                Welcome to the Charts section! We are constantly adding new charts, graphs and statistics.
            </p>
            <p>
                Select a page from below or by using the sidebar on the left.
            </p>

            <Section title="Parking">
                <Card
                    title="Parking Spaces Over Time"
                    summary="View carpark usage over time"
                    href="/charts/transport/parking-over-time"
                    color="darkred"
                />
                <Card
                    title="Parking Statistics"
                    summary="View carpark availability this year vs last year"
                    href="/charts/transport/parking-stats"
                    color="darkred"
                />
            </Section>

            <Section title="Vehicles">
                <Card
                    title="Vehicle Colours"
                    summary="View the most popular vehicle colours"
                    href="/charts/transport/vehicle-colors"
                />
                <Card
                    title="Vehicle Makes"
                    summary="View the most popular vehicle makes"
                    href="/charts/transport/vehicle-makes"
                />
                <Card
                    title="Registered Vehicles"
                    summary="View the total number of vehicles registered in Jersey"
                    href="/charts/transport/registered-vehicles"
                />
            </Section>

            <Section title="Other Transport">
                <Card
                    title="Bus Passengers"
                    summary="View bus passenger statistics by month, year or all time"
                    href="/charts/transport/bus-passengers"
                    color="darkblue"
                />
                <Card
                    title="Road Traffic"
                    summary="View road traffic on the underpass and tunnel between 2019 and 2022"
                    href="/charts/transport/road-traffic"
                    color="darkblue"
                />
                <Card
                    title="Driving Test Results"
                    summary="View driving test results between 1975 and 2017"
                    href="/charts/transport/driving-test-results"
                    color="darkblue"
                />
            </Section>

            <Section title="Weather">
                <Card
                    title="Monthly Rainfall between 1894 and 2021"
                    summary="View rainfall data for the period 1984 to 2021"
                    href="/charts/weather/monthly-rainfall"
                    color="purple"
                />
            </Section>

            <Section title="Other">
                <Card
                    title="FOI Statistics"
                    summary="View Freedom of Information statistics"
                    href="/charts/other/foi-stats"
                    color="darkorange"
                />
                <Card
                    title="Petition Statistics"
                    summary="View Parliment petitions statistics"
                    href="/charts/other/petition-stats"
                    color="darkorange"
                />
            </Section>
        </ChartsPageLayout>
    )
}

function Card({ title, color, summary, href }: any) {
    return (
        <a href={href} className={styles.card}>
            <div className={styles.cardColor} style={{ backgroundColor: color }}></div>
            <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{title}</div>
                <div className={styles.cardSummary}>{summary}</div>
            </div>
        </a>
    )
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
    const { colorMode } = useColorMode();

    return (
        <div className={styles.section} data-theme={colorMode}>
            <div className={styles.sectionTitle}>{title}</div>
            <div className={styles.sectionContent}>{children}</div>
        </div>
    )
}