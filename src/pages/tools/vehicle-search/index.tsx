import FormGroup from "@site/src/components/ui/FormGroup";
import Layout from "@theme/Layout";
import React, { PropsWithChildren, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import styles from "./styles.module.css";
import config from "../../../../config.json";
import Input from "@site/src/components/ui/Input";
import Button from "@site/src/components/ui/Button";

export default function VehicleSearchPage(): JSX.Element {
    const [plate, setPlate] = useState("");
    const [error, setError] = useState("");
    const [vehicle, setVehicle] = useState<any>();

    function getFuelTypeDisplay(fuelType: string): string {
        const map: Record<string, string> = {
            PETROL: "Petrol",
            HEAVY_OIL: "Diesel",
            ELECTRIC: "Electric",
            HYBRID_ELECTRIC: "Hybrid Electric",
            GAS: "Gas",
            DIESEL_ELECTRIC: "Diesel Electric",
            GAS_BI_FUEL: "Gas Bi Fuel",
            STEAM: "Steam",
            UNKNOWN: "Unknown"
        };
        return map[fuelType] ?? "Unknown";
    }

    async function lookupVehicle() {
        try {
            setError("");

            const response = await fetch(`${config.apiUrl}/v1/vehicles/lookup/${plate}`);
            const data = await response.json();

            if (response.ok) {
                setVehicle(data?.results);
            } else {
                setError(data?.message);
            }
        } catch (e: any) {
            setError("Failed to load vehicle information");
            console.error(e);
        }
    }

    return (
        <Layout title="Vehicle Search">
            <div className={styles.header}>
                <div className={"container container-fluid margin-vert--lg"}>
                    <h1 className={styles.title}>Vehicle Search</h1>
                    <p className={styles.summary}>
                        Enter your vehicle registration number below to find out what information DVS holds about a vehicle.
                    </p>
                </div>
            </div>
            <div className={styles.content}>
                <div className={"container container-fluid margin-vert--lg"}>
                    <div className={styles.grid}>
                        <div className={styles.inputColumn}>
                            {error && (
                                <div className={styles.error}>
                                    <FaExclamationCircle /> {error}
                                </div>
                            )}

                            <FormGroup label="Vehicle Registration Number">
                                <Input
                                    type="text"
                                    value={plate}
                                    placeholder="J129286"
                                    onChange={(e) => setPlate(e.target.value)}
                                />
                            </FormGroup>

                            <Button onClick={() => lookupVehicle()}>
                                Search
                            </Button>
                        </div>
                        <div className={styles.outputColumn}>
                            <h2>Vehicle Information</h2>

                            {vehicle ? (
                                <>
                                    <VehicleInfoRow title="Make">{vehicle?.make}</VehicleInfoRow>
                                    <VehicleInfoRow title="Color">{vehicle?.color}</VehicleInfoRow>
                                    <VehicleInfoRow title="Cylinder Capacity">{vehicle?.cylinderCapacity ? `${vehicle?.cylinderCapacity} (cc)` : "Not specified"}</VehicleInfoRow>
                                    <VehicleInfoRow title="Weight">{vehicle?.weight ?? "Not specified"}</VehicleInfoRow>
                                    <VehicleInfoRow title="CO2 Emissions">{vehicle?.co2Emissions ? `${vehicle.co2Emissions} (g/km)` : "Not specified"}</VehicleInfoRow>
                                    <VehicleInfoRow title="Fuel Type">{getFuelTypeDisplay(vehicle?.fuelType)}</VehicleInfoRow>
                                    <VehicleInfoRow title="Previous Owners">{vehicle?.previousOwners} owners {vehicle?.previousTraders > 0 && `(${vehicle?.previousTraders} of which are traders)`}</VehicleInfoRow>
                                    <VehicleInfoRow title="Registration Date">{vehicle?.firstRegisteredAt}</VehicleInfoRow>
                                    <VehicleInfoRow title="Date Registered in Jersey">{vehicle?.firstRegisteredInJerseyAt}</VehicleInfoRow>
                                </>
                            ) : (
                                <div className={styles.nullVehicle}>
                                    Please enter vehicle number plate to see information.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.disclaimer}>
                <div className={"container container-fluid margin-vert--lg"}>
                    To access this data programatically, or for sources & attribution, please see <a href="/docs/endpoints/vehicles/lookup">the documentation</a>.
                </div>
            </div>
        </Layout>
    )
}

function VehicleInfoRow({ title, children }: PropsWithChildren<{ title: string }>) {
    return (
        <div className={styles.vehicleInfoRow}>
            <div className={styles.vehicleInfoRowTitle}>{title}</div>
            <div className={styles.vehicleInfoRowValue}>{children}</div>
        </div>
    )
}