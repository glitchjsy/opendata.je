import React from "react";
import styles from "./styles.module.css";

export default function EVChargerPopup({ location }) {

    return (
        <div className={styles.popup}>
            <p className={styles.name}>{location.name}</p>
            <p className={styles.address}><strong>Address:</strong> {location.address}</p>
            <p className={styles.parish}><strong>Parish:</strong> {location.parish}</p>
        </div>
    );
}
