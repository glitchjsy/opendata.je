import React from "react";
import styles from "./styles.module.css";
import { FaChildren, FaSquareParking, FaWheelchairMove } from "react-icons/fa6";
import { FaChargingStation } from "react-icons/fa";

export default function EVChargerPopup({ location }) {

    function getStatusInfo(status) {
        switch (status.toLowerCase()) {
            case "available":
                return { text: "Available", color: "green" };
            case "charging":
                return { text: "Charging", color: "orange" };
            case "suspendedev":
                return { text: "Finished Charging / Blocked", color: "black" };
        }
        return { text: "Unknown", color: "gray" };
    }

    return (
        <div className={styles.popup}>
            <p className={styles.name}>{location.name}</p>
            <p className={styles.address}><strong>Address:</strong> {location.address}</p>
            <p className={styles.parish}><strong>Parish:</strong> {location.parish}</p>
            {/* <p>Provider: {location.provider}</p>
            <p>Operator: {location.operatorName}</p>
            <p>{location.isPrivate ? "Private" : "Public"}</p> */}

            <div className={styles.spacesDivider} />

            <div className={styles.connectorsTitle}>Connectors ({location.connectors.length}):</div>

            <div className={styles.connectors}>
                {location.connectors.map((connector) => {
                    const statusInfo = getStatusInfo(connector.currentStatus.operativeStatus);
                    return (
                        <div key={connector.id} className={styles.connector}>
                            <div className={styles.connectorStatusLine} style={{ backgroundColor: statusInfo.color }} />
                            <div>
                                <p className={styles.connectorType}>
                                    <strong>Type:</strong> {connector.type} ({connector.currentType})
                                </p>
                                <p className={styles.connectorPower}>
                                    <strong>Max Power:</strong> {connector.maxKw} kW
                                </p>
                                <p className={styles.connectorStatus}>
                                    <strong>Status:</strong> {statusInfo.text}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
