import { useLocation } from "@docusaurus/router";
import SidebarStyles from "@docusaurus/theme-classic/lib/theme/DocPage/Layout/Sidebar/styles.module.css";
import { ThemeClassNames } from "@docusaurus/theme-common";
import DocSidebar from "@theme/DocSidebar";
import clsx from "clsx";
import React from "react";

const items = [
    {
        type: "link",
        label: "Charts Home",
        href: "/charts"
    },
    {
        type: "category",
        label: "Transport",
        items: [
            {
                type: "link",
                label: "Parking Spaces Over Time",
                href: "/charts/transport/parking-over-time"
            },
            {
                type: "link",
                label: "Parking Statistics",
                href: "/charts/transport/parking-stats"
            },
            {
                type: "link",
                label: "Vehicle Colours",
                href: "/charts/transport/vehicle-colors"
            },
            {
                type: "link",
                label: "Vehicle Makes",
                href: "/charts/transport/vehicle-makes"
            },
            {
                type: "link",
                label: "Registered Vehicles",
                href: "/charts/transport/registered-vehicles"
            },
            {
                type: "link",
                label: "Bus Passengers",
                href: "/charts/transport/bus-passengers"
            },
            {
                type: "link",
                label: "Road Traffic",
                href: "/charts/transport/road-traffic"
            },
            {
                type: "link",
                label: "Driving Test Results",
                href: "/charts/transport/driving-test-results"
            },
        ]
    },
    {
        type: "category",
        label: "Weather",
        items: [
            {
                type: "link",
                label: "Monthly Rainfall between 1894 and 2021",
                href: "/charts/weather/monthly-rainfall"
            }
        ]
    },
    {
        type: "category",
        label: "Other",
        items: [
            {
                type: "link",
                label: "Freedom of Information Statistics",
                href: "/charts/other/foi-stats"
            },
            {
                type: "link",
                label: "Petition Statistics",
                href: "/charts/other/petition-stats"
            }
        ]
    }
] as any[];

export default function ChartsSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside
            className={clsx(
                ThemeClassNames.docs.docSidebarContainer,
                SidebarStyles.docSidebarContainer
            )}
        >
            <DocSidebar
                sidebar={items}
                path={currentPath}
                onCollapse={function (): void {
                    throw new Error("Function not implemented.");
                }}
                isHidden={false}
            />
        </aside>
    )
}