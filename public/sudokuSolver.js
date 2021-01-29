//createSudoku function outputs an array of objects
const createNewSudoku = () => {
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
const puzzleSet = (puzzle, newPuzzle) => {
  newPuzzle.forEach((unit) => {
    unit.solution = puzzle[unit.row][unit.column];
    if (unit.solution !== 0) unit.possibleSolutions = [unit.solution];
  });
  return newPuzzle;
};

//for every cell, if it's value is not zero, remove that value from each the possible solution of every other cell in the same
//row, column and block. Then, if any cells have only one possible value left in the possibleSolutions array, change that cell's
//value to it. Each time a change is made, ++changes. Return the number of changes that were made.
const possibleSolutionSolve = (puzzle) => {
  let changes = 0;

  puzzle.forEach((unit) => {
    if (unit.solution !== 0) {
      puzzle.forEach((elem) => {
        if (elem.row === unit.row && elem.solution === 0) {
          let idx = elem.possibleSolutions.indexOf(unit.solution);
          if (idx !== -1) {
            elem.possibleSolutions.splice(idx, 1);
            ++changes;
          }
        }
      });
      puzzle.forEach((elem) => {
        if (elem.column === unit.column && elem.solution === 0) {
          let idx = elem.possibleSolutions.indexOf(unit.solution);
          if (idx !== -1) {
            elem.possibleSolutions.splice(idx, 1);
            ++changes;
          }
        }
      });
      puzzle.forEach((elem) => {
        if (elem.block === unit.block && elem.solution === 0) {
          let idx = elem.possibleSolutions.indexOf(unit.solution);
          if (idx !== -1) {
            elem.possibleSolutions.splice(idx, 1);
            ++changes;
          }
        }
      });
    }
  });

  puzzle.forEach((unit) => {
    if (unit.possibleSolutions.length === 1 && unit.solution === 0) {
      unit.solution = unit.possibleSolutions[0];
      ++changes;
    }
  });

  return changes;
};

//a helper funtion to see if two array hold equal values
function arrayEquals(arr1, arr2) {
  return (
    Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index])
  );
}

//check every cell to see if it is the only cell in its row, column, or block that contains each of its possibleSolutions. If it
//is the only one with a solution, update the cell value to that solution. If any changes were made, run the possibleSolutionSolve function.
const onlyOne = (puzzle) => {
  let changes = 0;
  puzzle.forEach((unit) => {
    if (unit.solution === 0) {
      unit.possibleSolutions.forEach((value) => {
        let onlyInRow = true;
        let onlyInCol = true;
        let onlyInBlock = true;

        puzzle.forEach((elem) => {
          if (unit.row === elem.row && unit.cell !== elem.cell) {
            if (elem.possibleSolutions.includes(value)) onlyInRow = false;
          }
          if (unit.column === elem.column && unit.cell !== elem.cell) {
            if (elem.possibleSolutions.includes(value)) onlyInCol = false;
          }
          if (unit.block === elem.block && unit.cell !== elem.cell) {
            if (elem.possibleSolutions.includes(value)) onlyInBlock = false;
          }
        });

        if (onlyInRow) {
          unit.solution = value;
          unit.possibleSolutions = [value];
          ++changes;
        }
        if (onlyInCol) {
          unit.solution = value;
          unit.possibleSolutions = [value];
          ++changes;
        }
        if (onlyInBlock) {
          unit.solution = value;
          unit.possibleSolutions = [value];
          ++changes;
        }

        if (changes !== 0) possibleSolutionSolve(puzzle);
      });
    }
  });

  return changes;
};

//check to see if any cells in the same block that are in the same row/column are the only cells
//in that block a possible solutions. If so, eliminate that possible solution from other cells
// in row/col and then run onlyOne
const eliminate = (puzzle) => {
  let changes = 0;
  //for every cell
  puzzle.forEach((unit) => {
    //for every possible solution
    unit.possibleSolutions.forEach((solution) => {
      // console.log(`cell: ${unit.cell} possibleSolution: ${solution}`);
      let rowHasSol = false;
      let notRowHasSol = false;
      let colHasSol = false;
      let notColHasSol = false;
      //for every cell in the same block, that isn't the same cell and has a value of 0
      puzzle
        .filter(
          (item) =>
            item.block === unit.block &&
            item.cell !== unit.cell &&
            item.solution === 0
        )
        .forEach((one) => {
          // console.log(
          //   `Looking for ${solution} in possibleSolutions: ${one.possibleSolutions} in Cell: ${one.cell} Block: ${one.block}`
          // );
          //if that cell includes the possible solution and is in the same row, rowHasSol = true
          if (one.possibleSolutions.includes(solution) && one.row === unit.row)
            rowHasSol = true;
          //if that cell includes the possible solution and is NOT in the same row, notRowHasSol = true
          if (one.possibleSolutions.includes(solution) && one.row !== unit.row)
            notRowHasSol = true;
          //if that cell includes the possible solution and is in the same column, notRowHasSol = true
          if (
            one.possibleSolutions.includes(solution) &&
            one.column === unit.column
          )
            colHasSol = true;
          //if that cell includes the possible solution and is NOT in the same column, notColHasSol = true
          if (
            one.possibleSolutions.includes(solution) &&
            one.column !== unit.column
          )
            notColHasSol = true;
        });
      if (rowHasSol === true && notRowHasSol === false) {
        puzzle
          .filter(
            (item) =>
              item.row === unit.row &&
              item.cell !== unit.cell &&
              item.block !== unit.block &&
              item.solution === 0
          )
          .forEach((one) => {
            if (one.possibleSolutions.includes(solution)) {
              let solIdx = one.possibleSolutions.indexOf(solution);
              one.possibleSolutions.splice(solIdx, 1);
              ++changes;
            }
          });
      }
      if (colHasSol === true && notColHasSol === false) {
        puzzle
          .filter(
            (item) =>
              item.column === unit.column &&
              item.cell !== unit.cell &&
              item.block !== unit.block &&
              item.solution === 0
          )
          .forEach((one) => {
            if (one.possibleSolutions.includes(solution)) {
              let solIdx = one.possibleSolutions.indexOf(solution);
              one.possibleSolutions.splice(solIdx, 1);
              ++changes;
            }
          });
      }
    });
  });

  onlyOne(puzzle);
  return changes;
};

//TEST FOR ELIMINATE
//let easySudoku = [
//   [0, 0, 0, 0, 0, 8, 0, 0, 0],
//   [0, 0, 0, 2, 0, 9, 0, 0, 0],
//   [0, 0, 0, 3, 0, 4, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 4, 0, 6, 0, 0, 0],
//   [0, 0, 0, 5, 0, 7, 0, 0, 0],
// ];

// const testEliminate = (puzzle) => {
//   let testSudoku = createNewSudoku();
//   puzzleSet(puzzle, testSudoku);
//   console.log(createSudokuArray(testSudoku));
//   possibleSolutionSolve(testSudoku);
//   eliminate(testSudoku);
//   let toPrint = createSudokuArray(testSudoku);
//   console.log(toPrint);
//   console.log(
//     toPrint.flat().reduce((total, cur) => {
//       if (cur === 0) ++total;
//       return total;
//     }, 0)
//   );
//   console.log(testSudoku);
// };

// testEliminate(easySudoku);

//check to see if any cell has only two possible solutions. If it does, see if any other cell in the same row, column, or block
//also has the same two possible solutions. If so, eliminate those two values from the other cells' possibleSoultions in the
//row/column/block that the naked pair was found in.

