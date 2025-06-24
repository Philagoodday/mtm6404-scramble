/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 * depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}
/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const ALL_WORDS = [
  'apple', 'banana', 'orange', 'grape', 'strawberry',
  'blueberry', 'pineapple', 'sister',
'brother', 'father',
'mother', 'grandfather', 'grandmother', 'grandson', 'daughter', 'moon',
];
const MAX_STRIKES = 90;
const INITIAL_PASSES = 999;

function ScrambleGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);


  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [wordsPlayed, setWordsPlayed] = useState([]);
  const [guessInput, setGuessInput] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Load game state from local storage when game starts
  useEffect(() => {
    const storedPoints = localStorage.getItem('points');


    const storedStrikes = localStorage.getItem('strikes');
    const storedPasses = localStorage.getItem('passes');

    const storedWordsPlayed = localStorage.getItem('wordsPlayed');
    const storedCurrentWord = localStorage.getItem('currentWord');
    const storedScrambledWord = localStorage.getItem('scrambledWord');

    if (storedPoints !== null) setPoints(parseInt(storedPoints));
    if (storedStrikes !== null) setStrikes(parseInt(storedStrikes));
  if (storedPasses !== null) setPasses(parseInt(storedPasses));
    if (storedWordsPlayed !== null) setWordsPlayed(JSON.parse(storedWordsPlayed));
    if (storedCurrentWord !== null && storedScrambledWord !== null) {
      setCurrentWord(storedCurrentWord);
      setScrambledWord(storedScrambledWord);
    } else {
      initializeNewWord(); // Start a new word if nothing stored
    }
  }, []);

  // Save game state to local storage whenever itchanges
  useEffect(() => {
    localStorage.setItem('points', points);
    localStorage.setItem('strikes', strikes);
    localStorage.setItem('passes', passes);
    localStorage.setItem('wordsPlayed', JSON.stringify(wordsPlayed));
    localStorage.setItem('currentWord', currentWord);
    localStorage.setItem('scrambledWord', scrambledWord);
  }, [points, strikes, passes, wordsPlayed, currentWord, scrambledWord
  
  ]);

  // Check if game over
  useEffect(() => {
    if (strikes >= MAX_STRIKES) {
      setGameOver(true);
      setMessage(`Game Over! You reached ${MAX_STRIKES} strikes.`);
    } else if (wordsPlayed.length === ALL_WORDS.length) {
      setGameOver(true);
      setMessage('Congratulations! You played all the words!');
    }
  }, [strikes, wordsPlayed]);

  // Get A new scrambled words
  const initializeNewWord = () => {
    const availableWords = ALL_WORDS.filter(word => !wordsPlayed.includes(word));
    if (availableWords.length === 0) {
      setGameOver(true);
      setMessage('Congratulations! You played all the words!');
      return;
    }
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setScrambledWord(shuffle(newWord));
    setMessage('');
  };

  // Update guessinput
  const handleInputChange = (event) => {
    setGuessInput(event.target.value);
  };

  // Handle player's guess
  const handleGuess = () => {
    if (gameOver || !guessInput.trim()) return;

    if (guessInput.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(prevPoints => prevPoints + 1);
      setMessage('Correct!');
      setWordsPlayed(prevWords => [...prevWords, currentWord]);
      setGuessInput('');
      initializeNewWord();} else {
      setStrikes(prevStrikes => prevStrikes + 1);
      setMessage('Incorrect!');
      setGuessInput('');
    }
  };

  // Handle Enter key press for guess


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  // Handle pass button click
  const handlePass = () => {
    if (gameOver || passes <= 0) {return;}
    setPasses(prevPasses => prevPasses - 1);
    setWordsPlayed(prevWords => [...prevWords, currentWord]);
    initializeNewWord();
    setMessage('Word skipped!');
  };

  // Reset game to play again
  const handleReset = () => {
    localStorage.clear();
    setPoints(0);
    setStrikes(0);
    setPasses(INITIAL_PASSES);
    setWordsPlayed([]);
    setGameOver(false);
    setGuessInput('');
    setMessage('');
    initializeNewWord();
  };

return (
    <div className="scramble-game">
      <h1>Scramble Game</h1>

      {!gameOver ? (
        <>
          <div className="game-stats">
            <p>Points: {points}</p>
            <p>Strikes: {strikes}/{MAX_STRIKES}</p>
            <p>Passes: {passes}</p>
          </div>

          <div className="word-display">
            <p className="scrambled-word">{scrambledWord}</p>
          </div>

          <div className="guess-section">
            <input
              type="text"
              value={guessInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Your guess"
              autoFocus
            />
            <button onClick={handleGuess}>Guess</button>
            <button onClick={handlePass} disabled={passes <= 0}>Pass ({passes} left)</button>
          </div>

          {message && <p className="message">{message}</p>}
        </>
      ) : (
        <div className="game-over-screen">
          <h2>{message}</h2>
          <button onClick={handleReset}>Play Again</button>
        </div>
      )}</div>
  );}

// Render the game.
ReactDOM.render(<ScrambleGame />, document.getElementById('root'));