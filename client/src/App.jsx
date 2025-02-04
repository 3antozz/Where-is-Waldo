import './App.css'
import { useState, memo, useMemo, useEffect } from 'react'
import Menu from './components/menu/menu'
import { Context } from './context';
import Navbar from './components/Navbar/Navbar';

const StaticImage = memo(function Image () {
    return <img src="/images/not-rly-square.png" alt="" />
})

function App() {
  const [coords, setCoords] = useState({X: 0, Y: 0});
  const [menuPosition, setMenuPosition] = useState({X: 0, Y: 0})
  const [character, setCharacter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null)
  const [gameOver, setGameOver] = useState(false);
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
    setOpen((prev) => !prev);
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
  if(response.time) {
    setIsRunning(false)
  }
  console.log(response);
}
const startGame = async() => {
  const request = await fetch('http://localhost:3000/start', {
    credentials: 'include'
  })
  const response = await request.json();
  if (response.response) {
    setDialogOpen(false);
    setIsRunning(true);
    setStartTime(response.startTime)
  }
  console.log(response);
}

  const remainingChars = useMemo(() => characters.reduce((count, character) => !character.spotted ? count + 1 : count, 0), [characters])
  useEffect(() => {
    if (remainingChars === 0) {
      setGameOver(true);
      finishGame();
    }
  }, [remainingChars])
  return (
    <>
      <Navbar characters={characters} toggleTimer={isRunning} startTime={startTime} />
      {dialogOpen && (
        <dialog className="backdrop" open>
          <div className="modal">
            <p>Welcome to Where is Waldo</p>
            <p>Your task is to look for the following characters:</p>
            <button onClick={startGame}>Start</button>
          </div>
        </dialog>
      )}
      {gameOver && (
        <dialog className="backdrop" open>
          <form className="modal">
            <p>Congrats! you made it! Enter your name to save your score</p>
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" />
            </div>
            <button>Submit</button>
          </form>
        </dialog>
      )}
      <Context.Provider value={{coords, setCharacter, setOpen, menuPosition, characters, setCharacters}}>
        {open && <Menu />}
      </Context.Provider>
      {character && <h3>You found {character}</h3>}
      {/* <h3>X: {coords.X}%</h3>
      <h3>Y: {coords.Y}%</h3>  */}
      <div className='img-container' onClick={handleClick}>
        {characters.map((character) => character.coords ? <svg key={character.name} className='found-icon' style={{left: `${character.coords.X}%`, top: `${character.coords.Y}%` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>{character.name}</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg> : null ) }
        <StaticImage />
      </div>
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
