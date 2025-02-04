import './App.css'
import { useState } from 'react'
import Menu from './components/menu/menu'
import { Context } from './context';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [coords, setCoords] = useState({X: 0, Y: 0});
  const [menuPosition, setMenuPosition] = useState({X: 0, Y: 0})
  const [character, setCharacter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [characters, setCharacters] = useState([
    {
      name: "Waldo",
      spotted: false
    },
    {
      name: "Wenda",
      spotted: false
    },
    {
      name: "Wizard",
      spotted: false
    },
    {
      name: "Odlaw",
      spotted: false
    },

])
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

const finishGame = async() => {
  const request = await fetch('http://localhost:3000/finish', {
    credentials: 'include'
  })
  const response = await request.json();
  console.log(response);
}

const startGame = async() => {
  const request = await fetch('http://localhost:3000/start', {
    credentials: 'include'
  })
  const response = await request.json();
  setDialogOpen(false);
  console.log(response);
}

  return (
    <>
      <Navbar characters={characters} />
      {dialogOpen && (
        <dialog className="backdrop" open>
          <div className="modal">
            <p>Welcome to Where is Waldo</p>
            <p>Your task is to look for the following characters:</p>
            <button onClick={startGame}>Start</button>
          </div>
        </dialog>
      )}
      <Context.Provider value={{coords, setCharacter, setOpen, menuPosition, characters, setCharacters}}>
        {open && <Menu />}
      </Context.Provider>
      {character && <h3>You found {character}</h3>}
      {/* <h3>X: {coords.X}%</h3>
      <h3>Y: {coords.Y}%</h3> */}
      <img onClick={handleClick} src="/images/not-rly-square.png" alt="" />
      <button onClick={finishGame}>finish</button>
    </>
  )
}

function handleMenuPosition (x, y) {
  const menuWidth = 200;
  const menuHeight = 100;
  const padding = 10;

  let xPosition = x + 50;
  let yPosition = y - 100;

  if ((xPosition + menuWidth + padding) > window.innerWidth) {
    xPosition = window.innerWidth - (menuWidth + padding)
  }
  if ((yPosition - menuHeight - padding) < 0) {
    yPosition = 100
  }
  return {X: xPosition, Y: yPosition}
}

export default App
