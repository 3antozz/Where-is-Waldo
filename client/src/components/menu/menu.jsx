import styles from "./menu.module.css"
import { useContext } from "react";
import { Context } from "../../context";

export default function Menu () {
    const { coords, menuPosition, setCharacter, setOpen } = useContext(Context);
    const handleClick = async(e) => {
        e.preventDefault();
        setOpen(false);
        const request = await fetch('http://localhost:3000/check', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            character: e.target.value,
            x: coords.X,
            y: coords.Y
          })
        })
        const response = await request.json();
        console.log(response);
        if (response.response) {
          return setCharacter(e.target.value)
        } else {
          return setCharacter('No one!')
        }
    }
    return (
        <>
            <form id="character" name="character" className={styles.menu} onChange={handleClick} size={4} style={{left: `${menuPosition.X}px`, top: `${menuPosition.Y}px` }}>
                <legend hidden>Choose a character:</legend>
                <label><input type="radio" name="option" value="waldo"/>Waldo</label>
                <label><input type="radio" name="option" value="wenda"/>Wenda</label>
                <label><input type="radio" name="option" value="wizard"/>Wizard</label>
                <label><input type="radio" name="option" value="odlaw"/>Odlaw</label>
            </form>
        </>
    )
}

