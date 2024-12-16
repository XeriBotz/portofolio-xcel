// game.js

const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-game');
let board = ['', '', '', '', '', '', '', '', ''];
let isPlayerTurn = true;

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Start new game
function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isPlayerTurn = true;
    gameStatus.textContent = "Your Turn";
    gameStatus.style.color = "#00e676";
    gameStatus.style.animation = "none";
    gameStatus.offsetHeight; // Trigger reflow to restart animation
    gameStatus.style.animation = "pulse 1s infinite";
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = "auto";
        cell.style.backgroundColor = "#2e3d49";
        cell.style.textDecoration = "none";  // Reset cross-line animation
    });
}

// Check for winner
function checkWinner(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return combination;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Handle cell click
function handleCellClick(event, index) {
    if (board[index] !== '' || !isPlayerTurn) return;

    // Player move
    board[index] = 'X';
    cells[index].textContent = 'X';
    cells[index].style.pointerEvents = "none";

    if (checkWinner('X')) {
        gameStatus.textContent = "You Win!";
        gameStatus.style.color = "#ff9800";
        gameStatus.style.animation = "none";
        animateWin(checkWinner('X'));
        return;
    }

    if (checkDraw()) {
        gameStatus.textContent = "It's a Draw!";
        gameStatus.style.color = "#ff5722";
        return;
    }

    isPlayerTurn = false;
    gameStatus.textContent = "Computer's Turn";

    // Computer move (AI)
    setTimeout(computerMove, 1000);
}

// Computer AI move (Minimax Algorithm)
function computerMove() {
    const bestMove = minimax(board, 'O');
    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';
    cells[bestMove.index].style.pointerEvents = "none";

    if (checkWinner('O')) {
        gameStatus.textContent = "Computer Wins!";
        gameStatus.style.color = "#ff5722";
        animateLoss(checkWinner('O'));
        return;
    }

    if (checkDraw()) {
        gameStatus.textContent = "It's a Draw!";
        gameStatus.style.color = "#ff5722";
        return;
    }

    isPlayerTurn = true;
    gameStatus.textContent = "Your Turn";
}

// Minimax Algorithm (AI logic)
function minimax(board, player) {
    const emptyCells = board.reduce((acc, val, idx) => val === '' ? acc.concat(idx) : acc, []);

    if (checkWinner('X')) return { score: -10 };
    if (checkWinner('O')) return { score: 10 };
    if (checkDraw()) return { score: 0 };

    let bestMove = null;

    if (player === 'O') {
        let bestScore = -Infinity;
        emptyCells.forEach(cell => {
            board[cell] = 'O';
            let score = minimax(board, 'X').score;
            board[cell] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = { index: cell, score: bestScore };
            }
        });
    } else {
        let bestScore = Infinity;
        emptyCells.forEach(cell => {
            board[cell] = 'X';
            let score = minimax(board, 'O').score;
            board[cell] = '';
            if (score < bestScore) {
                bestScore = score;
                bestMove = { index: cell, score: bestScore };
            }
        });
    }

    return bestMove;
}

// Animate winner
function animateWin(winningCombination) {
    winningCombination.forEach(index => {
        cells[index].style.backgroundColor = "#00e676";
        cells[index].style.textDecoration = "line-through";
    });
}

// Animate loss
function animateLoss(winningCombination) {
    winningCombination.forEach(index => {
        cells[index].style.backgroundColor = "#ff5722";
    });
}

// Reset game
resetButton.addEventListener('click', startGame);

// Initialize game
startGame();

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', (event) => handleCellClick(event, index));
});
