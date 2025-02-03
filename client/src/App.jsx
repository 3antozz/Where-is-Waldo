import './App.css'
import { useState } from 'react'
import Menu from './components/menu/menu'
import { Context } from './context';

function App() {
  const [coords, setCoords] = useState({X: 0, Y: 0});
  const [menuPosition, setMenuPosition] = useState({X: 0, Y: 0})
  const [character, setCharacter] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClick = async(e) => {
    setCharacter(null);
    setOpen(!open);
    const image = e.target.getBoundingClientRect();
    const x = e.clientX - image.x;
    const y = e.clientY - image.y;
    const xPercent = (x * 100) / image.width;
    const yPercent = (y * 100) / image.height;
    setMenuPosition(handleMenuPosition(x, y))
    setCoords({X: xPercent, Y: yPercent})
}

  return (
    <>
      <Context.Provider value={{coords, setCharacter, setOpen, menuPosition}}>
        {open && <Menu />}
      </Context.Provider>
      {character && <h3>You found {character}</h3>}
      {/* <h3>X: {coords.X}%</h3>
      <h3>Y: {coords.Y}%</h3> */}
      <img onClick={handleClick} src="/images/not-rly-square.png" alt="" />
    </>
  )
}

function handleMenuPosition (x, y) {
  const menuWidth = 200;
  const menuHeight = 160;
  const padding = 10;

  let xPosition = x + 50;
  let yPosition = y - 180;

  if ((xPosition + menuWidth + padding) > window.innerWidth) {
    xPosition = window.innerWidth - (menuWidth + padding)
  }
  if ((yPosition - menuHeight - padding) < 0) {
    yPosition = padding
  }
  return {X: xPosition, Y: yPosition}
}

export default App
