let board = Array(25).fill(''); // Papan permainan 5x5
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
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Giliran: Pemain ${currentPlayer}`;
      if (currentPlayer === 'O') computerMove();
    }
  });
});

resetButton.addEventListener('click', resetGame);

// Fungsi AI yang lebih sulit tanpa Minimax
function computerMove() {
  isComputerTurn = true;

  setTimeout(() => {
    let bestMove = findBestMove();
    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';
    cells[bestMove.index].disabled = true;

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

// Fungsi untuk mencari langkah terbaik tanpa Minimax
function findBestMove() {
  const winningMove = findWinningMove('O');
  if (winningMove !== -1) return { index: winningMove };  // Langkah untuk menang

  const blockingMove = findWinningMove('X');
  if (blockingMove !== -1) return { index: blockingMove };  // Blokir pemain

  // Jika tidak ada langkah menang atau blokir, pilih langkah yang paling strategis (paling tengah atau sisi)
  const strategicMoves = [12, 6, 18, 8, 16, 4, 20, 10, 14, 2, 22, 0, 24];
  for (let move of strategicMoves) {
    if (board[move] === '') return { index: move };  // Pilih langkah strategis pertama yang kosong
  }

  // Jika tidak ada langkah strategis, pilih langkah acak dari sel kosong
  const emptyCells = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return { index: randomIndex };
}

// Fungsi untuk mencari langkah menang
function findWinningMove(player) {
  const winPatterns = [
    // Baris
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Kolom
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonal
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  for (const pattern of winPatterns) {
    const emptyIndex = pattern.find(index => board[index] === '');
    const nonEmptyIndexes = pattern.filter(index => board[index] !== '');

    if (nonEmptyIndexes.length === 4 && nonEmptyIndexes.every(index => board[index] === player)) {
      return emptyIndex; // Kembalikan indeks kosong yang bisa digunakan untuk menang
    }
  }
  return -1;  // Tidak ada langkah menang
}

// Mengecek pemenang
function checkWinner() {
  const winPatterns = [
    // Baris
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Kolom
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonal
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c, d, e] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e]) {
      return pattern; // Kembalikan pola pemenang
    }
  }
  return null;
}

// Animasi kemenangan
function showWinningAnimation() {
  const winningPattern = checkWinner();
  if (winningPattern) {
    winningPattern.forEach(index => {
      cells[index].classList.add('highlight'); // Tambahkan animasi highlight
    });
  }
}

// Reset permainan
function resetGame() {
  board = Array(25).fill('');
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
