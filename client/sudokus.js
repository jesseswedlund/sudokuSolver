import React, { useState } from "react";
import Row from "./row";

const Sudokus = (props) => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="sudokus">
      <div id="sudokuEntry">
        {rows.map((row) => (
          <Row
            key={row}
            row={row}
            solved={false}
            setMessage={props.setMessage}
            setMessageStyle={props.setMessageStyle}
            messageStyle={props.messageStyle}
            reset={props.reset}
            newSudoku={props.newSudoku}
            solvedSudoku={props.solvedSudoku}
            setNewSudoku={props.setNewSudoku}
            setSolvedSudoku={props.setSolvedSudoku}
            isSolved={props.isSolved}
          />
        ))}
      </div>
      <div>
        <img id="arrow" src="/images/arrow.png" />{" "}
      </div>
      <div
        id="solvedSudoku"
        className={props.isSolved ? "isSolved" : "isNotSolved"}
      >
        {rows.map((row) => (
          <Row
            key={row}
            row={row}
            solved={true}
            setMessage={props.setMessage}
            setMessageStyle={props.setMessageStyle}
            messageStyle={props.messageStyle}
            reset={props.reset}
            newSudoku={props.newSudoku}
            solvedSudoku={props.solvedSudoku}
            setNewSudoku={props.setNewSudoku}
            setSolvedSudoku={props.setSolvedSudoku}
            isSolved={props.isSolved}
          />
        ))}
      </div>
    </div>
  );
};

export default Sudokus;
