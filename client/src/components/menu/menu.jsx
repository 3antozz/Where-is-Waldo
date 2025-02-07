import styles from "./menu.module.css"
import { useContext } from "react";
import { Context } from "../../context";

export default function Menu () {
    const { coords, menuPosition, setOpen, characters, setCharacters, clickResponse, setClickResponse, setCharacter } = useContext(Context);
    const handleClick = async(e) => {
        setClickResponse('loading');
        e.preventDefault();
        setOpen(false);
        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/check`, {
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
              setCharacter(e.target.value)
              if (!request.ok) {
                throw new Error('An error has occured, please try again later!')
              }
              if (response.response) {
                  setCharacters(characters.map(character => character.name === e.target.value ? {name: character.name, spotted: true, coords: {X: coords.X, Y: coords.Y}} : character))
                  setClickResponse('correct');
              } else {
                  setClickResponse('incorrect');
              }
              setTimeout(() => {
                    if(clickResponse !== 'loading') {
                        setClickResponse(false)
                    }
              }, 5000);
        } catch(err) {
            setClickResponse(err.message)
            setTimeout(() => {
                if(clickResponse !== 'loading') {
                    setClickResponse(false)
                }
            }, 3000);
        }
    }
    return (
        <>
            <form id="character" name="character" className={styles.menu} onChange={handleClick} style={{left: `${menuPosition.X}px`, top: `${menuPosition.Y}px` }}>
                <legend hidden>Choose a character:</legend>
                {characters.map((character) => !character.spotted ? <label key={character.name}><input type="radio" name="option" value={character.name}/>{character.name}</label> : null )}
            </form>
        </>
    )
}

