import React, { useEffect } from "react";
import { updateAndCheck } from "./sudokuSolver";
import { solveThePuzzle } from "./sudokuSolver";

const Cell = (props) => {
  let cellName = "cell";
  if (props.solved) cellName = "solvedCell";
  const cellNumber = props.cell + (props.row - 1) * 10;

  return (
    <React.Fragment>
      {!props.solved ? (
        <input
          id={cellName + String(cellNumber)}
          value={
            props.newSudoku
              ? props.newSudoku[props.row - 1][props.cell - 1]
                ? props.newSudoku[props.row - 1][props.cell - 1]
                : ""
              : ""
          }
          className="correctInput"
          onChange={(event) => {
            updateAndCheck(
              event,
              props.setMessage,
              props.setMessageStyle,
              props.row - 1,
              props.cell - 1,
              props.setNewSudoku
            );
          }}
        ></input>
      ) : (
        <div
          id={cellName + String(cellNumber)}
          className={
            props.solvedSudoku && props.solvedSudoku.length
              ? props.solvedSudoku[props.row - 1][props.cell - 1] === 0 &&
                props.isSolved
                ? "solvedCellFinalFail"
                : "solvedCellFinal"
              : "solvedCellFinal"
          }
        >
          {props.solvedSudoku && props.solvedSudoku.length
            ? props.solvedSudoku[props.row - 1][props.cell - 1]
              ? props.solvedSudoku[props.row - 1][props.cell - 1]
              : ""
            : ""}
        </div>
      )}
      {props.cell === 3 || props.cell === 6 ? <span>&nbsp;</span> : null}
    </React.Fragment>
  );
};

export default Cell;
