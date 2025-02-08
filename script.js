document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  // Function to generate a random Sudoku Puzzle
  // Function to generate a fully solved Sudoku board
  function generateSolvedSudoku() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Randomize number order before solving
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers.sort(() => Math.random() - 0.5); // Shuffle numbers

    solveHelper(board, numbers); // Use the shuffled numbers in solving
    randomizeSudoku(board); // Further randomize the solved board

    return board;
}

function solveHelper(board, numbers) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    for (let num of numbers) { // Use shuffled order
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveHelper(board, numbers)) return true;
            board[row][col] = 0; // Backtrack
        }
    }
    return false;
}

// Function to shuffle rows and columns within 3×3 grids
function randomizeSudoku(board) {
    for (let i = 0; i < 3; i++) {
        swapRows(board, i * 3, i * 3 + Math.floor(Math.random() * 3));
        swapCols(board, i * 3, i * 3 + Math.floor(Math.random() * 3));
    }
}

// Swap two rows within the same 3×3 box
function swapRows(board, row1, row2) {
    if (row1 !== row2) [board[row1], board[row2]] = [board[row2], board[row1]];
}

// Swap two columns within the same 3×3 box
function swapCols(board, col1, col2) {
    if (col1 !== col2) {
        for (let row = 0; row < 9; row++) {
            [board[row][col1], board[row][col2]] = [board[row][col2], board[row][col1]];
        }
    }
}


  // Function to remove numbers randomly to create a solvable puzzle
  function generateRandomSudoku(difficulty) {
    let solvedBoard = generateSolvedSudoku(); // Step 1: Generate a fully solved board
    let puzzle = JSON.parse(JSON.stringify(solvedBoard)); // Deep copy

    let cellsToRemove = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50;
    let removedCells = new Set(); // To avoid duplicate removals

    while (removedCells.size < cellsToRemove) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        let cellKey = `${row}-${col}`;

        if (!removedCells.has(cellKey)) { // Ensure unique removal
            puzzle[row][col] = 0;
            removedCells.add(cellKey);
        }
    }
    return puzzle;
}



  // function to solve sudoku puzzle
  function solveSudoku(board) {
    const solvePuzzle = JSON.parse(JSON.stringify(board));
    solveHelper(solvePuzzle);
    return solvePuzzle;
  }

  function solveHelper(board) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
      return true;
    }
    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(board, row, col, num)) {
        board[row][col] = num;
        if (solveHelper(board)) {
          return true;
        }
        board[row][col] = 0; //BACKTRACKING
      }
    }
    return false;
  }

  function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  function isValidMove(board, row, col, num) {
    // row check & col check
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }
    }

    // grid check
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          // already present
          return false;
        }
      }
    }
    return true; // valid grid check
  }

  function validateInput(event) {
    let cell = event.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    let value = cell.value.trim();

    resetHighlights(); // Clear previous highlights

    if (value === "") {
        cell.classList.remove("incorrect"); // Remove red highlight if empty
        return;
    }

    let num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 9) {
        cell.classList.add("incorrect");
    } else if (!isValidMove(puzzle, row, col, num)) {
        highlightMistake(row, col, num); // Highlight only conflicting area
    } else {
        cell.classList.remove("incorrect"); // Remove incorrect class if valid
    }
}