//Look for Naked Pairs
const nakedPairs = (puzzle) => {
  let changes = 0;
  let nakedPairCandidates = puzzle.filter(
    (unit) => unit.possibleSolutions === 2
  );
  nakedPairCandidates.forEach((candidate) => {
    nakedPairCandidates.forEach((candidate2) => {
      //Check row for naked pair
      if (
        candidate.row === candidate2.row &&
        candidate.cell !== candidate2.cell &&
        arrayEquals(candidate.possibleSolutions, candidate2.possibleSolutions)
      ) {
        puzzle.forEach((unit) => {
          if (
            candidate.row === unit.row &&
            candidate.cell !== unit.cell &&
            candidate.cell !== unit.cell &&
            unit.solution === 0
          ) {
            let idx1 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[0]
            );
            if (idx1 !== -1) {
              unit.possibleSolutions.splice(idx1, 1);
              ++changes;
            }

            let idx2 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[1]
            );
            if (idx2 !== -1) {
              unit.possibleSolutions.splice(idx2, 1);
              changes++;
            }
          }
        });
      }

      //check each column for a naked pair
      if (
        candidate.row === candidate2.row &&
        candidate.cell !== candidate2.cell &&
        arrayEquals(candidate.possibleSolutions, candidate2.possibleSolutions)
      ) {
        puzzle.forEach((unit) => {
          if (
            candidate.row === unit.row &&
            candidate.cell !== unit.cell &&
            candidate.cell !== unit.cell &&
            unit.solution === 0
          ) {
            let idx1 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[0]
            );
            if (idx1 !== -1) {
              unit.possibleSolutions.splice(idx1, 1);
              ++changes;
            }

            let idx2 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[1]
            );
            if (idx2 !== -1) {
              unit.possibleSolutions.splice(idx2, 1);
              changes++;
            }
          }
        });
      }

      //check each block for a naked pair
      if (
        candidate.row === candidate2.row &&
        candidate.cell !== candidate2.cell &&
        arrayEquals(candidate.possibleSolutions, candidate2.possibleSolutions)
      ) {
        puzzle.forEach((unit) => {
          if (
            candidate.row === unit.row &&
            candidate.cell !== unit.cell &&
            candidate.cell !== unit.cell &&
            unit.solution === 0
          ) {
            let idx1 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[0]
            );
            if (idx1 !== -1) {
              unit.possibleSolutions.splice(idx1, 1);
              ++changes;
            }

            let idx2 = unit.possibleSolutions.indexOf(
              candidate.possibleSolutions[1]
            );
            if (idx2 !== -1) {
              unit.possibleSolutions.splice(idx2, 1);
              changes++;
            }
          }
        });
      }
    });
  });

  return changes;
};

//for each cell with more than two possible solutions, if that another cell in the same row, col, or block shares a solution pair with another cell and no other cells in that
//same row/col/block contain the pair, you can eliminate all other possible solutions from the cell
const hiddenPairs = (puzzle) => {
  let changes = 0;
  let puzzleRowMatches = [];
  let puzzleColMatches = [];
  let puzzleBlockMatches = [];
  let notRowMatches = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
  };
  let notColMatches = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
  };
  let notBlockMatches = {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
  };

  puzzle.forEach((unit) => {
    //console.log(`NEW CELL: ${unit.cell}`);
    //for every possible solution
    unit.possibleSolutions.forEach((solution) => {
      //check to see if other cells in the same row have that solution. If more then one does, ditch the solution
      //console.log(`Solution: ${solution}`);
      let possibleRowMatches = [];
      let possibleColMatches = [];
      let possibleBlockMatches = [];
      let rowMatch1;
      let colMatch1;
      let blockMatch1;
      puzzle.forEach((one) => {
        if (
          !(solution in notRowMatches[one.row]) &&
          one.row === unit.row &&
          one.cell !== unit.cell &&
          one.possibleSolutions.includes(solution)
        ) {
          //another cell has been found in the same row that contains the same solution. If it's the first time this solution has been found in the row, rowMatch1 will be undefined
          //and we'll define it as the cell number we found the match in. Otherwise, it will have been found more than once, so we'll make the value 0. Here we could consider pushing
          //the solution into an array of numbers that we know won't be part of a hidden pair for this row. Then if a solution is included in that array, we'll already know not to pursue
          //it as part of a potential pair.
          //console.log(`found a row match in solution of cell ${one.cell}`);
          if (rowMatch1 === undefined) rowMatch1 = one.cell;
          else {
            rowMatch1 = 0;
            notRowMatches[one.row][solution] = 1;
          }
        }
        if (
          !(solution in notColMatches[one.column]) &&
          one.column === unit.column &&
          one.cell !== unit.cell &&
          one.possibleSolutions.includes(solution)
        ) {
          if (colMatch1 === undefined) colMatch1 = one.cell;
          else {
            colMatch1 = 0;
            notColMatches[one.column][solution] = 1;
          }
        }
        if (
          !(solution in notBlockMatches[one.block]) &&
          one.block === unit.block &&
          one.cell !== unit.cell &&
          one.possibleSolutions.includes(solution)
        ) {
          if (
            blockMatch1 === undefined &&
            one.row !== unit.row &&
            one.column !== unit.column
          )
            blockMatch1 = one.cell;
          else {
            blockMatch1 = 0;
            notBlockMatches[one.block][solution] = 1;
          }
        }
      });
      if (rowMatch1 !== 0 && rowMatch1 !== undefined) {
        possibleRowMatches.push(unit.cell, rowMatch1, solution);
        notRowMatches[unit.row][solution] = 1;
        puzzleRowMatches.push(possibleRowMatches);
      }
      if (colMatch1 !== 0 && colMatch1 !== undefined) {
        possibleColMatches.push(unit.cell, colMatch1, solution);
        notColMatches[unit.column][solution] = 1;
        puzzleColMatches.push(possibleColMatches);
      }

      if (blockMatch1 !== 0 && blockMatch1 !== undefined) {
        possibleBlockMatches.push(unit.cell, blockMatch1, solution);
        notBlockMatches[unit.block][solution] = 1;
        puzzleBlockMatches.push(possibleBlockMatches);
      }
    });
  });

  if (puzzleRowMatches.length > 0) {
    let idxUsed = [];
    puzzleRowMatches
      .reduce((reducedMatches, cur) => {
        if (reducedMatches.length === 0) reducedMatches.push(cur);
        else if (
          reducedMatches.reduce((truth, pair) => {
            if (cur[0] === pair[1] && cur[1] === pair[0]) return truth && false;
            else return truth;
          }, true)
        )
          reducedMatches.push(cur);
        return reducedMatches;
      }, [])
      .forEach((pair, idx) => {
        console.log(pair, idx);
        puzzleRowMatches.forEach((otherPair, idx2) => {
          if (idx === idx2 || idxUsed.includes(idx)) return;
          else if (pair[0] === otherPair[0] && pair[1] === otherPair[1]) {
            puzzle[pair[0] - 1].possibleSolutions = [pair[2], otherPair[2]];
            puzzle[pair[1] - 1].possibleSolutions = [pair[2], otherPair[2]];
            idxUsed.push(idx2);
            ++changes;
          }
        });
      });
  }

  if (puzzleColMatches.length > 0) {
    let idxUsed = [];
    puzzleColMatches
      .reduce((reducedMatches, cur) => {
        if (reducedMatches.length === 0) reducedMatches.push(cur);
        else if (
          reducedMatches.reduce((truth, pair) => {
            if (cur[0] === pair[1] && cur[1] === pair[0]) return truth && false;
            else return truth;
          }, true)
        )
          reducedMatches.push(cur);
        return reducedMatches;
      }, [])
      .forEach((pair, idx) => {
        puzzleColMatches.forEach((otherPair, idx2) => {
          if (idx === idx2 || idxUsed.includes(idx)) return;
          else if (pair[0] === otherPair[0] && pair[1] === otherPair[1]) {
            puzzle[pair[0] - 1].possibleSolutions = [pair[2], otherPair[2]];
            puzzle[pair[1] - 1].possibleSolutions = [pair[2], otherPair[2]];
            idxUsed.push(idx2);
            ++changes;
          }
        });
      });
  }

  if (puzzleBlockMatches.length > 0) {
    let idxUsed = [];
    puzzleBlockMatches
      .reduce((reducedMatches, cur) => {
        if (reducedMatches.length === 0) reducedMatches.push(cur);
        else if (
          reducedMatches.reduce((truth, pair) => {
            if (cur[0] === pair[1] && cur[1] === pair[0]) return truth && false;
            else return truth;
          }, true)
        )
          reducedMatches.push(cur);
        return reducedMatches;
      }, [])
      .forEach((pair, idx) => {
        puzzleBlockMatches.forEach((otherPair, idx2) => {
          if (idx === idx2 || idxUsed.includes(idx)) return;
          if (pair[0] === otherPair[0] && pair[1] === otherPair[1]) {
            puzzle[pair[0] - 1].possibleSolutions = [pair[2], otherPair[2]];
            puzzle[pair[1] - 1].possibleSolutions = [pair[2], otherPair[2]];
            idxUsed.push(idx2);
            ++changes;
          }
        });
      });
  }

  return changes;
};

