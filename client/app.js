import React, { useState, useEffect } from "react";
import Sudokus from "./sudokus";
import { resetPage, getSudoku, solveThePuzzle } from "./sudokuSolver";

const App = () => {
  const [message, setMessage] = useState(
    "Fill in known cells and leave unknown cells blank, then press SOLVE."
  );
  const [messageStyle, setMessageStyle] = useState({});
  const [reset, setReset] = useState(false);
  const [getSudokuMessage, setGetSudokuMessage] = useState(
    "Or press for a puzzle -->"
  );
  const [newSudoku, setNewSudoku] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [solvedSudoku, setSolvedSudoku] = useState([]);
  const [isSolved, setIsSolved] = useState(false);

  return (
    <div className="box">
      <div className="text">
        <h1 className="title">Sudoku Solver</h1>
        <div className="instructions">
          <h3>
            <span id="enter">Enter Sudoku Here:</span>
            <span id="solved">Solved Sudoku:</span>
          </h3>
        </div>
        <Sudokus
          setMessage={setMessage}
          setMessageStyle={setMessageStyle}
          messageStyle={messageStyle}
          reset={reset}
          setNewSudoku={setNewSudoku}
          newSudoku={newSudoku}
          solvedSudoku={solvedSudoku}
          setSolvedSudoku={setSolvedSudoku}
          isSolved={isSolved}
        />
        <br />
        <br />
        <button
          id="solve"
          onClick={() =>
            solveThePuzzle(
              setMessage,
              setMessageStyle,
              setSolvedSudoku,
              setIsSolved
            )
          }
        >
          <strong>SOLVE</strong>
        </button>
        <br />
        <br />
        <input readOnly id="link" value={getSudokuMessage}></input>
        <button
          id="getSudoku"
          onClick={() => {
            setSolvedSudoku([]);
            resetPage(reset, setReset, setMessage, setMessageStyle);
            let newSudokuInfo = getSudoku();
            setNewSudoku(newSudokuInfo.newInput.slice());
            setGetSudokuMessage(newSudokuInfo.level);
            setIsSolved(false);
          }}
        >
          <strong>Get Sudoku</strong>
        </button>
        <button
          id="reset"
          onClick={() => {
            resetPage(reset, setReset, setMessage, setMessageStyle);
            setIsSolved(false);
            setNewSudoku([
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]);
            setSolvedSudoku([
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]);
          }}
        >
          <strong>RESET</strong>
        </button>
        <br />
        <p id="message" style={messageStyle}>
          <strong>{message}</strong>
        </p>
      </div>
    </div>
  );
};

export default App;
