import React, { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export default function CourtResultCard({ item }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={clsx(styles.result, expanded ? styles.expanded : styles.collapsed)}
            onClick={() => setExpanded(!expanded)}
        >
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.defendant}>{item.defendant}</div>
                </div>

                <div className={styles.metaSmall}>
                    <div><strong>Appearance:</strong> {new Date(item.appearanceDate).toLocaleDateString()}</div>
                    <div><strong>Hearing Purpose:</strong> {item.hearingPurpose}</div>
                </div>
            </div>

            {expanded && (
                <div className={clsx(styles.body, styles.bodyExpanded)}>
                    <div className={clsx(styles.section, styles.striped)}>
                        <strong>Offences:</strong>
                        <ul>
                            {item.offences.map((o, i) => (
                                <li key={i}>{o}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={clsx(styles.section)}>
                        <strong>Sentence:</strong>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: item.result.replaceAll("\n", "<br>")
                            }}
                        />
                    </div>
                </div>
            )}

            {expanded && (
                <div className={clsx(styles.meta, styles.striped)}>
                    <div><strong>Magistrate:</strong> {item.magistrate}</div>
                    <div><strong>Law Officer:</strong> {item.lawOfficer}</div>
                    <div><strong>Court:</strong> {item.courtRoom}</div>

                    {item.nextAppearanceDate && (
                        <div><strong>Next Appearance:</strong> {item.nextAppearanceDate}</div>
                    )}
                </div>
            )}
        </div>
    );
}
