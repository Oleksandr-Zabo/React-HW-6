import React from 'react';

const GameContext = React.createContext();

function GameMenu() {
    const { score, setSecret, setAttempts, setStatus } = React.useContext(GameContext);
    return (
        <div>
            <h2>Game Menu</h2>
            <p>Score: {score}</p>
            <button onClick={() => { setSecret(Math.floor(Math.random() * 10) + 1); setAttempts(0); setStatus('playing'); }}>
                Start New Game
            </button>
        </div>
    );
}

function GameField() {
    const { secret, attempts, setAttempts, setStatus, setScore, score } = React.useContext(GameContext);
    const [value, setValue] = React.useState('');
    function guess() {
        const n = parseInt(value, 10);
        if (Number.isNaN(n)) return;
        if (n < 1 || n > 10) return;
        const next = attempts + 1;
        setAttempts(next);
        if (n === secret) {
            setStatus('won');
            setScore(s => s + Math.max(0, 6 - next));
        } else if (next >= 5) {
            setStatus('lost');
        } else {
            setStatus(n < secret ? 'higher' : 'lower');
        }
    }
    return (
        <div>
            <h2>Game Field</h2>
            <p>Score: {score}</p>
            <input type="number" min="1" max="10" value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={guess}>Guess</button>
            <p>Attempts: {attempts}</p>
        </div>
    );
}

function GameResult() {
    const { status, secret, attempts, score } = React.useContext(GameContext);
    return (
        <div>
            <h2>Game Result</h2>
            <p>Status: {status}</p>
            <p>Attempts: {attempts}</p>
            <p>Score: {score}</p>
            {(status === 'won' || status === 'lost') && <p>Secret: {secret}</p>}
        </div>
    );
}

function Game() {
    const [secret, setSecret] = React.useState(Math.floor(Math.random() * 10) + 1);
    const [attempts, setAttempts] = React.useState(0);
    const [status, setStatus] = React.useState('idle');
    const [score, setScore] = React.useState(0);
    return (
        <GameContext.Provider value={{ secret, setSecret, attempts, setAttempts, status, setStatus, score, setScore }}>
            <div>
                <h2>Guess the number 1-10</h2>
                <GameMenu />
                <GameField />
                <GameResult />
            </div>
        </GameContext.Provider>
    );
}

export default Game;