// let tester = [
//   [0, 0, 0, 0, 0, 0, 3, 0, 0],
//   [6, 7, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 6, 7, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [7, 6, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 0, 7, 6, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

// const testHiddenPairs = (puzzle) => {
//   let testSudoku = createNewSudoku();
//   puzzleSet(puzzle, testSudoku);
//   console.log(createSudokuArray(testSudoku));
//   possibleSolutionSolve(testSudoku);
//   console.log(testSudoku[7].possibleSolutions, testSudoku[8].possibleSolutions);
//   console.log(
//     testSudoku[32].possibleSolutions,
//     testSudoku[50].possibleSolutions
//   );
//   console.log(
//     testSudoku[65].possibleSolutions,
//     testSudoku[74].possibleSolutions
//   );
//   hiddenPairs(testSudoku);
//   console.log(testSudoku[7].possibleSolutions, testSudoku[8].possibleSolutions);
//   console.log(
//     testSudoku[32].possibleSolutions,
//     testSudoku[50].possibleSolutions
//   );
//   console.log(
//     testSudoku[65].possibleSolutions,
//     testSudoku[74].possibleSolutions
//   );
// };

// testHiddenPairs(tester);

const compareArrSolutions = (arr, solutions) => {
  console.log(`comparing ${arr}`);
  console.log(`to ${solutions}`);
  return arr.reduce((bool, cur) => {
    if (solutions.includes(cur)) return bool && true;
    else return bool && false;
  }, true);
};

//for every cell, if the cell has two or three possible solutions, consider it a potential naked triplet. Compare this cell to other cells in the same row, column, and block,
//looking for cells that might
const nakedTriples = (puzzle) => {
  let changes = 0;
  let nakedTripleCandidates = puzzle.filter(
    (unit) =>
      unit.possibleSolutions.length < 4 && unit.possibleSolutions.length > 1
  );
  nakedTripleCandidates
    .filter((each) => each.possibleSolutions.length === 3)
    .forEach((candidate1) => {
      let solutions = candidate1.possibleSolutions.slice();
      console.log(`CHECKING with ${candidate1.cell}`);
      console.log(candidate1);
      console.log(solutions);
      nakedTripleCandidates.forEach((candidate2) => {
        //check row for naked triple
        //if candidate2 is in the same row as candidate1 and candidate2's possibleSolutions are inculded in candidate1's possible solutions
        if (
          candidate1.cell !== candidate2.cell &&
          candidate1.row === candidate2.row &&
          compareArrSolutions(candidate2.possibleSolutions, solutions)
        ) {
          console.log('found candidate 2, checking for candidate3');
          //then we will check the other nakedTripleCandidates for a third candidate in the same row who's possible solutions are inculded in candidate1's possible solutions
          nakedTripleCandidates.forEach((candidate3) => {
            if (
              candidate1.cell !== candidate3.cell &&
              candidate2.cell !== candidate3.cell &&
              candidate1.row === candidate3.row &&
              compareArrSolutions(candidate3.possibleSolutions, solutions)
            ) {
              console.log(`candidate3 found: ${candidate3.possibleSolutions}`);
              //once we have found a third candidate, go through every cell that is in the same row, isn't one of the three canddidates, and isn't solved
              puzzle
                .filter(
                  (unit) =>
                    unit.row === candidate1.row &&
                    unit.cell !== candidate1.cell &&
                    unit.cell !== candidate2.cell &&
                    unit.cell !== candidate3.cell &&
                    unit.solution === 0
                )
                .forEach((one) => {
                  console.log('rowTripleFound');
                  console.log(candidate1);
                  console.log(candidate1.possibleSolutions);
                  console.log(candidate2);
                  console.log(candidate2.possibleSolutions);
                  console.log(candidate3);
                  console.log(candidate3.possibleSolutions);
                  console.log(one);
                  console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      console.log('ROW CHANGE MADE');
                      console.log(one.possibleSolutions);
                      onlyOne(puzzle);
                      ++changes;
                    }
                  });
                });
            }
          });
        }
      });

      nakedTripleCandidates.forEach((candidate2) => {
        //check col for naked triple
        if (
          candidate1.cell !== candidate2.cell &&
          candidate1.column === candidate2.column &&
          compareArrSolutions(candidate2.possibleSolutions, solutions)
        ) {
          nakedTripleCandidates.forEach((candidate3) => {
            if (
              candidate1.cell !== candidate3.cell &&
              candidate2.cell !== candidate3.cell &&
              candidate1.column === candidate3.column &&
              compareArrSolutions(candidate3.possibleSolutions, solutions)
            )
              puzzle
                .filter(
                  (unit) =>
                    unit.column === candidate1.column &&
                    unit.cell !== candidate1.cell &&
                    unit.cell !== candidate2.cell &&
                    unit.cell !== candidate3.cell &&
                    unit.solution === 0
                )
                .forEach((one) => {
                  console.log('columnTripleFound');
                  console.log(candidate1);
                  console.log(candidate1.possibleSolutions);
                  console.log(candidate2);
                  console.log(candidate2.possibleSolutions);
                  console.log(candidate3);
                  console.log(candidate3.possibleSolutions);
                  console.log(one);
                  console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      console.log('COLUMN CHANGE MADE');
                      onlyOne(puzzle);
                      ++changes;
                    }
                  });
                });
          });
        }
      });

      nakedTripleCandidates.forEach((candidate2) => {
        //check block for naked triple
        if (
          candidate1.block !== candidate2.block &&
          candidate1.block === candidate2.block &&
          compareArrSolutions(candidate2.possibleSolutions, solutions)
        ) {
          nakedTripleCandidates.forEach((candidate3) => {
            if (
              candidate1.cell !== candidate3.cell &&
              candidate2.cell !== candidate3.cell &&
              candidate1.block === candidate3.block &&
              compareArrSolutions(candidate3.possibleSolutions, solutions)
            )
              puzzle
                .filter(
                  (unit) =>
                    unit.block === candidate1.block &&
                    unit.cell !== candidate1.cell &&
                    unit.cell !== candidate2.cell &&
                    unit.cell !== candidate3.cell &&
                    unit.solution === 0
                )
                .forEach((one) => {
                  console.log('blockTripleFound');
                  console.log(candidate1);
                  console.log(candidate1.possibleSolutions);
                  console.log(candidate2);
                  console.log(candidate2.possibleSolutions);
                  console.log(candidate3);
                  console.log(candidate3.possibleSolutions);
                  console.log(one);
                  console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      console.log('BLOCK CHANGE MADE');
                      onlyOne(puzzle);
                      ++changes;
                    }
                  });
                });
          });
        }
      });
    });
  return changes;
};

