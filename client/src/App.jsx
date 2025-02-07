import './App.css'
import { useState, memo, useMemo, useEffect } from 'react'
import Menu from './components/menu/menu'
import { Context } from './context';
import Navbar from './components/navbar/Navbar';
import { LoaderCircle, SearchCheck, MapPinX, Ban, Crosshair } from 'lucide-react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

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
  const [nameError, setNameError] = useState([])
  const [character, setCharacter] = useState('')
  const [error, setError] = useState(false);
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
      name: "Odlaw",
      spotted: false
    },
    {
      name: "Wizard",
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
    try {
      setGameOver(true)
      setError(false)
      setLoading(true);
      setIsRunning(false);
      const request = await fetch(`${import.meta.env.VITE_API_URL}/finish`, {
        credentials: 'include'
      })
      if (!request.ok) {
        throw new Error('An Error has occured, try again later')
      }
      const response = await request.json();
      setTimeElapsed(response.time);
      setLoading(false)
    } catch(err) {
        (err)
        setLoading(false);
        setError(true)
    }
  }
  const startGame = async() => {
    try {
      setError(false)
      setLoading(true)
      const request = await fetch(`${import.meta.env.VITE_API_URL}/start`, {
        credentials: 'include'
      })
      const response = await request.json();
      if (!request.ok) {
        throw new Error('An Error has occured, try again later')
      }
      setDialogOpen(false);
      setIsRunning(true);
      setLoading(false);
      setStartTime(response.startTime)
    } catch(err) {
      setLoading(false);
      setError(true)
    }
  }

  const handleSubmitScore = async(e) => {
    try {
      setGameOver(true);
      setError(false)
      setLoading(true);
      e.preventDefault();
      const request = await fetch(`${import.meta.env.VITE_API_URL}/score`, {
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
    if (!request.ok) {
        const error = new Error('Invalid Request');
        error.messages = response.errors || [error.message];
        throw error;
    }
    (response);
    const request2 = await fetch(`${import.meta.env.VITE_API_URL}/scoreboard`)
    const results = await request2.json();
    if (!request2.ok) {
      throw new Error('An Error has occured, try again later')
    }
    setLoading(false);
    setScoreBoard(true);
    setGameOver(false);
    setTop10(results.scoreboard)
    } catch(err) {
      setNameError(err.messages || [err.message])
      setLoading(false);
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  const remainingChars = useMemo(() => characters.reduce((count, character) => !character.spotted ? count + 1 : count, 0), [characters])
  useEffect(() => {
    if (remainingChars === 0 && !gameOver && !scoreBoard) {
      finishGame();
    }
  }, [remainingChars, gameOver, scoreBoard])
  return (
    <>
      <Navbar characters={characters} toggleTimer={isRunning} startTime={startTime} timeElapsed={timeElapsed}/>
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
            <div className='instructions'>
              <h1>Hello There!</h1>
              <h2>Your task is to find the following characters:</h2>
            </div>
            <div className='characters'>
              <div className='character'>
                  <img src="/images/waldo.gif" alt="waldo" />
                  <h2>Waldo</h2>
              </div>
              <div className='character'>
                  <img src="/images/wenda.webp" alt="wenda" />
                  <h2>Wenda</h2>
              </div>
              <div className='character'>
                  <img src="/images/odlaw.webp" alt="odlaw" />
                  <h2>Odlaw</h2>
              </div>
              <div className='character'>
                  <img src="/images/wizard.gif" alt="wizard" />
                  <h2>Wizard</h2>
            </div>

            </div>
            <button onClick={startGame} disabled={loading}>{loading ? <LoaderCircle className='loading-icon' size={35} color='white' /> : error ? 'Error' :  'START'}</button>
          </div>
        </dialog>
      )}
      {gameOver && (
        <dialog className="backdrop" open>
          <form className="modal over"  onSubmit={handleSubmitScore}>
            <h2>Congrats! you made it! Enter your name to save your score</h2>
            {nameError.length > 0 && nameError.map((error, index) => <li key={index}>{error}</li>) }
            <div>
                <label htmlFor="name" hidden>Name</label>
                <input type="text" value={name} placeholder='Name' onChange={(e) => setName(e.target.value)} minLength={3} maxLength={20} />
            </div>
            <button disabled={loading}>{loading ? <LoaderCircle className='loading-icon' size={35} color='white' /> : error ? 'Error'  : 'Submit'}</button>
          </form>
        </dialog>
      )}
      {scoreBoard && (
        <dialog className="backdrop" open>
          <div className="scoreboard">
                <h2>Top 10 Players</h2>
                <li className='player-score info-row'>
                  <h2>Player</h2>
                  <h2>Time</h2>
                </li>
            {loading ? <LoaderCircle className='loading-icon' size={40} color='white' /> : top10.map((score, index) => {
              const hours = Math.floor(score.time / HOUR);
              const minutes = Math.floor((score.time / MINUTE) % 60);
              const seconds = Math.floor((score.time / SECOND) % 60);
              return (
                <li key={index} className='player-score'>
                  <h3>{index+1}. {score.name}</h3>
                  <div style={{ fontFamily: "monospace" }}>
                    <p>
                    {hours > 0 && <time>{hours}:</time>}
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
      <Context.Provider value={{coords, menuPosition, characters, clickResponse, setOpen, setCharacters, setClickResponse, setCharacter}}>
        {open && <Menu />}
      </Context.Provider>
      <div className='img-container' onClick={handleClick}>
        {characters.map((character) => character.coords ? <svg key={character.name} className='found-icon' style={{left: `${character.coords.X}%`, top: `${character.coords.Y}%` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>{character.name}</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg> : null ) }
        {open && <Crosshair className='crosshair' color='red' style={{left: `${coords.X-1.3}%`, top: `${coords.Y-1.3}%` }} />}
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
