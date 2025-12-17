import React from "react";
import { PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface Props {
    link: string;
    ogl?: boolean;
    style?: any;
}

export function Attribution({ link, ogl, style }: PropsWithChildren<Props>) {
    return (
        <p className={styles.attribution} style={style}>
            {ogl
                ? <>
                    Some of this data is licensed under the <a href="https://www.gov.je/ServiceManual/opendata/Pages/open-government-licence-jersey-ogl-j-v1-0.aspx">Open Government License - Jersey (OGL-J) v1.0</a>. For full sources & attribution,{' '}
                    <a href={link} target="_blank" rel="noopener noreferrer">click here</a>.
                </>
                : <>
                    To view full sources & attribution for this data,{' '}
                    <a href={link} target="_blank" rel="noopener noreferrer">click here</a>.
                </>
            }
        </p>
    );
}
