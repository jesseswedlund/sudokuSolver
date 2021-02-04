function pairSum(arrNums, sum) {
  for (let i = 0; i < arrNums.length; i++) {
    let eleOne = arrNums[i];
    for (let j = 0; j < arrNums.length; j++) {
      let eleTwo = arrNums[j];
      if (eleOne + eleTwo === sum) return true;
    }
  }
  return false;
}

console.log("true?", pairSum([1, 1, 2, 3, 4, 5], 7));
console.log("true?", pairSum([1, 2, 3, 4, 4, 5], 7));
console.log("true?", pairSum([1, 3, 5, 7, 8, 9, 10], 16));
console.log("false?", pairSum([1, 2, 3, 4, 5], 10));
console.log("false?", pairSum([1, 2, 3, 7, 8], 7));
console.log("false?", pairSum([1, 2, 3, 4, 5], 2));

// edge test cases
console.log("false?", pairSum([1], 2));
console.log("false?", pairSum([], 2));
