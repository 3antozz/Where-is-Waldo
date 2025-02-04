import styles from "./menu.module.css"
import { useContext } from "react";
import { Context } from "../../context";

export default function Menu () {
    const { coords, menuPosition, setCharacter, setOpen, characters, setCharacters } = useContext(Context);
    const handleClick = async(e) => {
        e.preventDefault();
        setOpen(false);
        const request = await fetch('http://localhost:3000/check', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            character: e.target.value.toLowerCase(),
            x: coords.X,
            y: coords.Y
          })
        })
        const response = await request.json();
        console.log(response);
        if (response.response) {
            setCharacters(characters.map(character => character.name === e.target.value ? {name: character.name, spotted: true} : character))
            return setCharacter(e.target.value)
        } else {
            return setCharacter('No one!')
        }
    }
    return (
        <>
            <form id="character" name="character" className={styles.menu} onChange={handleClick} size={4} style={{left: `${menuPosition.X}px`, top: `${menuPosition.Y}px` }}>
                <legend hidden>Choose a character:</legend>
                {characters.map((character) => !character.spotted ? <label key={character.name}><input type="radio" name="option" value={character.name}/>{character.name}</label> : null )}
            </form>
        </>
    )
}