function highlightMistake(row, col, num) {
    let cells = document.querySelectorAll(".cell");
    let rowConflict = false, colConflict = false, gridConflict = false;

    cells.forEach((cell) => {
        let cellRow = parseInt(cell.dataset.row);
        let cellCol = parseInt(cell.dataset.col);

        if (cellRow === row && cell.value == num) {
            rowConflict = true;
        }
        if (cellCol === col && cell.value == num) {
            colConflict = true;
        }
        if (isSameGrid(row, col, cellRow, cellCol) && cell.value == num) {
            gridConflict = true;
        }
    });

    // Highlight only the conflicting area
    cells.forEach((cell) => {
        let cellRow = parseInt(cell.dataset.row);
        let cellCol = parseInt(cell.dataset.col);

        if (rowConflict && cellRow === row) {
            cell.classList.add("highlight");
        }
        if (colConflict && cellCol === col) {
            cell.classList.add("highlight");
        }
        if (gridConflict && isSameGrid(row, col, cellRow, cellCol)) {
            cell.classList.add("highlight");
        }
    });
}


  function isSameGrid(row1, col1, row2, col2) {
    return (
      Math.floor(row1 / 3) === Math.floor(row2 / 3) &&
      Math.floor(col1 / 3) === Math.floor(col2 / 3)
    );
  }

  function resetHighlights() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("highlight", "incorrect");
    });
  }

  function createSudokuGrid(puzzle) {
    container.innerHTML = "";
    puzzle.forEach((row, rowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      row.forEach((cell, columnIndex) => {
        const cellElement = document.createElement("input");
        cellElement.classList.add("cell");
        cellElement.classList.add(
          (rowIndex + columnIndex) % 2 === 0
            ? "lightBackground"
            : "darkBackground"
        );
        cellElement.type = "text";
        cellElement.maxLength = 1;
        cellElement.value = cell !== 0 ? cell : "";
        cellElement.dataset.row = rowIndex; // Store row index
        cellElement.dataset.col = columnIndex; // Store column index

        // Allow editing only if the cell is empty in the initial puzzle
        if (cell !== 0) {
          cellElement.disabled = true;
        } else {
          cellElement.addEventListener("input", validateInput);
        }

        rowElement.appendChild(cellElement);
      });
      container.appendChild(rowElement);
    });
  }

  let initialPuzzle = generateRandomSudoku();
  let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
  let solvedPuzzle = [];

  document.getElementById("resetButton").addEventListener("click", function () {
    let selectedDifficulty = document.getElementById("difficulty").value;
    resetPuzzle(selectedDifficulty);
});


  function solvePuzzle() {
    solvedPuzzle = solveSudoku(puzzle);
    createSudokuGrid(solvedPuzzle);
  }

  function resetPuzzle(difficulty) {
    if (!difficulty) {
        difficulty = document.getElementById("difficulty").value; // Get selected difficulty
    }
    initialPuzzle = generateRandomSudoku(difficulty); // Ensure correct difficulty is used
    puzzle = JSON.parse(JSON.stringify(initialPuzzle));
    solvedPuzzle = [];
    createSudokuGrid(puzzle);
}



  createSudokuGrid(puzzle);
  // Attach event listeners to buttons
  document.getElementById("solveButton").addEventListener("click", solvePuzzle);
  document.getElementById("resetButton").addEventListener("click", resetPuzzle);

  document
    .getElementById("checkButton")
    .addEventListener("click", checkSolution);
  function checkSolution() {
    let isCorrect = true;
    let cells = document.querySelectorAll(".cell");

    resetHighlights(); // Clear previous highlights

    cells.forEach(cell => {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        let value = parseInt(cell.value) || 0;

        // Only validate editable cells (initially empty)
        if (!cell.disabled) {
            if (value < 1 || value > 9 || !isValidMove(puzzle, row, col, value)) {
                cell.classList.add("incorrect"); // Highlight incorrect cells in red
                isCorrect = false;
            }
        }
    });

    // Show message if the solution is correct or incorrect
    showResultMessage(isCorrect);
}


  function showResultMessage(isCorrect) {
    let resultDiv = document.getElementById("result");

    if (!resultDiv) {
      resultDiv = document.createElement("div");
      resultDiv.id = "result";
      document.body.appendChild(resultDiv);
    }

    resultDiv.className = isCorrect ? "result correct" : "result incorrect";
    resultDiv.textContent = isCorrect
      ? "✅ Correct Solution!"
      : "❌ Incorrect Solution!";
  }

  document.getElementById("hintButton").addEventListener("click", provideHint);
  function provideHint() {
    // Solve the puzzle in the background if not already solved
    if (solvedPuzzle.length === 0) {
      solvedPuzzle = solveSudoku(JSON.parse(JSON.stringify(initialPuzzle)));
    }

    let cells = document.querySelectorAll(".cell");

    for (let cell of cells) {
      let row = parseInt(cell.dataset.row);
      let col = parseInt(cell.dataset.col);

      // If the cell is empty, provide the correct value
      if (cell.value === "") {
        let correctValue = solvedPuzzle[row][col];
        cell.value = correctValue;
        cell.classList.add("hint");
        return; // Stop after providing one hint
      }
    }
  }

  function showResultMessage(isCorrect) {
    let resultDiv = document.getElementById("result");
    
    if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = "result";
        document.body.appendChild(resultDiv);
    }

    resultDiv.style.position = "fixed";
    resultDiv.style.bottom = "20px"; 
    resultDiv.style.left = "50%";
    resultDiv.style.transform = "translateX(-50%)";
    resultDiv.style.padding = "10px 20px";
    resultDiv.style.borderRadius = "8px";
    resultDiv.style.fontSize = "18px";
    resultDiv.style.fontWeight = "bold";
    resultDiv.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";

    if (isCorrect) {
        resultDiv.style.backgroundColor = "#4CAF50"; // Green for correct
        resultDiv.style.color = "white";
        resultDiv.textContent = "✅ Correct Solution!";
    } else {
        resultDiv.style.backgroundColor = "#FF4C4C"; // Red for incorrect
        resultDiv.style.color = "white";
        resultDiv.textContent = "❌ Incorrect Solution!";
    }
    setTimeout(() => {
        resultDiv.style.display = "none";
    }, 3000); // Hide after 3 seconds
}



});
