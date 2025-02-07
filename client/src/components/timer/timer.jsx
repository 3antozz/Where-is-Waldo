import { useEffect, useState, useRef } from "react"
import PropTypes from 'prop-types';
import styles from "./timer.module.css"

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
export default function Timer ({toggleTimer, startTime, timeElapsed}) {
    const startTimeRef = useRef(startTime);
    const [time, setTime] = useState(0);
    const hours = Math.floor(time / HOUR);
    const minutes = Math.floor((time / MINUTE) % 60);
    const seconds = Math.floor((time / SECOND) % 60);
    useEffect(() => {
        if (toggleTimer) {
            startTimeRef.current = startTime;
            const interval = setInterval(() => setTime(Date.now() - startTimeRef.current), 1000)
            return () => clearInterval(interval)
        }
        if (timeElapsed) {
            setTime(timeElapsed)
        }
    }, [toggleTimer, startTime, timeElapsed])
    return (
        <div className={styles.time} style={{ fontFamily: "monospace" }}>
            <time>
                {hours > 0 && <time>{hours}:</time>}
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </time>
        </div>
    )
}

Timer.propTypes =  {
    toggleTimer: PropTypes.bool.isRequired,
    startTime: PropTypes.number,
    timeElapsed: PropTypes.number
}
