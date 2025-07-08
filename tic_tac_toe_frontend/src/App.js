import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Helper function to check if a player has won
 * @param {Array} board - Current board state
 * @returns 'X' | 'O' | null
 */
function calculateWinner(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6], // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (
      board[a] && 
      board[a] === board[b] && 
      board[a] === board[c]
    ) return board[a];
  }
  return null;
}

/**
 * Helper to check if all board squares are filled
 * @param board 
 * @returns true if full, false if not
 */
function isDraw(board) {
  return board.every((sq) => sq !== null);
}

/**
 * Square component for each Tic Tac Toe cell.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " ttt-highlight" : ""}`}
      onClick={onClick}
      aria-label={`tic tac toe cell, ${value ? value : 'empty'}`}
      disabled={!!value}
      tabIndex={0}
      type="button"
    >
      {value}
    </button>
  );
}

/**
 * Board component for Tic Tac Toe game.
 */
function Board({ board, onCellClick, winLine }) {
  const renderSquare = (idx) => (
    <Square
      key={idx}
      value={board[idx]}
      onClick={() => onCellClick(idx)}
      highlight={winLine && winLine.includes(idx)}
    />
  );
  let rows = [];
  for (let i = 0; i < 3; i++) {
    let cells = [];
    for (let j = 0; j < 3; j++) {
      cells.push(renderSquare(i * 3 + j));
    }
    rows.push(<div className="ttt-row" key={i}>{cells}</div>);
  }
  return <div className="ttt-board">{rows}</div>;
}

/**
 * Find the winning line for highlighting.
 * @param {Array} board
 * @returns {Array|false}
 */
function getWinLine(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return false;
}

// PUBLIC_INTERFACE
function App() {
  // Light theme enforced for this minimalistic app
  const [theme, setTheme] = useState('light');

  // Board state and game info
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('');
  const [notification, setNotification] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effect for game state change
  useEffect(() => {
    const winner = calculateWinner(board);
    const draw = !winner && isDraw(board);
    if (winner) {
      setStatus(`Winner: ${winner} 🎉`);
      setNotification(`Game Over! Player ${winner} wins!`);
      setGameOver(true);
      setWinLine(getWinLine(board));
    } else if (draw) {
      setStatus("It's a draw!");
      setNotification("Game ended in a draw.");
      setGameOver(true);
      setWinLine(null);
    } else {
      setStatus(`Current Turn: ${xIsNext ? 'X' : 'O'}`);
      setNotification('');
      setGameOver(false);
      setWinLine(null);
    }
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  // Handles click on board cell
  const handleCellClick = (idx) => {
    if (board[idx] || gameOver) {
      setNotification('Invalid move. Try a different cell.');
      return;
    }
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setNotification('');
  };

  // PUBLIC_INTERFACE
  // Reset game function
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus('Current Turn: X');
    setNotification('');
    setGameOver(false);
    setWinLine(null);
  };

  // PUBLIC_INTERFACE
  // Toggle between light and dark for demo (optional)
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Colors from requirements
  const accent = "#ff9800";
  const primary = "#1976d2";
  const secondary = "#424242";

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="App-header" style={{ background: 'var(--bg-secondary)' }}>
        <h1 
          className="ttt-title"
          style={{
            color: primary,
            fontWeight: 700,
            marginBottom: "12px"
          }}
        >
          Tic Tac Toe
        </h1>
        <div 
          className="ttt-status-banner"
          aria-live="polite"
          role="status"
          style={{
            marginBottom: "18px",
            background: accent,
            padding: "8px 24px",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.5px"
          }}
        >
          {status}
        </div>
        {notification && (
          <div 
            className="ttt-notification"
            aria-live="polite"
            style={{
              marginBottom: '10px',
              color: secondary,
              fontWeight: 500,
              minHeight: "20px"
            }}
          >
            {notification}
          </div>
        )}
        <Board 
          board={board}
          onCellClick={handleCellClick}
          winLine={winLine}
        />
        <div className="ttt-controls" style={{ marginTop: 28 }}>
          <button
            className="ttt-btn"
            onClick={resetGame}
            tabIndex={0}
            style={{ 
              background: accent, 
              color: "#fff",
              border: "none",
              padding: "12px 32px",
              fontWeight: 600,
              borderRadius: "16px",
              margin: "0 10px",
              fontSize: "1.1rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              outline: "none",
              transition: "background 0.2s"
            }}
          >
            Reset Game
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{
              background: secondary,
              color: "#fff",
              marginLeft: 20,
              borderRadius: 12,
              border: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '10px 22px'
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <footer style={{
          marginTop: 35, fontSize: '0.88em', color: "#aaa", letterSpacing: '0.01em'
        }}>
          Modern minimal Tic Tac Toe &copy; {new Date().getFullYear()}
        </footer>
      </header>
    </div>
  );
}

export default App;
