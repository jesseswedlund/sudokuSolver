//for every cell, if it's value is not zero, remove that value from each the possible solution of every other cell in the same
//row, column and block. Then, if any cells have only one possible value left in the possibleSolutions array, change that cell's
//value to it. Each time a change is made, ++changes. Return the number of changes that were made.
export const possibleSolutionSolve = (puzzle) => {
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
export const onlyOne = (puzzle) => {
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
export const eliminate = (puzzle) => {
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
export const nakedPairs = (puzzle) => {
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
export const hiddenPairs = (puzzle) => {
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
        // console.log(pair, idx);
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
  // console.log(`comparing ${arr}`);
  // console.log(`to ${solutions}`);
  return arr.reduce((bool, cur) => {
    if (solutions.includes(cur)) return bool && true;
    else return bool && false;
  }, true);
};

//for every cell, if the cell has two or three possible solutions, consider it a potential naked triplet. Compare this cell to other cells in the same row, column, and block,
//looking for cells that might
export const nakedTriples = (puzzle) => {
  let changes = 0;
  let nakedTripleCandidates = puzzle.filter(
    (unit) =>
      unit.possibleSolutions.length < 4 && unit.possibleSolutions.length > 1
  );
  nakedTripleCandidates
    .filter((each) => each.possibleSolutions.length === 3)
    .forEach((candidate1) => {
      let solutions = candidate1.possibleSolutions.slice();
      // console.log(`CHECKING with ${candidate1.cell}`);
      // console.log(candidate1);
      // console.log(solutions);
      nakedTripleCandidates.forEach((candidate2) => {
        //check row for naked triple
        //if candidate2 is in the same row as candidate1 and candidate2's possibleSolutions are inculded in candidate1's possible solutions
        if (
          candidate1.cell !== candidate2.cell &&
          candidate1.row === candidate2.row &&
          compareArrSolutions(candidate2.possibleSolutions, solutions)
        ) {
          //console.log("found candidate 2, checking for candidate3");
          //then we will check the other nakedTripleCandidates for a third candidate in the same row who's possible solutions are inculded in candidate1's possible solutions
          nakedTripleCandidates.forEach((candidate3) => {
            if (
              candidate1.cell !== candidate3.cell &&
              candidate2.cell !== candidate3.cell &&
              candidate1.row === candidate3.row &&
              compareArrSolutions(candidate3.possibleSolutions, solutions)
            ) {
              //console.log(`candidate3 found: ${candidate3.possibleSolutions}`);
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
                  // console.log("rowTripleFound");
                  // console.log(candidate1);
                  // console.log(candidate1.possibleSolutions);
                  // console.log(candidate2);
                  // console.log(candidate2.possibleSolutions);
                  // console.log(candidate3);
                  // console.log(candidate3.possibleSolutions);
                  // console.log(one);
                  // console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      // console.log("ROW CHANGE MADE");
                      // console.log(one.possibleSolutions);
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
                  // console.log("columnTripleFound");
                  // console.log(candidate1);
                  // console.log(candidate1.possibleSolutions);
                  // console.log(candidate2);
                  // console.log(candidate2.possibleSolutions);
                  // console.log(candidate3);
                  // console.log(candidate3.possibleSolutions);
                  // console.log(one);
                  // console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      //console.log("COLUMN CHANGE MADE");
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
                  // console.log("blockTripleFound");
                  // console.log(candidate1);
                  // console.log(candidate1.possibleSolutions);
                  // console.log(candidate2);
                  // console.log(candidate2.possibleSolutions);
                  // console.log(candidate3);
                  // console.log(candidate3.possibleSolutions);
                  // console.log(one);
                  // console.log(one.possibleSolutions);
                  one.possibleSolutions.forEach((possibility) => {
                    if (solutions.includes(possibility)) {
                      let idx = puzzle[one.cell - 1].possibleSolutions.indexOf(
                        possibility
                      );
                      puzzle[one.cell - 1].possibleSolutions.splice(idx, 1);
                      // console.log("BLOCK CHANGE MADE");
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
