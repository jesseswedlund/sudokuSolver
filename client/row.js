import React from "react";
import PropTypes from "prop-types";
import Cell from "./cell";

const Row = (props) => {
  const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let rowName = "row";

  if (props.solved === true) {
    rowName = "solvedrow";
  }

  return (
    <React.Fragment>
      <div
        id={rowName + String(props.row)}
        className={props.solved ? "solvedRow" : "regRow"}
      >
        {cells.map((cell) => (
          <Cell
            key={10 * (props.row - 1) + cell}
            row={props.row}
            cell={cell}
            solved={props.solved}
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
      {props.row === 3 || props.row === 6 ? (
        <div className="rowbreak"></div>
      ) : null}
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.number,
};

export default Row;
