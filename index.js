/*
  Oscar Oswaldo Estrada Morales
  Artificial Intelligence for Connect 4
*/
import io from 'socket.io-client';

// Function to check if any player has won.
function checkWinner(board, player) {
  // Check rows
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j <= board[i].length - 4; j++) {
      if (
        board[i][j] === player &&
        board[i][j + 1] === player &&
        board[i][j + 2] === player &&
        board[i][j + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check columns
  for (let i = 0; i <= board.length - 4; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (
        board[i][j] === player &&
        board[i + 1][j] === player &&
        board[i + 2][j] === player &&
        board[i + 3][j] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonals (left to right)
  for (let i = 0; i <= board.length - 4; i++) {
    for (let j = 0; j <= board[i].length - 4; j++) {
      if (
        board[i][j] === player &&
        board[i + 1][j + 1] === player &&
        board[i + 2][j + 2] === player &&
        board[i + 3][j + 3] === player
      ) {
        return true;
      }
    }
  }

  // Check diagonals (right to left)
  for (let i = 0; i <= board.length - 4; i++) {
    for (let j = 3; j < board[i].length; j++) {
      if (
        board[i][j] === player &&
        board[i + 1][j - 1] === player &&
        board[i + 2][j - 2] === player &&
        board[i + 3][j - 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
}

// Function to evaluate the current state of the board
function evaluateBoard(board, playerMax, playerMin) {
  let totalScore = 0;

  // Evaluate horizontal lines
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column <= board[row].length - 4; column++) {
      const line = board[row].slice(column, column + 4);
      totalScore += evaluateLine(line, playerMax, playerMin);
    }
  }

  // Evaluate vertical lines
  for (let column = 0; column < board[0].length; column++) {
    for (let row = 0; row <= board.length - 4; row++) {
      const line = [
        board[row][column],
        board[row + 1][column],
        board[row + 2][column],
        board[row + 3][column]
      ];
      totalScore += evaluateLine(line, playerMax, playerMin);
    }
  }

  // Evaluate diagonal lines (left to right)
  for (let row = 0; row <= board.length - 4; row++) {
    for (let column = 0; column <= board[row].length - 4; column++) {
      const line = [
        board[row][column],
        board[row + 1][column + 1],
        board[row + 2][column + 2],
        board[row + 3][column + 3]
      ];
      totalScore += evaluateLine(line, playerMax, playerMin);
    }
  }

  // Evaluate diagonal lines (right to left)
  for (let row = 0; row <= board.length - 4; row++) {
    for (let column = 3; column < board[row].length; column++) {
      const line = [
        board[row][column],
        board[row + 1][column - 1],
        board[row + 2][column - 2],
        board[row + 3][column - 3]
      ];
      totalScore += evaluateLine(line, playerMax, playerMin);
    }
  }

  return totalScore;
}

// Function to get valid moves
function getValidMoves(board) {
  const validMoves = [];
  for (let column = 0; column < board[0].length; column++) {
    if (board[0][column] === 0) {
      validMoves.push(column);
    }
  }
  return validMoves;
}


// Function to evaluate a line of 4 positions (game's heuristic and how it works)
function evaluateLine(line, player) {
  let score = 0;
  const opponent = player === 1 ? 2 : 1;

  // Evaluate player's line
  if (line.filter(cell => cell === player).length === 4) {
    score += 100; // Add a high score if the line has 4 cells occupied by the player
  } else if (line.filter(cell => cell === player).length === 3 && line.filter(cell => cell === 0).length === 1) {
    score += 5; // Add a moderate score if the line has 3 cells occupied by the player and 1 empty cell
  } else if (line.filter(cell => cell === player).length === 2 && line.filter(cell => cell === 0).length === 2) {
    score += 2; // Add a low score if the line has 2 cells occupied by the player and 2 empty cells
  }

  // Evaluate opponent's line
  if (line.filter(cell => cell === opponent).length === 3 && line.filter(cell => cell === 0).length === 1) {
    score -= 4; // Subtract a score if the line has 3 cells occupied by the opponent and 1 empty cell
  }

  return score;
}

// Function to make a move on the board
function makeMove(board, column, player) {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][column] === 0) {
      board[row][column] = player;
      break;
    }
  }
}

// Minimax function with alpha-beta pruning
function minimax(board, depth, alpha, beta, isMaximizer, playerMax, playerMin) {
  const validMoves = getValidMoves(board);
  const maxWinner = checkWinner(board, playerMax);
  const minWinner = checkWinner(board, playerMin);
  const tie = validMoves.length === 0;

  if (depth === 0 || maxWinner || minWinner || tie) {
    if (maxWinner) {
      return 1000000000;
    } else if (minWinner) {
      return -1000000000;
    } else {
      return evaluateBoard(board, playerMax);
    }
  }

  if (isMaximizer) {
    let maxValue = -Infinity;
    for (let column of validMoves) {
      const newBoard = JSON.parse(JSON.stringify(board));
      makeMove(newBoard, column, playerMax);
      const value = minimax(newBoard, depth - 1, alpha, beta, false, playerMax, playerMin);
      maxValue = Math.max(maxValue, value);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break;
      }
    }
    return maxValue;
  } else {
    let minValue = Infinity;
    for (let column of validMoves) {
      const newBoard = JSON.parse(JSON.stringify(board));
      makeMove(newBoard, column, playerMin);
      const value = minimax(newBoard, depth - 1, alpha, beta, true, playerMax, playerMin);
      minValue = Math.min(minValue, value);
      beta = Math.min(beta, value);
      if (beta <= alpha) {
        break;
      }
    }
    return minValue;
  }
}

// Function for the AI player to make a move
function makeAutomaticMove(board, player) {
  const validMoves = getValidMoves(board);
  let bestScore = -Infinity;
  let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];
  const depth = 6; // Search depth of the game tree

  for (let column of validMoves) {
    const newBoard = JSON.parse(JSON.stringify(board));
    makeMove(newBoard, column, player);
    const score = minimax(newBoard, depth, -Infinity, Infinity, false, player, player === 1 ? 2 : 1);

    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }
  }
  return bestColumn;
}

// Parameters to connect to the server.
const serverUrl = "http://192.168.1.104:4000";
const socket = io(serverUrl);

const tournamentID = 142857;

socket.on('connect', () => {
  console.log("Connected to the server");

  socket.emit('signin', {
    user_name: "Oscar",
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

// Successful sign-in.
socket.on('ok_signin', () => {
  console.log("Login");
});

// Activate player when ready.
socket.on('ready', function (data) {
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;

  var movement = 0;
  movement = makeAutomaticMove(board, playerTurnID); // Analyze the move to make.

  socket.emit('play', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: movement
  });
});

// Function when the game finishes and prepare the player for the next match.
socket.on('finish', function (data) {
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});