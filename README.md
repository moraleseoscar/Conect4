# Connect4 AI Program

This program is a Connect4 game-playing program powered by Artificial Intelligence. It was developed as part of a university tournament and emerged as the winner.

## Installation

Before running the program, make sure to install the required dependencies by running the following command:

```
npm install
```

This will download the necessary Node modules, including the `socket.io-client` library.

## Description

The Connect4 AI program is designed to play the game Connect4 using Artificial Intelligence techniques. It employs the Minimax algorithm with alpha-beta pruning to make intelligent moves and evaluate the game board.

The code consists of the following functions:

- `checkWinner(board, player)`: This function checks if a player has won the game by examining the board state.

- `evaluateBoard(board, playerMax, playerMin)`: This function evaluates the current state of the game board and assigns a score based on the positions and alignments of the pieces.

- `getValidMoves(board)`: This function returns a list of valid moves that can be made on the board.

- `evaluateLine(line, player)`: This function evaluates a line of four positions and assigns a score based on the player's pieces and their arrangement.

- `makeMove(board, column, player)`: This function makes a move on the board by placing the player's piece in the specified column.

- `minimax(board, depth, alpha, beta, isMaximizer, playerMax, playerMin)`: This is the Minimax algorithm with alpha-beta pruning. It recursively evaluates the possible moves and returns the best score for the current player.

- `makeAutomaticMove(board, player)`: This function is responsible for the AI player's move. It analyzes the board state and uses the Minimax algorithm to determine the best move to make. This function is useful if you want to test the response from the AI. If you want to test the program, simply call this function, which will return the column where the next move is best placed.

The program also establishes a connection with a server using the `socket.io-client` library. It communicates with the server to sign in, receive game information, make moves, and signal readiness for the next game. The tournament administration code was provided by [@samuelchvez](https://github.com/samuelchvez).

For more information, feel free to explore the code files or contact me.

Happy gaming!
