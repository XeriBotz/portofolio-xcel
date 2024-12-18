let boardSize = 3;
let currentPlayer = 'X';
let gameBoard = [];
let isGameOver = false;
let aiDelay = 1000; // AI delay in ms for the move
let playerMove = true;

function startGame(size) {
    boardSize = size;
    document.getElementById('playGame').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';
    createBoard();
    resetGame();
}

function createBoard() {
    let boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';

    for (let i = 0; i < boardSize * boardSize; i++) {
        let btn = document.createElement('button');
        btn.addEventListener('click', () => playerTurn(i));
        boardDiv.appendChild(btn);
    }

    document.getElementById('board').style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
    document.getElementById('board').style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
}

function resetGame() {
    gameBoard = Array(boardSize * boardSize).fill(null);
    currentPlayer = 'X';
    isGameOver = false;
    playerMove = true;
    const buttons = document.querySelectorAll('#board button');
    buttons.forEach(btn => {
        btn.innerHTML = '';
        btn.disabled = false;
        btn.classList.remove('anim');
    });
    if (boardSize === 3) {
        aiDelay = 1000; // Easy mode
    } else if (boardSize === 4) {
        aiDelay = 1500; // Medium mode
    } else {
        aiDelay = 2000; // Hard mode
    }
}

function playerTurn(index) {
    if (gameBoard[index] || isGameOver || !playerMove) return;
    
    gameBoard[index] = currentPlayer;
    const button = document.querySelectorAll('#board button')[index];
    button.innerHTML = currentPlayer;
    button.disabled = true;
    
    if (checkWinner(currentPlayer)) {
        isGameOver = true;
        showWinner(currentPlayer);
    } else if (gameBoard.every(cell => cell !== null)) {
        isGameOver = true;
        showDraw();
    } else {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        playerMove = false;
        setTimeout(aiTurn, aiDelay);
    }
}

function aiTurn() {
    if (isGameOver) return;
    
    let availableMoves = gameBoard.map((val, index) => val === null ? index : -1).filter(val => val !== -1);
    let aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    gameBoard[aiMove] = 'O';
    const button = document.querySelectorAll('#board button')[aiMove];
    button.innerHTML = 'O';
    button.disabled = true;
    
    if (checkWinner('O')) {
        isGameOver = true;
        showWinner('O');
    } else if (gameBoard.every(cell => cell !== null)) {
        isGameOver = true;
        showDraw();
    } else {
        currentPlayer = 'X';
        playerMove = true;
    }
}

function checkWinner(player) {
    const winningCombinations = getWinningCombinations();
    
    return winningCombinations.some(combination => 
        combination.every(index => gameBoard[index] === player)
    );
}

function getWinningCombinations() {
    let combinations = [];
    
    // Rows
    for (let row = 0; row < boardSize; row++) {
        combinations.push(Array.from({ length: boardSize }, (_, i) => row * boardSize + i));
    }
    
    // Columns
    for (let col = 0; col < boardSize; col++) {
        combinations.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + col));
    }
    
    // Diagonals
    combinations.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
    combinations.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));
    
    return combinations;
}

function showWinner(winner) {
    alert(`${winner} wins!`);
    document.querySelectorAll('#board button').forEach(btn => btn.disabled = true);
}

function showDraw() {
    alert("It's a draw!");
}

function disableAllButtons() {
    document.querySelectorAll('#board button').forEach(btn => btn.disabled = true);
}
function highlightWinningCells(pattern) {
  pattern.forEach(index => {
    cells[index].classList.add('win');
  });
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(pattern);
      return true;
    }
  }
  return false;
}

