import "regenerator-runtime/runtime";

import {
  possibleSolutionSolve,
  onlyOne,
  eliminate,
  nakedPairs,
  hiddenPairs,
  nakedTriples,
} from "./algorithms";

//blank sudoku used to fill in values from sudokuEntry inputs
export let inputPuzzle = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//createSudoku function outputs an array of objects
export const createNewSudoku = () => {
  let newSudoku = [];
  let cell = 1;
  let row = 0;
  let column = 0;
  let block = 1;
  while (cell < 82) {
    newSudoku.push({
      cell,
      row,
      column,
      block,
      possibleSolutions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      solution: 0,
    });
    ++cell;
    ++column;
    if (column > 8) {
      ++row;
      column = 0;
    }
    if (column < 3 && row < 3) block = 1;
    if (column > 2 && column < 6 && row < 3) block = 2;
    if (column > 5 && row < 3) block = 3;
    if (column < 3 && row > 2 && row < 6) block = 4;
    if (column > 2 && column < 6 && row > 2 && row < 6) block = 5;
    if (column > 5 && row > 2 && row < 6) block = 6;
    if (column < 3 && row > 5) block = 7;
    if (column > 2 && column < 6 && row > 5) block = 8;
    if (column > 5 && row > 5) block = 9;
  }

  return newSudoku;
};

//takes a 9x9 Sudoku array and a newSudoku and fills in the cell data from the input Sudoku
export const puzzleSet = (puzzle, newPuzzle) => {
  newPuzzle.forEach((unit) => {
    unit.solution = puzzle[unit.row][unit.column];
    if (unit.solution !== 0) unit.possibleSolutions = [unit.solution];
  });
  return newPuzzle;
};

//creates a 9x9 sudoku array from the newSudoku array of objects
export const createSudokuArray = (puzzle) => {
  return puzzle.reduce(
    (acc, unit) => {
      acc[unit.row].push(unit.solution);
      return acc;
    },
    [[], [], [], [], [], [], [], [], []]
  );
};

//combines all functions to solve a sudoku
export const sudokuSolver = (puzzle) => {
  let newSudoku = createNewSudoku();
  puzzleSet(puzzle, newSudoku);
  let time = new Date();
  while (newSudoku.map((unit) => unit.solution).some((num) => num === 0)) {
    possibleSolutionSolve(newSudoku);
    if (possibleSolutionSolve(newSudoku) === 0) {
      onlyOne(newSudoku);
      eliminate(newSudoku);
      nakedPairs(newSudoku);
      hiddenPairs(newSudoku);
      nakedTriples(newSudoku);
    }
    if (new Date() - time > 3000) {
      console.log(createSudokuArray(newSudoku));
      console.log(newSudoku);
      return createSudokuArray(newSudoku);
    }
  }
  let solvedSudokuArray = createSudokuArray(newSudoku);
  console.log(solvedSudokuArray);
  return solvedSudokuArray;
};

//checks in real time to see if inputs result in an invalid sudoku
const checkSudoku = (puzzle, row, column) => {
  let result = true;
  let curCell = puzzle[row][column];

  for (let i = 0; i < 9; i++) {
    let cellRow = puzzle[row][i];
    if (i === column) continue;
    if (cellRow === curCell) result = false;
  }

  for (let i = 0; i < 9; i++) {
    let cellCol = puzzle[i][column];
    if (i === row) continue;
    if (cellCol === curCell) result = false;
  }

  let rowStart;
  let colStart;

  if (column < 3 && row < 3) {
    rowStart = 0;
    colStart = 0;
  }
  if (column > 2 && column < 6 && row < 3) {
    rowStart = 0;
    colStart = 3;
  }
  if (column > 5 && row < 3) {
    rowStart = 0;
    colStart = 6;
  }
  if (column < 3 && row > 2 && row < 6) {
    rowStart = 3;
    colStart = 0;
  }
  if (column > 2 && column < 6 && row > 2 && row < 6) {
    rowStart = 3;
    colStart = 3;
  }
  if (column > 5 && row > 2 && row < 6) {
    rowStart = 3;
    colStart = 6;
  }
  if (column < 3 && row > 5) {
    rowStart = 6;
    colStart = 0;
  }
  if (column > 2 && column < 6 && row > 5) {
    rowStart = 6;
    colStart = 3;
  }
  if (column > 5 && row > 5) {
    rowStart = 6;
    colStart = 6;
  }

  for (let i = rowStart; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      let cellBlock = puzzle[i][j];
      if (i === row && j === column) continue;
      if (cellBlock === curCell) result = false;
    }
  }

  return result;
};

//updates the inputPuzzle with valid inpout entries using checkSudoku
export const updateAndCheck = (
  event,
  setMessage,
  setMessageStyle,
  row,
  column,
  setNewSudoku
) => {
  const validValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let potentialValue = parseInt(event.target.value);
  if (event.target.value === "") {
    potentialValue = 0;
  }
  inputPuzzle[row][column] = potentialValue;

  //if potential value us not a num 1-9, display message
  if (!validValues.includes(potentialValue)) {
    inputPuzzle[row][column] = setMessage(
      "Invalid entry. Must be a number 1-9."
    );
    setMessageStyle({
      fontWeight: "bold",
      backgroundColor: "rgba(255, 0, 0, 0.6)",
    });
  } else if (potentialValue !== 0 && !checkSudoku(inputPuzzle, row, column)) {
    inputPuzzle[row][column] = 0;
    setMessage("Entry creates invalid Sudoku Puzzle.");
    setMessageStyle({
      fontWeight: "bold",
      backgroundColor: "rgba(255, 0, 0, 0.75)",
      border: "none",
    });
  } else {
    setNewSudoku(inputPuzzle.slice());
    setMessage(
      "Fill in known cells and leave unknown cells blank, then press SOLVE."
    );
    setMessageStyle({
      fontWeight: "normal",
      color: "black",
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "none",
    });
  }
};