// let tester = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 4, 0, 5, 0, 0, 0, 0, 6],
//   [0, 5, 0, 6, 0, 0, 0, 0, 7],
//   [0, 6, 0, 7, 0, 0, 0, 0, 8],
//   [0, 7, 0, 8, 0, 0, 0, 0, 9],
//   [0, 8, 0, 9, 0, 0, 0, 0, 1],
//   [0, 9, 0, 4, 0, 0, 0, 0, 5],
//   [0, 3, 0, 0, 0, 0, 0, 0, 4],
// ];

// const testNakedTriple = (puzzle) => {
//   let testSudoku = createNewSudoku();
//   puzzleSet(puzzle, testSudoku);
//   console.log(createSudokuArray(testSudoku));
//   possibleSolutionSolve(testSudoku);
//   console.log('BEFORE');
//   testSudoku.forEach((unit) => console.log(unit.possibleSolutions));
//   nakedTriples(testSudoku);
//   console.log('AFTER');
//   testSudoku.forEach((unit) => console.log(unit.possibleSolutions));
// };

// testNakedTriple(tester);

//Other solve functions to implement:
//hidden pairs
//naked triple
//hidden triple
//x-wing

//creates a 9x9 sudoku array from the newSudoku array of objects
function createSudokuArray(puzzle) {
  return puzzle.reduce(
    (acc, unit) => {
      acc[unit.row].push(unit.solution);
      return acc;
    },
    [[], [], [], [], [], [], [], [], []]
  );
}

//combines all functions to solve a sudoku
const sudokuSolver = (puzzle) => {
  let newSudoku = createNewSudoku();
  puzzleSet(puzzle, newSudoku);
  let loops = 0;
  while (newSudoku.map((unit) => unit.solution).some((num) => num === 0)) {
    possibleSolutionSolve(newSudoku);
    loops++;
    if (possibleSolutionSolve(newSudoku) === 0) {
      onlyOne(newSudoku);
      eliminate(newSudoku);
      nakedPairs(newSudoku);
      hiddenPairs(newSudoku);
      nakedTriples(newSudoku);
    }
    if (loops > 200) {
      console.log(createSudokuArray(newSudoku));
      console.log(newSudoku);
      return createSudokuArray(newSudoku);
    }
  }
  let solvedSudokuArray = createSudokuArray(newSudoku);
  console.log(solvedSudokuArray);
  return solvedSudokuArray;

  // let newSudoku = createNewSudoku();
  // puzzleSet(puzzle, newSudoku);
  // let progress = true;
  // while (progress === true) {
  //   if (possibleSolutionSolve(newSudoku) === 0) {
  //     if (onlyOne(newSudoku) === 0) {
  //       if (eliminate(newSudoku) === 0) {
  //         if (hiddenPairs(newSudoku) === 0) {
  //           if (nakedPairs(newSudoku) === 0) {
  //             if (nakedTriples(newSudoku) === 0) {
  //               progress = false;
  //               return;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // let sudokuArray = createSudokuArray(newSudoku);
  // console.log(sudokuArray);
  // console.log(
  //   sudokuArray.flat().reduce((total, cur) => {
  //     if (cur === 0) ++total;
  //     return total;
  //   }, 0)
  // );
  // console.log(newSudoku);
  // console.log(newSudoku.map((cell) => cell.possibleSolutions));
  // return sudokuArray;
};

