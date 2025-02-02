import './App.css'
import { useState } from 'react'

const positions = [
  {
    name: "Waldo",
    x0: 42.41095231840842,
    x1: 44.11557258844091,
    y0: 79.71909081782127,
    y1: 73.7377654277232
  },
  {
    name: "Wenda",
    x0: 43.22917004802402,
    x1: 43.97920296683831,
    y0: 60.9318489010952,
    y1: 59.185466042366016
  },
  {
    name: "Wizard",
    x0: 65.25286393684382,
    x1: 66.07108166645942,
    y0: 79.25755703402838,
    y1: 76.84879918254258
  },
  {
    name: "Odlaw",
    x0: 57.95708918110475,
    x1: 59.457155018733346,
    y0: 97.10576983978319,
    y1: 94.82336936380898
  }
]

function App() {
  const [coords, setCoords] = useState({X: 0, Y: 0})
  const [character, setCharacter] = useState(null)
  const handleClick = (e) => {
    setCharacter(null);
    const image = e.target.getBoundingClientRect();
    const x = e.clientX - image.x;
    const y = e.clientY - image.y;
    const xPercent = (x * 100) / image.width;
    const yPercent = (y * 100) / image.height;
    setCoords({X: xPercent, Y: yPercent})
    for (const character of positions) {
      if (xPercent >= character.x0 && xPercent <= character.x1 && yPercent <= character.y0 && yPercent >= character.y1) {
        return setCharacter(character.name)
      }
    }
}

  return (
    <>
      {character && <h3>You found {character}</h3>}
      <h3>X: {coords.X}%</h3>
      <h3>Y: {coords.Y}%</h3>
      <img onClick={handleClick} src="/images/3cJkBGJ.jpeg" alt="" />
    </>
  )
}

export default App