//checks to see if at least 17 cells are filled in - the minimum ammount for a valid Sudoku
export const checkFor17 = (puzzle) => {
  let count = 0;
  puzzle.flat().forEach((cell) => {
    if (cell !== 0) count++;
  });
  return count > 16 ? true : false;
};

const loader = document.getElementById("loader");

//Implements sudokuSolver function!
export const solveThePuzzle = (
  setMessage,
  setMessageStyle,
  setSolvedSudoku,
  setIsSolved
) => {
  loader.style = "display: block";
  if (checkFor17(inputPuzzle)) {
    let solvedSudoku = sudokuSolver(inputPuzzle);
    setSolvedSudoku(solvedSudoku);
    if (
      solvedSudoku.flat().reduce((result, number) => {
        if (number === 0) return false;
        else return result;
      }, true)
    ) {
      setMessage("Dang, that was fast!");
      setMessageStyle({
        fontWeight: "bold",
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0)",
        border: "none",
      });
      setIsSolved(true);
    } else {
      setMessage("Sudoku is either invalid or too hard for the Sudoku Solver.");
      setMessageStyle({
        fontWeight: "bold",
        color: "black",
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        border: "none",
      });
      setIsSolved(true);
    }
  } else {
    setMessage("Invalid Sudoku. A minimum of 17 cells must be filled in.");
    setMessageStyle({
      fontWeight: "bold",
      color: "black",
      backgroundColor: "rgba(255, 0, 0, 0.6)",
      border: "none",
    });
  }
  setTimeout(() => {
    loader.style = "display: none";
  }, 1000);
};

//resets all input fields to ''
export const resetPage = (reset, setReset, setMessage, setMessageStyle) => {
  setReset(!reset);
  inputPuzzle = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  setMessage(
    "Fill in known cells and leave unknown cells blank, then press SOLVE."
  );
  setMessageStyle({
    fontWeight: "normal",
    color: "black",
    backgroundColor: "rgba(255, 255, 255, 0)",
    border: "none",
  });
};

const sudokuExamples = [
  [
    [0, 0, 6, 8, 7, 1, 0, 0, 3],
    [0, 7, 3, 0, 5, 6, 1, 9, 0],
    [0, 0, 0, 3, 4, 9, 0, 2, 7],
    [3, 4, 2, 0, 0, 0, 0, 8, 0],
    [0, 6, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 5, 2],
    [0, 1, 0, 7, 0, 4, 8, 0, 0],
    [7, 0, 0, 5, 9, 8, 2, 6, 1],
    [0, 0, 5, 0, 0, 0, 9, 0, 0],
  ],
  [
    [8, 0, 0, 1, 0, 0, 0, 7, 0],
    [0, 2, 0, 0, 4, 0, 8, 0, 0],
    [0, 6, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 7, 0, 9, 0, 8],
    [2, 4, 0, 0, 8, 0, 0, 0, 0],
    [0, 3, 8, 0, 0, 0, 0, 0, 5],
    [0, 8, 0, 6, 0, 4, 1, 0, 0],
    [9, 0, 0, 0, 0, 7, 2, 0, 4],
    [0, 0, 5, 8, 1, 0, 0, 0, 6],
  ],
  [
    [6, 0, 2, 0, 0, 4, 0, 5, 0],
    [0, 0, 0, 0, 1, 0, 2, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 9],
    [0, 0, 3, 4, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 7, 0, 6, 9, 0],
    [0, 2, 8, 0, 0, 0, 7, 0, 0],
    [0, 5, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 9, 6, 5, 7, 0],
    [3, 0, 0, 7, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 7, 0, 0, 8, 0, 0, 0],
    [0, 9, 5, 0, 0, 2, 6, 0, 0],
    [0, 0, 0, 1, 0, 0, 2, 5, 0],
    [0, 1, 0, 0, 0, 0, 0, 7, 9],
    [6, 0, 0, 0, 0, 9, 0, 0, 0],
    [0, 0, 8, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 6, 4, 0, 0, 8, 0, 0],
    [0, 3, 0, 0, 5, 0, 0, 2, 0],
  ],
];

//random number generator 0-num
// const randomNum = (num) => {
//   return Math.floor(Math.random() * num);
// };

let curExampleIdx = 0;
let level;

//let getSudokuButton = document.getElementById("getSudoku");
export const getSudoku = () => {
  if (curExampleIdx > sudokuExamples.length - 1) curExampleIdx = 0;
  let num = curExampleIdx;
  let newInput = sudokuExamples[num];
  if (num === 0) level = "Easy";
  if (num === 1) level = "Medium";
  if (num === 2) level = "Hard";
  if (num === 3) level = "Expert";
  ++curExampleIdx;
  inputPuzzle = newInput.slice();
  return { newInput, level };
};
