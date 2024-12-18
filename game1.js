let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let isComputerTurn = false;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const gameResult = document.getElementById('game-result');

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (gameOver || board[index] !== '' || isComputerTurn) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.disabled = true;

    if (checkWinner()) {
      gameOver = true;
      showWinningAnimation();
      gameResult.textContent = `Pemenang: Pemain ${currentPlayer}`;
      gameResult.classList.add(currentPlayer === 'X' ? 'win' : 'lose');
    } else if (board.every(cell => cell !== '')) {
      gameOver = true;
      gameResult.textContent = "Hasil: Seri";
      gameResult.classList.add('draw');
    } else {
      currentPlayer = 'O';
      status.textContent = `Giliran: Pemain ${currentPlayer}`;
      computerMove();
    }
  });
});

resetButton.addEventListener('click', resetGame);

function computerMove() {
  isComputerTurn = true;

  // Pilih langkah yang lebih mudah
  let availableCells = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
  let randomMove = availableCells[0]; // Pilih langkah pertama yang tersedia (sangat mudah)

  setTimeout(() => {
    board[randomMove] = 'O';
    cells[randomMove].textContent = 'O';
    cells[randomMove].disabled = true;

    if (checkWinner()) {
      gameOver = true;
      showWinningAnimation();
      gameResult.textContent = 'Pemenang: Pemain O';
      gameResult.classList.add('lose');
    } else if (board.every(cell => cell !== '')) {
      gameOver = true;
      gameResult.textContent = "Hasil: Seri";
      gameResult.classList.add('draw');
    } else {
      currentPlayer = 'X';
      status.textContent = `Giliran: Pemain ${currentPlayer}`;
      isComputerTurn = false;
    }
  }, 800);
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      return pattern; // Return winning pattern
    }
  }
  return null;
}

function showWinningAnimation() {
  const winningPattern = checkWinner();
  if (winningPattern) {
    winningPattern.forEach(index => {
      cells[index].classList.add('highlight'); // Tambahkan animasi
    });
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  isComputerTurn = false;
  currentPlayer = 'X';
  status.textContent = 'Giliran: Pemain X';
  gameResult.textContent = '';
  gameResult.classList.remove('win', 'lose', 'draw');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('highlight'); // Hapus highlight animasi
  });
}
