import { useEffect, useState } from 'react'
import './App.css'
import { Button, Container, Typography } from '@mui/material'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
// Create alphabet
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
]

function App () {
  // Create initial states
  const [blank, setBlank] = useState([])
  const [letters, setLetters] = useState(new Set())
  const [lettersUsed, setLettersUsed] = useState([])
  const [winner, setWinner] = useState(null)
  const [word, setWord] = useState([])
  const [lifes, setLifes] = useState(5)
  // function to fetch words
  const fetchWord = async () => {
    const response = await fetch('https://random-word-api.vercel.app/api?words=1')
    const data = await response.json()
    return data[0]
  }
  // function to get and set the word from fetch
  const getWord = async () => {
    const fetchedWord = await fetchWord()
    setBlank(Array.from(fetchedWord).fill(''))
    setWord(Array.from(fetchedWord))
    setLetters(new Set(Array.from(fetchedWord)))
  }
  // useEffect executes when components are rendered
  useEffect(() => {
    getWord()
  }, [])

  // Execution after a letter of the alphabet was clicked
  const handleClick = (e) => {
    // If there is a winner or we have no lifes we do nothing
    if (lifes === 0 || winner) { return }
    // Get the lleter and lower case it
    const letter = e.target.innerText.toLowerCase()
    // Disable de button
    e.target.disabled = true
    const newLetterUsed = [...lettersUsed]
    // Change the array of used letters with the copy
    newLetterUsed.push(letter)
    setLettersUsed(newLetterUsed)
    // If the letter clicked is in the Set
    if (letters.has(letter)) {
      // Delete the letter from the set
      letters.delete(letter)
      // Reveal every letter that is equal to the input
      for (let i = 0; i < word.length; i++) {
        // Comparison input/word
        if (letter === word[i]) {
          // Blank space takes the value of the letter
          blank[i] = letter
        }
      }
    } else {
      // If the letter is not in the set then substract -1 life
      setLifes(lifes - 1)
      console.log('Wrong')
      // If out of lifes then winners is false
      if (lifes === 0) {
        setWinner(false)
      }
    }
    // If the set is empty that means you guessed every letter, you win
    if (letters.size === 0) {
      setWinner(true)
      confetti()
    }
  }

  const handleRestart = async () => {
    // Restart every state
    setBlank([])
    setLetters(new Set())
    setLettersUsed([])
    setWinner(null)
    setWord([])
    setLifes(5)
    // getWord will reset the state of the word, the blanks and the letters
    await getWord()
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
            blank.map((char, index) => {
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
                <Square key={char} handleClick={handleClick} background={blank.includes(char) ? '#21D19F' : !blank.includes(char) && lettersUsed.includes(char) ? 'red' : '#000103'}>{char}</Square>
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
          'The word was ' + word.join('')
          }
        </Typography>
        <Button variant='contained' onClick={handleRestart}>Restart game</Button>
      </Container>

    </>
  )
}

export default App
