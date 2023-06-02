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

## Heuristic Evaluation

The Connect4 program utilizes a heuristic evaluation function to determine the best move to make in the game. The function `evaluateLine(line, player)` plays a crucial role in evaluating the strength of a line of 4 positions on the game board.

#### How the Heuristic Works:

1. The function takes two parameters: `line` represents a line of 4 positions on the game board, and `player` indicates the player for whom the line is being evaluated.

2. The variable `score` is initialized to 0, which will be updated based on the evaluation.

3. The opponent's player number is determined by checking if `player` is equal to 1. If so, `opponent` is set to 2; otherwise, it is set to 1.

4. The function evaluates the player's line first:

   - If the line contains 4 cells occupied by the player, a high score of 100 is added to the `score`.

   - If the line contains 3 cells occupied by the player and 1 empty cell, a moderate score of 5 is added to the `score`.

   - If the line contains 2 cells occupied by the player and 2 empty cells, a low score of 2 is added to the `score`.

5. The function then evaluates the opponent's line:

   - If the line contains 3 cells occupied by the opponent and 1 empty cell, a penalty score of -4 is subtracted from the `score`.

6. Finally, the `score` is returned, representing the evaluation of the line based on the player's and opponent's presence and the number of empty cells.

This heuristic evaluation helps the program assess the strength of potential moves and make informed decisions to maximize the chances of winning the game. Feel free to modify the heuristic if you believe you can improve it. Everyone has their own criteria, and you can even optimize it according to your needs.

The program also establishes a connection with a server using the `socket.io-client` library. It communicates with the server to sign in, receive game information, make moves, and signal readiness for the next game. The tournament administration code was provided by [@samuelchvez](https://github.com/samuelchvez).

For more information, feel free to explore the code files or contact me.

Happy gaming!
