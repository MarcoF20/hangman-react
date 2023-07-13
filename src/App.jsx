import { useState } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'

async function fetchWord () {
  const response = await fetch('https://random-word-api.vercel.app/api?words=1')
  const data = await response.json()
  return data[0]
}

const selectedWord = Array.from(await fetchWord())
const wordToGuess = new Set(Array.from(selectedWord))
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
]

function App () {
  const [word, setWord] = useState(Array(selectedWord.length).fill(''))
  const [winner, setWinner] = useState(false)
  const [lifes, setLifes] = useState(6)
  const [lettersUsed, setLettersUsed] = useState([])

  const handleClick = (e) => {
    if (winner || lifes === 0) { return }
    const newLettersUsed = [...lettersUsed]
    const letter = e.target.innerText.toLowerCase()
    newLettersUsed.push(letter)
    setLettersUsed(newLettersUsed)
    e.target.disabled = true
    if (wordToGuess.has(letter)) {
      const newWord = [...word]
      for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
          newWord[i] = letter
        }
      }
      setWord(newWord)
      wordToGuess.delete(letter)
    } else {
      if (lifes !== 0 && !winner) {
        setLifes(lifes - 1)
        if (lifes === 0) { setWinner(false) }
      }
    }
    if (wordToGuess.size === 0) {
      setWinner(true)
      confetti()
    }
    if (winner) { confetti() }
  }
  return (
    <>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <Typography
          variant='h1'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 32,
            width: 1,
            mt: 2,
            mb: 2,
            color: '#FFFAFF'
          }}
        >
          Hangman
        </Typography>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {
            word.map((char, index) => {
              return (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    caretColor: 'transparent',
                    margin: 2,
                    backgroundColor: '#FFFAFF',
                    fontSize: 32,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  key={index}
                >
                  {char.toUpperCase()}
                </div>
              )
            })
          }
        </Container>
        <Container
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            placeContent: 'center',
            mt: 2
          }}
        >
          {
            alphabet.map(char => {
              return (
                <Square key={char} handleClick={handleClick} background={word.includes(char) ? '#21D19F' : !word.includes(char) && lettersUsed.includes(char) ? 'red' : '#000103'}>{char}</Square>
              )
            })
          }
        </Container>
        <Typography
          variant='h1'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 32,
            width: 1,
            mt: 2,
            mb: 2,
            color: '#FFFAFF'
          }}
        >
          {winner ? 'You win!' : lifes === 0 ? 'You lose! ☠️' : `You have ${lifes} lifes left`}
        </Typography>
        <Typography
          variant='h2'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 32,
            width: 1,
            mt: 2,
            mb: 2,
            color: '#FFFAFF'
          }}
        >
          {
          lifes === 0 &&
          'The word was ' + selectedWord.join('')
        }
        </Typography>
      </Container>

    </>
  )
}

export default App
