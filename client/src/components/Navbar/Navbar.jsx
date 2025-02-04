import styles from "./Navbar.module.css"
import PropTypes from 'prop-types';
import { memo } from "react";

const Navbar =  memo(function Navbar ({characters}) {
    return (
        <header>
            <h1>Where&apos;s Waldo</h1>
            <div>
                {characters.map((character) => character.spotted ? <h3 key={character.name} className={styles.spotted}>{character.name}</h3> : <h3 key={character.name} className={styles.unspotted}>{character.name}</h3> )}
            </div>
        </header>
    )
})


Navbar.propTypes =  {
    characters: PropTypes.array.isRequired
}

export default Navbar