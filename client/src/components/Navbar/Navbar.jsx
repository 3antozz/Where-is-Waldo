import styles from "./Navbar.module.css"
import PropTypes from 'prop-types';
import { memo } from "react";
import Timer from "../timer/timer";

const Navbar =  memo(function Navbar ({characters, toggleTimer, startTime, timeElapsed}) {
    return (
        <header>
            <h1>Where&apos;s Waldo</h1>
            <Timer toggleTimer={toggleTimer} startTime={startTime} timeElapsed={timeElapsed} />
            <div>
                {characters.map((character) => character.spotted ? <h3 key={character.name} className={styles.spotted}>{character.name}</h3> : <h3 key={character.name} className={styles.unspotted}>{character.name}</h3> )}
            </div>
        </header>
    )
})


Navbar.propTypes =  {
    characters: PropTypes.array.isRequired,
    toggleTimer: PropTypes.bool.isRequired,
    startTime: PropTypes.number,
    timeElapsed: PropTypes.number
}

export default Navbar