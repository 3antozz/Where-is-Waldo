import './App.css'
import { useState, memo, useMemo, useEffect } from 'react'
import Menu from './components/menu/menu'
import { Context } from './context';
import Navbar from './components/Navbar/Navbar';
import { LoaderCircle, SearchCheck, MapPinX, Ban } from 'lucide-react';

const SECOND = 1000;
const MINUTE = SECOND * 60;

const StaticImage = memo(function Image () {
    return <img src="/images/not-rly-square.png" alt="" />
})

function App() {
  const [coords, setCoords] = useState({X: 0, Y: 0});
  const [menuPosition, setMenuPosition] = useState({X: 0, Y: 0})
  const [dialogOpen, setDialogOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null)
  const [gameOver, setGameOver] = useState(false);
  const [scoreBoard, setScoreBoard] = useState(false)
  const [top10, setTop10] = useState([])
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(null);
  const [clickResponse, setClickResponse] = useState(false);
  const [character, setCharacter] = useState('')
  const [name, setName] = useState('')
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
    if(clickResponse === 'loading') return;
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
  setIsRunning(false)
  const request = await fetch('http://localhost:3000/finish', {
    credentials: 'include'
  })
  const response = await request.json();
  setTimeElapsed(response.time);
  console.log(response);
}
const startGame = async() => {
  setLoading(true)
  const request = await fetch('http://localhost:3000/start', {
    credentials: 'include'
  })
  const response = await request.json();
  if (response.response) {
    setDialogOpen(false);
    setIsRunning(true);
    setLoading(false);
    setStartTime(response.startTime)
  }
  console.log(response);
}

const handleSubmitScore = async(e) => {
  setLoading(true);
  e.preventDefault();
  const request = await fetch('http://localhost:3000/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    }),
    credentials: 'include'
  })
  const response = await request.json();
  console.log(response);
  if(request.ok) {
    const request = await fetch('http://localhost:3000/scoreboard')
    const results = await request.json();
    if(results.scoreboard) {
      setLoading(false);
      setScoreBoard(true);
      setGameOver(false);
      setTop10(results.scoreboard)
    }
    console.log(results);
  }
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
      {clickResponse && 
            <div className={`feedback ${clickResponse}`}>
                {clickResponse === 'loading' ? 
                <>
                    <LoaderCircle className='loading-icon' size={40} color='white' />
                    <p>Checking</p>
                </> : clickResponse === 'correct' ?
                <>
                    <SearchCheck className='correct' size={40} color='white' />
                    <p>You have found <em>{character}</em>!</p>    
                </> : clickResponse === 'incorrect' ?
                <>
                    <MapPinX className='wrong' size={40} color='white' />
                    <p>Sorry, that is not <em>{character}</em></p>    
                </> : 
                <>
                  <Ban className='wrong' size={40} color='white' />
                  <p>{clickResponse}</p>    
                </>
              }
            </div>}
      {dialogOpen && (
        <dialog className="backdrop" open>
          <div className="modal">
            <p>Welcome to Where is Waldo</p>
            <p>Your task is to look for the following characters:</p>
            <button onClick={startGame} disabled={loading}>{loading ? <LoaderCircle className='loading-icon' size={40} color='black' /> : 'Start'}</button>
          </div>
        </dialog>
      )}
      {gameOver && (
        <dialog className="backdrop" open>
          <form className="modal"  onSubmit={handleSubmitScore}>
            <p>Congrats! you made it! Enter your name to save your score</p>
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button disabled={loading}>{loading ? <LoaderCircle className='loading-icon' size={40} color='black' /> : 'Submit'}</button>
          </form>
        </dialog>
      )}
      {scoreBoard && (
        <dialog className="backdrop" open>
          <div className="scoreboard">
                <li className='player-score info-row'>
                  <h2>Player</h2>
                  <h2>Time</h2>
                </li>
            {loading ? <LoaderCircle className='loading-icon' size={40} color='black' /> : top10.map((score, index) => {
              const minutes = Math.floor((score.time / MINUTE) % 60);
              const seconds = Math.floor((score.time / SECOND) % 60);
              return (
                <li key={index} className='player-score'>
                  <h2>{score.name}</h2>
                  <div style={{ fontFamily: "monospace" }}>
                    <p>
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                    </p>
                  </div>
                </li>
              )
            }) }
          </div>
        </dialog>
      )}
      <Context.Provider value={{coords, menuPosition, characters, clickResponse, timeElapsed, setOpen, setCharacters, setClickResponse, setCharacter}}>
        {open && <Menu />}
      </Context.Provider>
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