//blank sudoku used to fill in values from sudokuEntry inputs
let inputPuzzle = [
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

//declaring access to html input elements
let message = document.getElementById('message');
let link = document.getElementById('link');

let input1 = document.getElementById('cell1');
let input2 = document.getElementById('cell2');
let input3 = document.getElementById('cell3');
let input4 = document.getElementById('cell4');
let input5 = document.getElementById('cell5');
let input6 = document.getElementById('cell6');
let input7 = document.getElementById('cell7');
let input8 = document.getElementById('cell8');
let input9 = document.getElementById('cell9');
let input10 = document.getElementById('cell10');
let input11 = document.getElementById('cell11');
let input12 = document.getElementById('cell12');
let input13 = document.getElementById('cell13');
let input14 = document.getElementById('cell14');
let input15 = document.getElementById('cell15');
let input16 = document.getElementById('cell16');
let input17 = document.getElementById('cell17');
let input18 = document.getElementById('cell18');
let input19 = document.getElementById('cell19');
let input20 = document.getElementById('cell20');
let input21 = document.getElementById('cell21');
let input22 = document.getElementById('cell22');
let input23 = document.getElementById('cell23');
let input24 = document.getElementById('cell24');
let input25 = document.getElementById('cell25');
let input26 = document.getElementById('cell26');
let input27 = document.getElementById('cell27');
let input28 = document.getElementById('cell28');
let input29 = document.getElementById('cell29');
let input30 = document.getElementById('cell30');
let input31 = document.getElementById('cell31');
let input32 = document.getElementById('cell32');
let input33 = document.getElementById('cell33');
let input34 = document.getElementById('cell34');
let input35 = document.getElementById('cell35');
let input36 = document.getElementById('cell36');
let input37 = document.getElementById('cell37');
let input38 = document.getElementById('cell38');
let input39 = document.getElementById('cell39');
let input40 = document.getElementById('cell40');
let input41 = document.getElementById('cell41');
let input42 = document.getElementById('cell42');
let input43 = document.getElementById('cell43');
let input44 = document.getElementById('cell44');
let input45 = document.getElementById('cell45');
let input46 = document.getElementById('cell46');
let input47 = document.getElementById('cell47');
let input48 = document.getElementById('cell48');
let input49 = document.getElementById('cell49');
let input50 = document.getElementById('cell50');
let input51 = document.getElementById('cell51');
let input52 = document.getElementById('cell52');
let input53 = document.getElementById('cell53');
let input54 = document.getElementById('cell54');
let input55 = document.getElementById('cell55');
let input56 = document.getElementById('cell56');
let input57 = document.getElementById('cell57');
let input58 = document.getElementById('cell58');
let input59 = document.getElementById('cell59');
let input60 = document.getElementById('cell60');
let input61 = document.getElementById('cell61');
let input62 = document.getElementById('cell62');
let input63 = document.getElementById('cell63');
let input64 = document.getElementById('cell64');
let input65 = document.getElementById('cell65');
let input66 = document.getElementById('cell66');
let input67 = document.getElementById('cell67');
let input68 = document.getElementById('cell68');
let input69 = document.getElementById('cell69');
let input70 = document.getElementById('cell70');
let input71 = document.getElementById('cell71');
let input72 = document.getElementById('cell72');
let input73 = document.getElementById('cell73');
let input74 = document.getElementById('cell74');
let input75 = document.getElementById('cell75');
let input76 = document.getElementById('cell76');
let input77 = document.getElementById('cell77');
let input78 = document.getElementById('cell78');
let input79 = document.getElementById('cell79');
let input80 = document.getElementById('cell80');
let input81 = document.getElementById('cell81');

//checks in real time to see if inputs result in an invalid sudoku
function checkSudoku(puzzle, row, column) {
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
}

//updates the inputPuzzle with valid inpout entries using checkSudoku
function updateAndCheck() {
  let potentialValue = parseInt(this.value);
  let id = this.id;
  let curInput = document.getElementById(id);
  let cellNum = '';
  let valid = true;

  if (potentialValue < 1 || potentialValue > 9) {
    message.innerHTML = '<strong>Invalid entry. Must be a number 1-9.</strong>';
    message.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
    curInput.value = '';
    valid = false;
  }

  if (isNaN(potentialValue)) {
    potentialValue = 0;
    valid = true;
  }

  if (valid === true) {
    message.innerHTML =
      '<strong>Fill in known cells and leave unknown cells blank, then press SOLVE.</strong>';
    message.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    message.style.border = 'none';
  }

  id.split('').forEach((char) => {
    if (!isNaN(parseInt(char))) cellNum += char;
  });
  cellNum = parseInt(cellNum);
  let row;
  let column;
  if (cellNum % 9 === 0) {
    row = cellNum / 9 - 1;
    column = 8;
  } else {
    row = Math.floor(cellNum / 9);
    column = (cellNum % 9) - 1;
  }

  valid === false
    ? (inputPuzzle[row][column] = 0)
    : (inputPuzzle[row][column] = potentialValue);

  if (!checkSudoku(inputPuzzle, row, column) && potentialValue !== 0) {
    message.innerHTML = '<strong>Entry creates invalid Sudoku Puzzle.</strong>';
    message.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    curInput.value = '';
    inputPuzzle[row][column] = 0;
  }
}

//declaring event listeners for each input field
input1.addEventListener('keyup', updateAndCheck);
input2.addEventListener('keyup', updateAndCheck);
input3.addEventListener('keyup', updateAndCheck);
input4.addEventListener('keyup', updateAndCheck);
input5.addEventListener('keyup', updateAndCheck);
input6.addEventListener('keyup', updateAndCheck);
input7.addEventListener('keyup', updateAndCheck);
input8.addEventListener('keyup', updateAndCheck);
input9.addEventListener('keyup', updateAndCheck);
input10.addEventListener('keyup', updateAndCheck);
input11.addEventListener('keyup', updateAndCheck);
input12.addEventListener('keyup', updateAndCheck);
input13.addEventListener('keyup', updateAndCheck);
input14.addEventListener('keyup', updateAndCheck);
input15.addEventListener('keyup', updateAndCheck);
input16.addEventListener('keyup', updateAndCheck);
input17.addEventListener('keyup', updateAndCheck);
input18.addEventListener('keyup', updateAndCheck);
input19.addEventListener('keyup', updateAndCheck);
input20.addEventListener('keyup', updateAndCheck);
input21.addEventListener('keyup', updateAndCheck);
input22.addEventListener('keyup', updateAndCheck);
input23.addEventListener('keyup', updateAndCheck);
input24.addEventListener('keyup', updateAndCheck);
input25.addEventListener('keyup', updateAndCheck);
input26.addEventListener('keyup', updateAndCheck);
input27.addEventListener('keyup', updateAndCheck);
input28.addEventListener('keyup', updateAndCheck);
input29.addEventListener('keyup', updateAndCheck);
input30.addEventListener('keyup', updateAndCheck);
input31.addEventListener('keyup', updateAndCheck);
input32.addEventListener('keyup', updateAndCheck);
input33.addEventListener('keyup', updateAndCheck);
input34.addEventListener('keyup', updateAndCheck);
input35.addEventListener('keyup', updateAndCheck);
input36.addEventListener('keyup', updateAndCheck);
input37.addEventListener('keyup', updateAndCheck);
input38.addEventListener('keyup', updateAndCheck);
input39.addEventListener('keyup', updateAndCheck);
input40.addEventListener('keyup', updateAndCheck);
input41.addEventListener('keyup', updateAndCheck);
input42.addEventListener('keyup', updateAndCheck);
input43.addEventListener('keyup', updateAndCheck);
input44.addEventListener('keyup', updateAndCheck);
input45.addEventListener('keyup', updateAndCheck);
input46.addEventListener('keyup', updateAndCheck);
input47.addEventListener('keyup', updateAndCheck);
input48.addEventListener('keyup', updateAndCheck);
input49.addEventListener('keyup', updateAndCheck);
input50.addEventListener('keyup', updateAndCheck);
input51.addEventListener('keyup', updateAndCheck);
input52.addEventListener('keyup', updateAndCheck);
input53.addEventListener('keyup', updateAndCheck);
input54.addEventListener('keyup', updateAndCheck);
input55.addEventListener('keyup', updateAndCheck);
input56.addEventListener('keyup', updateAndCheck);
input57.addEventListener('keyup', updateAndCheck);
input58.addEventListener('keyup', updateAndCheck);
input59.addEventListener('keyup', updateAndCheck);
input60.addEventListener('keyup', updateAndCheck);
input61.addEventListener('keyup', updateAndCheck);
input62.addEventListener('keyup', updateAndCheck);
input63.addEventListener('keyup', updateAndCheck);
input64.addEventListener('keyup', updateAndCheck);
input65.addEventListener('keyup', updateAndCheck);
input66.addEventListener('keyup', updateAndCheck);
input67.addEventListener('keyup', updateAndCheck);
input68.addEventListener('keyup', updateAndCheck);
input69.addEventListener('keyup', updateAndCheck);
input70.addEventListener('keyup', updateAndCheck);
input71.addEventListener('keyup', updateAndCheck);
input72.addEventListener('keyup', updateAndCheck);
input73.addEventListener('keyup', updateAndCheck);
input74.addEventListener('keyup', updateAndCheck);
input75.addEventListener('keyup', updateAndCheck);
input76.addEventListener('keyup', updateAndCheck);
input77.addEventListener('keyup', updateAndCheck);
input78.addEventListener('keyup', updateAndCheck);
input79.addEventListener('keyup', updateAndCheck);
input80.addEventListener('keyup', updateAndCheck);
input81.addEventListener('keyup', updateAndCheck);

//checks to see if at least 17 cells are filled in - the minimum ammount for a valid Sudoku
function checkFor17(puzzle) {
  let count = 0;
  puzzle.flat().forEach((cell) => {
    if (cell !== 0) count++;
  });
  return count > 16 ? true : false;
}

//declaring the solve button
let solve = document.getElementById('solve');

//declaring event listener and function for solve button - implements sudokuSolver function!
solve.addEventListener('click', () => {
  if (checkFor17(inputPuzzle)) {
    let solvedSudoku = sudokuSolver(inputPuzzle);
    display(solvedSudoku);
    if (
      solvedSudoku.flat().reduce((result, number) => {
        if (number === 0) return false;
        else return result;
      }, true)
    ) {
      message.innerHTML = '<strong>Dang, that was fast!</strong>';
      message.style.color = 'black';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    } else {
      message.innerHTML =
        '<strong>Sudoku is either invalid or too hard for the Sudoku Solver.</strong>';
      message.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
    }
  } else {
    message.innerHTML =
      '<strong>Invalid Sudoku. A minimum of 17 cells must be filled in.</strong>';
    message.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
  }
});

//declaring access to each input field for the solved sudoku
let solvedCell1 = document.getElementById('solvedCell1');
let solvedCell2 = document.getElementById('solvedCell2');
let solvedCell3 = document.getElementById('solvedCell3');
let solvedCell4 = document.getElementById('solvedCell4');
let solvedCell5 = document.getElementById('solvedCell5');
let solvedCell6 = document.getElementById('solvedCell6');
let solvedCell7 = document.getElementById('solvedCell7');
let solvedCell8 = document.getElementById('solvedCell8');
let solvedCell9 = document.getElementById('solvedCell9');
let solvedCell10 = document.getElementById('solvedCell10');
let solvedCell11 = document.getElementById('solvedCell11');
let solvedCell12 = document.getElementById('solvedCell12');
let solvedCell13 = document.getElementById('solvedCell13');
let solvedCell14 = document.getElementById('solvedCell14');
let solvedCell15 = document.getElementById('solvedCell15');
let solvedCell16 = document.getElementById('solvedCell16');
let solvedCell17 = document.getElementById('solvedCell17');
let solvedCell18 = document.getElementById('solvedCell18');
let solvedCell19 = document.getElementById('solvedCell19');
let solvedCell20 = document.getElementById('solvedCell20');
let solvedCell21 = document.getElementById('solvedCell21');
let solvedCell22 = document.getElementById('solvedCell22');
let solvedCell23 = document.getElementById('solvedCell23');
let solvedCell24 = document.getElementById('solvedCell24');
let solvedCell25 = document.getElementById('solvedCell25');
let solvedCell26 = document.getElementById('solvedCell26');
let solvedCell27 = document.getElementById('solvedCell27');
let solvedCell28 = document.getElementById('solvedCell28');
let solvedCell29 = document.getElementById('solvedCell29');
let solvedCell30 = document.getElementById('solvedCell30');
let solvedCell31 = document.getElementById('solvedCell31');
let solvedCell32 = document.getElementById('solvedCell32');
let solvedCell33 = document.getElementById('solvedCell33');
let solvedCell34 = document.getElementById('solvedCell34');
let solvedCell35 = document.getElementById('solvedCell35');
let solvedCell36 = document.getElementById('solvedCell36');
let solvedCell37 = document.getElementById('solvedCell37');
let solvedCell38 = document.getElementById('solvedCell38');
let solvedCell39 = document.getElementById('solvedCell39');
let solvedCell40 = document.getElementById('solvedCell40');
let solvedCell41 = document.getElementById('solvedCell41');
let solvedCell42 = document.getElementById('solvedCell42');
let solvedCell43 = document.getElementById('solvedCell43');
let solvedCell44 = document.getElementById('solvedCell44');
let solvedCell45 = document.getElementById('solvedCell45');
let solvedCell46 = document.getElementById('solvedCell46');
let solvedCell47 = document.getElementById('solvedCell47');
let solvedCell48 = document.getElementById('solvedCell48');
let solvedCell49 = document.getElementById('solvedCell49');
let solvedCell50 = document.getElementById('solvedCell50');
let solvedCell51 = document.getElementById('solvedCell51');
let solvedCell52 = document.getElementById('solvedCell52');
let solvedCell53 = document.getElementById('solvedCell53');
let solvedCell54 = document.getElementById('solvedCell54');
let solvedCell55 = document.getElementById('solvedCell55');
let solvedCell56 = document.getElementById('solvedCell56');
let solvedCell57 = document.getElementById('solvedCell57');
let solvedCell58 = document.getElementById('solvedCell58');
let solvedCell59 = document.getElementById('solvedCell59');
let solvedCell60 = document.getElementById('solvedCell60');
let solvedCell61 = document.getElementById('solvedCell61');
let solvedCell62 = document.getElementById('solvedCell62');
let solvedCell63 = document.getElementById('solvedCell63');
let solvedCell64 = document.getElementById('solvedCell64');
let solvedCell65 = document.getElementById('solvedCell65');
let solvedCell66 = document.getElementById('solvedCell66');
let solvedCell67 = document.getElementById('solvedCell67');
let solvedCell68 = document.getElementById('solvedCell68');
let solvedCell69 = document.getElementById('solvedCell69');
let solvedCell70 = document.getElementById('solvedCell70');
let solvedCell71 = document.getElementById('solvedCell71');
let solvedCell72 = document.getElementById('solvedCell72');
let solvedCell73 = document.getElementById('solvedCell73');
let solvedCell74 = document.getElementById('solvedCell74');
let solvedCell75 = document.getElementById('solvedCell75');
let solvedCell76 = document.getElementById('solvedCell76');
let solvedCell77 = document.getElementById('solvedCell77');
let solvedCell78 = document.getElementById('solvedCell78');
let solvedCell79 = document.getElementById('solvedCell79');
let solvedCell80 = document.getElementById('solvedCell80');
let solvedCell81 = document.getElementById('solvedCell81');

//displays each value in the solved sudoku readonly input fields
function display(puzzle) {
  solvedCell1.value = puzzle.flat()[0];
  solvedCell2.value = puzzle.flat()[1];
  solvedCell3.value = puzzle.flat()[2];
  solvedCell4.value = puzzle.flat()[3];
  solvedCell5.value = puzzle.flat()[4];
  solvedCell6.value = puzzle.flat()[5];
  solvedCell7.value = puzzle.flat()[6];
  solvedCell8.value = puzzle.flat()[7];
  solvedCell9.value = puzzle.flat()[8];
  solvedCell10.value = puzzle.flat()[9];
  solvedCell11.value = puzzle.flat()[10];
  solvedCell12.value = puzzle.flat()[11];
  solvedCell13.value = puzzle.flat()[12];
  solvedCell14.value = puzzle.flat()[13];
  solvedCell15.value = puzzle.flat()[14];
  solvedCell16.value = puzzle.flat()[15];
  solvedCell17.value = puzzle.flat()[16];
  solvedCell18.value = puzzle.flat()[17];
  solvedCell19.value = puzzle.flat()[18];
  solvedCell20.value = puzzle.flat()[19];
  solvedCell21.value = puzzle.flat()[20];
  solvedCell22.value = puzzle.flat()[21];
  solvedCell23.value = puzzle.flat()[22];
  solvedCell24.value = puzzle.flat()[23];
  solvedCell25.value = puzzle.flat()[24];
  solvedCell26.value = puzzle.flat()[25];
  solvedCell27.value = puzzle.flat()[26];
  solvedCell28.value = puzzle.flat()[27];
  solvedCell29.value = puzzle.flat()[28];
  solvedCell30.value = puzzle.flat()[29];
  solvedCell31.value = puzzle.flat()[30];
  solvedCell32.value = puzzle.flat()[31];
  solvedCell33.value = puzzle.flat()[32];
  solvedCell34.value = puzzle.flat()[33];
  solvedCell35.value = puzzle.flat()[34];
  solvedCell36.value = puzzle.flat()[35];
  solvedCell37.value = puzzle.flat()[36];
  solvedCell38.value = puzzle.flat()[37];
  solvedCell39.value = puzzle.flat()[38];
  solvedCell40.value = puzzle.flat()[39];
  solvedCell41.value = puzzle.flat()[40];
  solvedCell42.value = puzzle.flat()[41];
  solvedCell43.value = puzzle.flat()[42];
  solvedCell44.value = puzzle.flat()[43];
  solvedCell45.value = puzzle.flat()[44];
  solvedCell46.value = puzzle.flat()[45];
  solvedCell47.value = puzzle.flat()[46];
  solvedCell48.value = puzzle.flat()[47];
  solvedCell49.value = puzzle.flat()[48];
  solvedCell50.value = puzzle.flat()[49];
  solvedCell51.value = puzzle.flat()[50];
  solvedCell52.value = puzzle.flat()[51];
  solvedCell53.value = puzzle.flat()[52];
  solvedCell54.value = puzzle.flat()[53];
  solvedCell55.value = puzzle.flat()[54];
  solvedCell56.value = puzzle.flat()[55];
  solvedCell57.value = puzzle.flat()[56];
  solvedCell58.value = puzzle.flat()[57];
  solvedCell59.value = puzzle.flat()[58];
  solvedCell60.value = puzzle.flat()[59];
  solvedCell61.value = puzzle.flat()[60];
  solvedCell62.value = puzzle.flat()[61];
  solvedCell63.value = puzzle.flat()[62];
  solvedCell64.value = puzzle.flat()[63];
  solvedCell65.value = puzzle.flat()[64];
  solvedCell66.value = puzzle.flat()[65];
  solvedCell67.value = puzzle.flat()[66];
  solvedCell68.value = puzzle.flat()[67];
  solvedCell69.value = puzzle.flat()[68];
  solvedCell70.value = puzzle.flat()[69];
  solvedCell71.value = puzzle.flat()[70];
  solvedCell72.value = puzzle.flat()[71];
  solvedCell73.value = puzzle.flat()[72];
  solvedCell74.value = puzzle.flat()[73];
  solvedCell75.value = puzzle.flat()[74];
  solvedCell76.value = puzzle.flat()[75];
  solvedCell77.value = puzzle.flat()[76];
  solvedCell78.value = puzzle.flat()[77];
  solvedCell79.value = puzzle.flat()[78];
  solvedCell80.value = puzzle.flat()[79];
  solvedCell81.value = puzzle.flat()[80];

  if (solvedCell1.value === '0') {
    solvedCell1.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell1.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell2.value === '0') {
    solvedCell2.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell2.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell3.value === '0') {
    solvedCell3.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell3.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell4.value === '0') {
    solvedCell4.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell4.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell5.value === '0') {
    solvedCell5.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell5.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell6.value === '0') {
    solvedCell6.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell6.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell7.value === '0') {
    solvedCell7.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell7.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell8.value === '0') {
    solvedCell8.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell8.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell9.value === '0') {
    solvedCell9.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell9.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell10.value === '0') {
    solvedCell10.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell10.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell11.value === '0') {
    solvedCell11.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell11.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell12.value === '0') {
    solvedCell12.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell12.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell13.value === '0') {
    solvedCell13.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell13.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell14.value === '0') {
    solvedCell14.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell14.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell15.value === '0') {
    solvedCell15.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell15.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell16.value === '0') {
    solvedCell16.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell16.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell17.value === '0') {
    solvedCell17.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell17.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell18.value === '0') {
    solvedCell18.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell18.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell19.value === '0') {
    solvedCell19.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell19.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell20.value === '0') {
    solvedCell20.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell20.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell21.value === '0') {
    solvedCell21.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell21.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell22.value === '0') {
    solvedCell22.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell22.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell23.value === '0') {
    solvedCell23.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell23.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell24.value === '0') {
    solvedCell24.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell24.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell25.value === '0') {
    solvedCell25.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell25.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell26.value === '0') {
    solvedCell26.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell26.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell27.value === '0') {
    solvedCell27.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell27.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell28.value === '0') {
    solvedCell28.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell28.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell29.value === '0') {
    solvedCell29.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell29.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell30.value === '0') {
    solvedCell30.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell30.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell31.value === '0') {
    solvedCell31.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell31.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell32.value === '0') {
    solvedCell32.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell32.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell33.value === '0') {
    solvedCell33.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell33.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell34.value === '0') {
    solvedCell34.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell34.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell35.value === '0') {
    solvedCell35.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell35.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell36.value === '0') {
    solvedCell36.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell36.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell37.value === '0') {
    solvedCell37.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell37.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell38.value === '0') {
    solvedCell38.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell38.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell39.value === '0') {
    solvedCell39.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell39.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell40.value === '0') {
    solvedCell40.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell40.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell41.value === '0') {
    solvedCell41.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell41.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell42.value === '0') {
    solvedCell42.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell42.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell43.value === '0') {
    solvedCell43.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell43.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell44.value === '0') {
    solvedCell44.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell44.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell45.value === '0') {
    solvedCell45.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell45.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell46.value === '0') {
    solvedCell46.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell46.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell47.value === '0') {
    solvedCell47.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell47.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell48.value === '0') {
    solvedCell48.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell48.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell49.value === '0') {
    solvedCell49.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell49.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell50.value === '0') {
    solvedCell50.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell50.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell51.value === '0') {
    solvedCell51.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell51.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell52.value === '0') {
    solvedCell52.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell52.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell53.value === '0') {
    solvedCell53.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell53.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell54.value === '0') {
    solvedCell54.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell54.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell55.value === '0') {
    solvedCell55.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell55.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell56.value === '0') {
    solvedCell56.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell56.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell57.value === '0') {
    solvedCell57.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell57.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell58.value === '0') {
    solvedCell58.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell58.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell59.value === '0') {
    solvedCell59.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell59.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell60.value === '0') {
    solvedCell60.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell60.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell61.value === '0') {
    solvedCell61.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell61.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell62.value === '0') {
    solvedCell62.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell62.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell63.value === '0') {
    solvedCell63.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell63.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell64.value === '0') {
    solvedCell64.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell64.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell65.value === '0') {
    solvedCell65.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell65.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell66.value === '0') {
    solvedCell66.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell66.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell67.value === '0') {
    solvedCell67.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell67.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell68.value === '0') {
    solvedCell68.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell68.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell69.value === '0') {
    solvedCell69.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell69.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell70.value === '0') {
    solvedCell70.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell70.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell71.value === '0') {
    solvedCell71.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell71.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell72.value === '0') {
    solvedCell72.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell72.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell73.value === '0') {
    solvedCell73.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell73.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell74.value === '0') {
    solvedCell74.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell74.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell75.value === '0') {
    solvedCell75.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell75.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell76.value === '0') {
    solvedCell76.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell76.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell77.value === '0') {
    solvedCell77.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell77.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell78.value === '0') {
    solvedCell78.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell78.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell79.value === '0') {
    solvedCell79.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell79.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell80.value === '0') {
    solvedCell80.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell80.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }
  if (solvedCell81.value === '0') {
    solvedCell81.style.color = 'rgba(255, 0, 0, 0)';
    solvedCell81.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
  }

  let solvedBox = document.getElementById('solvedSudoku');
  solvedBox.style.backgroundColor = 'bisque';
}

//resets all input fields to ''
function resetPage() {
  let inputs = document.getElementsByTagName('input');
  for (let key in inputs) {
    if (inputs[key].value !== undefined) {
      inputs[key].style.color = '';
      inputs[key].style.backgroundColor = '';
      inputs[key].value = '';
    }

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

    message.innerHTML =
      '<strong>Fill in known cells and leave unknown cells blank, then press SOLVE.</strong>';
    message.style.color = 'black';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  }
}

//resetButton
let reset = document.getElementById('reset');
reset.addEventListener('click', resetPage);

function getSudoku(puzzle) {
  inputPuzzle = puzzle;
  if (puzzle.flat()[0] !== 0) input1.value = puzzle.flat()[0];
  if (puzzle.flat()[1] !== 0) input2.value = puzzle.flat()[1];
  if (puzzle.flat()[2] !== 0) input3.value = puzzle.flat()[2];
  if (puzzle.flat()[3] !== 0) input4.value = puzzle.flat()[3];
  if (puzzle.flat()[4] !== 0) input5.value = puzzle.flat()[4];
  if (puzzle.flat()[5] !== 0) input6.value = puzzle.flat()[5];
  if (puzzle.flat()[6] !== 0) input7.value = puzzle.flat()[6];
  if (puzzle.flat()[7] !== 0) input8.value = puzzle.flat()[7];
  if (puzzle.flat()[8] !== 0) input9.value = puzzle.flat()[8];
  if (puzzle.flat()[9] !== 0) input10.value = puzzle.flat()[9];
  if (puzzle.flat()[10] !== 0) input11.value = puzzle.flat()[10];
  if (puzzle.flat()[11] !== 0) input12.value = puzzle.flat()[11];
  if (puzzle.flat()[12] !== 0) input13.value = puzzle.flat()[12];
  if (puzzle.flat()[13] !== 0) input14.value = puzzle.flat()[13];
  if (puzzle.flat()[14] !== 0) input15.value = puzzle.flat()[14];
  if (puzzle.flat()[15] !== 0) input16.value = puzzle.flat()[15];
  if (puzzle.flat()[16] !== 0) input17.value = puzzle.flat()[16];
  if (puzzle.flat()[17] !== 0) input18.value = puzzle.flat()[17];
  if (puzzle.flat()[18] !== 0) input19.value = puzzle.flat()[18];
  if (puzzle.flat()[19] !== 0) input20.value = puzzle.flat()[19];
  if (puzzle.flat()[20] !== 0) input21.value = puzzle.flat()[20];
  if (puzzle.flat()[21] !== 0) input22.value = puzzle.flat()[21];
  if (puzzle.flat()[22] !== 0) input23.value = puzzle.flat()[22];
  if (puzzle.flat()[23] !== 0) input24.value = puzzle.flat()[23];
  if (puzzle.flat()[24] !== 0) input25.value = puzzle.flat()[24];
  if (puzzle.flat()[25] !== 0) input26.value = puzzle.flat()[25];
  if (puzzle.flat()[26] !== 0) input27.value = puzzle.flat()[26];
  if (puzzle.flat()[27] !== 0) input28.value = puzzle.flat()[27];
  if (puzzle.flat()[28] !== 0) input29.value = puzzle.flat()[28];
  if (puzzle.flat()[29] !== 0) input30.value = puzzle.flat()[29];
  if (puzzle.flat()[30] !== 0) input31.value = puzzle.flat()[30];
  if (puzzle.flat()[31] !== 0) input32.value = puzzle.flat()[31];
  if (puzzle.flat()[32] !== 0) input33.value = puzzle.flat()[32];
  if (puzzle.flat()[33] !== 0) input34.value = puzzle.flat()[33];
  if (puzzle.flat()[34] !== 0) input35.value = puzzle.flat()[34];
  if (puzzle.flat()[35] !== 0) input36.value = puzzle.flat()[35];
  if (puzzle.flat()[36] !== 0) input37.value = puzzle.flat()[36];
  if (puzzle.flat()[37] !== 0) input38.value = puzzle.flat()[37];
  if (puzzle.flat()[38] !== 0) input39.value = puzzle.flat()[38];
  if (puzzle.flat()[39] !== 0) input40.value = puzzle.flat()[39];
  if (puzzle.flat()[40] !== 0) input41.value = puzzle.flat()[40];
  if (puzzle.flat()[41] !== 0) input42.value = puzzle.flat()[41];
  if (puzzle.flat()[42] !== 0) input43.value = puzzle.flat()[42];
  if (puzzle.flat()[43] !== 0) input44.value = puzzle.flat()[43];
  if (puzzle.flat()[44] !== 0) input45.value = puzzle.flat()[44];
  if (puzzle.flat()[45] !== 0) input46.value = puzzle.flat()[45];
  if (puzzle.flat()[46] !== 0) input47.value = puzzle.flat()[46];
  if (puzzle.flat()[47] !== 0) input48.value = puzzle.flat()[47];
  if (puzzle.flat()[48] !== 0) input49.value = puzzle.flat()[48];
  if (puzzle.flat()[49] !== 0) input50.value = puzzle.flat()[49];
  if (puzzle.flat()[50] !== 0) input51.value = puzzle.flat()[50];
  if (puzzle.flat()[51] !== 0) input52.value = puzzle.flat()[51];
  if (puzzle.flat()[52] !== 0) input53.value = puzzle.flat()[52];
  if (puzzle.flat()[53] !== 0) input54.value = puzzle.flat()[53];
  if (puzzle.flat()[54] !== 0) input55.value = puzzle.flat()[54];
  if (puzzle.flat()[55] !== 0) input56.value = puzzle.flat()[55];
  if (puzzle.flat()[56] !== 0) input57.value = puzzle.flat()[56];
  if (puzzle.flat()[57] !== 0) input58.value = puzzle.flat()[57];
  if (puzzle.flat()[58] !== 0) input59.value = puzzle.flat()[58];
  if (puzzle.flat()[59] !== 0) input60.value = puzzle.flat()[59];
  if (puzzle.flat()[60] !== 0) input61.value = puzzle.flat()[60];
  if (puzzle.flat()[61] !== 0) input62.value = puzzle.flat()[61];
  if (puzzle.flat()[62] !== 0) input63.value = puzzle.flat()[62];
  if (puzzle.flat()[63] !== 0) input64.value = puzzle.flat()[63];
  if (puzzle.flat()[64] !== 0) input65.value = puzzle.flat()[64];
  if (puzzle.flat()[65] !== 0) input66.value = puzzle.flat()[65];
  if (puzzle.flat()[66] !== 0) input67.value = puzzle.flat()[66];
  if (puzzle.flat()[67] !== 0) input68.value = puzzle.flat()[67];
  if (puzzle.flat()[68] !== 0) input69.value = puzzle.flat()[68];
  if (puzzle.flat()[69] !== 0) input70.value = puzzle.flat()[69];
  if (puzzle.flat()[70] !== 0) input71.value = puzzle.flat()[70];
  if (puzzle.flat()[71] !== 0) input72.value = puzzle.flat()[71];
  if (puzzle.flat()[72] !== 0) input73.value = puzzle.flat()[72];
  if (puzzle.flat()[73] !== 0) input74.value = puzzle.flat()[73];
  if (puzzle.flat()[74] !== 0) input75.value = puzzle.flat()[74];
  if (puzzle.flat()[75] !== 0) input76.value = puzzle.flat()[75];
  if (puzzle.flat()[76] !== 0) input77.value = puzzle.flat()[76];
  if (puzzle.flat()[77] !== 0) input78.value = puzzle.flat()[77];
  if (puzzle.flat()[78] !== 0) input79.value = puzzle.flat()[78];
  if (puzzle.flat()[79] !== 0) input80.value = puzzle.flat()[79];
  if (puzzle.flat()[80] !== 0) input81.value = puzzle.flat()[80];
}

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
const randomNum = (num) => {
  return Math.floor(Math.random() * num);
};

let curExampleIdx = 0;
let level;

let getSudokuButton = document.getElementById('getSudoku');
getSudokuButton.addEventListener('click', () => {
  resetPage();
  if (curExampleIdx > sudokuExamples.length - 1) curExampleIdx = 0;
  let num = curExampleIdx;
  let newInput = sudokuExamples[num];
  getSudoku(newInput);
  if (num === 0) level = 'Easy';
  if (num === 1) level = 'Medium';
  if (num === 2) level = 'Hard';
  if (num === 3) level = 'Expert';
  link.value = `Level: ${level}`;
  ++curExampleIdx;
});

// function test() {
//   if (checkFor17(hardSudoku)) {
//     let solvedSudoku = sudokuSolver(hardSudoku);
//     display(solvedSudoku);
//     if (
//       solvedSudoku.flat().reduce((result, number) => {
//         if (number === 0) return false;
//         else return result;
//       }, true)
//     ) {
//       message.innerHTML = '<strong>Dang that was fast!</strong>';
//       message.style.color = 'black';
//     } else {
//       message.innerHTML =
//         '<strong>Sudoku is either invalid or too hard for the Sudoku Solver :(</strong>';
//       message.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
//     }
//   } else {
//     message.innerHTML =
//       '<strong>Invalid Sudoku. A minimum of 17 cells mut be filled in.</strong>';
//     message.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
//   }
// }

// //remove the 8 and replace with a 0 at hardSudoku[2][5] to test a Sudoku that is too hard or invalid

// test();

// for (let i = 1; i < 82; i++) {
//   console.log(`solvedCell${i}.style.color = 'black';
//   solvedCell${i}.style.backgroundColor = 'white'`);
// }
