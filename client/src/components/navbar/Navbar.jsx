import styles from "./Navbar.module.css"
import PropTypes from 'prop-types';
import { memo } from "react";
import Timer from "../timer/timer";

const images = {
    Waldo: '/images/waldo.gif',
    Wenda: '/images/wenda.webp',
    Odlaw: '/images/odlaw.webp',
    Wizard: '/images/wizard.gif'
}

const Navbar =  memo(function Navbar ({characters, toggleTimer, startTime, timeElapsed}) {
    return (
        <header>
            <h1>Where&apos;s Waldo</h1>
            <Timer toggleTimer={toggleTimer} startTime={startTime} timeElapsed={timeElapsed} />
            <div>
                {characters.map((character) => 
                <div key={character.name} className={styles.character}>
                    <img src={images[character.name]} alt={character.name} />
                    {character.spotted ? 
                    <>
                        <h3 key={character.name} className={styles.spotted}>{character.name}</h3>
                        <svg key={character.name} className={styles.found} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>{character.name}</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>
                    </>
                    : <h3 key={character.name} className={styles.unspotted}>{character.name}</h3>}
                </div> )}
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