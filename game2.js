let board = Array(16).fill(''); // Papan permainan 4x4
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

function computerMove() {
  isComputerTurn = true;

  // Prioritaskan langkah komputer
  let bestMove = findBestMove();
  setTimeout(() => {
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].disabled = true;

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

// Fungsi untuk menentukan langkah terbaik
function findBestMove() {
  // Cek jika komputer bisa menang
  for (let i = 0; i < 16; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (checkWinner()) {
        board[i] = '';
        return i; // Langkah menang
      }
      board[i] = '';
    }
  }

  // Cek jika perlu mencegah pemain menang
  for (let i = 0; i < 16; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (checkWinner()) {
        board[i] = '';
        return i; // Blokir pemain
      }
      board[i] = '';
    }
  }

  // Jika tidak ada langkah menang atau blokir, pilih langkah tengah jika kosong
  if (board[5] === '') return 5;
  if (board[10] === '') return 10;

  // Jika tidak ada, pilih langkah acak dari sel kosong
  let availableCells = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// Mengecek pemenang
function checkWinner() {
  const winPatterns = [
    // Baris
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
    // Kolom
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
    // Diagonal
    [0, 5, 10, 15], [3, 6, 9, 12]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c, d] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
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
  board = Array(16).fill('');
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
