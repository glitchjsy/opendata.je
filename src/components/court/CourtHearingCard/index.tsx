import React from "react";
import styles from "./styles.module.css";

export default function HearingsCard({ item }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.defendant}>{item.defendant}</div>
                </div>
            </div>

            <div className={styles.section}>
                <div><strong>Appearance:</strong> {new Date(item.appearanceDate).toLocaleDateString()}</div>
            </div>

            <div className={styles.sectionAlt}>
                <div><strong>Purpose:</strong> {item.hearingPurpose}</div>
            </div>

            <div className={styles.section}>
                <div><strong>Courtroom:</strong> {item.courtRoom}</div>
            </div>
        </div>
    );
}
