import { Player } from ".";

export class UI {
  constructor() {
    this.human = new Player("Human");
    this.computer = new Player("Computer");
    this.availableMoves = this.getAllAvailableMoves();
    this.isPlayerTurn = true;
    this.playerShips = [
      { length: 2 },
      { length: 2 },
      { length: 2 },
      { length: 2 },
      { length: 3 },
      { length: 3 },
      { length: 4 },
    ];
    this.computerShips = [
      { length: 2 },
      { length: 2 },
      { length: 2 },
      { length: 2 },
      { length: 3 },
      { length: 3 },
      { length: 4 },
    ];
    this.modal = document.getElementById("gameOverModal");
    this.modalMessage = document.getElementById("modalMessage");
    this.playAgainBtn = document.getElementById("playAgainBtn");
    this.playAgainBtn.addEventListener("click", () => this.restartGame());
    this.successfulHits = []; // Track successful hits
    this.nextMoves = [];
  }

  initializeGame() {
    this.placeShips(this.human, this.playerShips);
    this.placeShips(this.computer, this.computerShips);
    this.updateGame();
  }

  placeShips(player, ships) {
    for (let ship of ships) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 1000;

      while (!placed && attempts < maxAttempts) {
        const length = ship.length;
        const isVertical = Math.random() < 0.5;
        const x = this.randomNumer();
        const y = this.randomNumer();
        const direction = isVertical ? "y" : "x";

        placed = player.gameboard.placeShip(length, x, y, direction);
        attempts++;
      }

      if (!placed) {
        console.error(
          `Failed to place ship of length ${ship.length} after ${maxAttempts} attempts`
        );
      }
    }
  }

  renderGameBoard(player, elementId) {
    const boardElement = document.querySelector(elementId);
    boardElement.innerHTML = "";
    if (player.type === "Computer") {
      player.gameboard.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellElement = document.createElement("div");
          cellElement.dataset.x = rowIndex;
          cellElement.dataset.y = colIndex;
          cellElement.classList.add("cell");
          cellElement.classList.add("enemy");

          if (
            player.gameboard.grid[rowIndex][colIndex].hit === true &&
            player.gameboard.grid[rowIndex][colIndex].mark === "O"
          ) {
            cellElement.classList.add("M");
            cellElement.textContent = "X";
          }
          if (
            player.gameboard.grid[rowIndex][colIndex].hit === true &&
            player.gameboard.grid[rowIndex][colIndex].mark === "X"
          ) {
            cellElement.classList.add("H");
            cellElement.textContent = "X";
          }
          boardElement.append(cellElement);
          cellElement.addEventListener("click", () => {
            this.playGame(rowIndex, colIndex);
          });
        });
      });
    } else if (player.type === "Human") {
      player.gameboard.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellElement = document.createElement("div");
          cellElement.dataset.x = rowIndex;
          cellElement.dataset.y = colIndex;
          cellElement.classList.add("cell");

          if (player.gameboard.grid[rowIndex][colIndex].mark === "X") {
            cellElement.classList.add("S");
          }

          if (
            player.gameboard.grid[rowIndex][colIndex].hit === true &&
            player.gameboard.grid[rowIndex][colIndex].mark === "O"
          ) {
            cellElement.classList.add("M");
            cellElement.textContent = "X";
          }
          if (
            player.gameboard.grid[rowIndex][colIndex].hit === true &&
            player.gameboard.grid[rowIndex][colIndex].mark === "X"
          ) {
            cellElement.classList.add("H");
            cellElement.textContent = "X";
          }
          boardElement.append(cellElement);
        });
      });
    }
  }

  updateGame() {
    this.renderGameBoard(this.human, "#playerBoard");
    this.renderGameBoard(this.computer, "#computerBoard");
  }

  playGame(rowIndex, colIndex) {
    if (!this.isPlayerTurn) return;
    if (this.computer.gameboard.grid[rowIndex][colIndex].hit === true) return;
    this.playerMove(rowIndex, colIndex);
    this.updateGame();
    if (this.checkWin()) {
      return;
    }

    this.isPlayerTurn = false;

    setTimeout(() => {
      this.computerTurn();
      this.isPlayerTurn = true;
    }, 500);
  }

  computerTurn() {
    if (this.checkWin()) return;

    let x, y;

    // If we have priority moves from previous hits, try those first
    if (this.nextMoves.length > 0) {
      [x, y] = this.nextMoves.pop();
    }
    // Otherwise make a random move
    else if (this.availableMoves.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.availableMoves.length
      );
      [x, y] = this.availableMoves[randomIndex];
    }

    if (x !== undefined && y !== undefined) {
      // Make the move
      const wasHit = this.computerMove(x, y);

      // Remove the move from available moves
      this.availableMoves = this.availableMoves.filter(
        (move) => move[0] !== x || move[1] !== y
      );

      // If it was a hit, add adjacent cells to nextMoves
      if (wasHit) {
        this.successfulHits.push([x, y]);
        this.addAdjacentMoves(x, y);
      }

      this.updateGame();
    }
  }

  addAdjacentMoves(x, y) {
    // Define possible adjacent moves
    const adjacentMoves = [
      [x - 1, y], // up
      [x + 1, y], // down
      [x, y - 1], // left
      [x, y + 1], // right
    ];

    // Filter valid moves and add them to nextMoves
    adjacentMoves.forEach(([newX, newY]) => {
      // Check if move is within bounds and not already tried
      if (this.isValidMove(newX, newY)) {
        // Add to start of array to prioritize moves near recent hits
        this.nextMoves.unshift([newX, newY]);
      }
    });
  }

  isValidMove(x, y) {
    // Check if move is within bounds
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      return false;
    }

    // Check if move has already been made
    if (this.human.gameboard.grid[x][y].hit) {
      return false;
    }

    // Check if move is already in nextMoves
    if (this.nextMoves.some((move) => move[0] === x && move[1] === y)) {
      return false;
    }

    return true;
  }

  computerMove(x, y) {
    if (this.checkWin()) {
      return false;
    }
    this.computer.makeMove(this.human.gameboard, x, y);
    // Return true if it was a hit
    return this.human.gameboard.grid[x][y].ship !== null;
  }

  playerMove(rowIndex, colIndex) {
    if (this.checkWin()) {
      return;
    }
    this.human.makeMove(this.computer.gameboard, rowIndex, colIndex);
  }

  checkWin() {
    if (this.computer.gameboard.allShipsSunk() === true) {
      this.showGameOverModal("Congratulations! You Win! 🎉");
      return true;
    }
    if (this.human.gameboard.allShipsSunk() === true) {
      this.showGameOverModal("Game Over! Computer Wins! 😔");
      return true;
    }
    return false;
  }

  showGameOverModal(message) {
    this.modalMessage.textContent = message;
    this.modal.style.display = "block";
  }

  restartGame() {
    // Reset game state
    this.human = new Player("Human");
    this.computer = new Player("Computer");
    this.availableMoves = this.getAllAvailableMoves();
    this.isPlayerTurn = true;

    // Hide modal
    this.modal.style.display = "none";

    // Reinitialize game
    this.initializeGame();
    this.updateGame();
  }

  randomNumer() {
    return Math.floor(Math.random() * 10);
  }

  getAllAvailableMoves() {
    const moves = [];
    this.human.gameboard.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell.hit) {
          // If the cell has not been hit
          moves.push([rowIndex, colIndex]); // Push the coordinates to the moves array
        }
      });
    });
    return moves;
  }

  printGameBoard(gameboard) {
    for (let i = 0; i < gameboard.size; i++) {
      let row = "";
      for (let j = 0; j < gameboard.size; j++) {
        if (gameboard.grid[i][j].mark === "X") {
          row += "X ";
        } else {
          row += "O ";
        }
      }
      console.log(row);
    }
  }
}

const playButton = document.querySelector("button");
const main = document.querySelector(".main");
playButton.addEventListener("click", () => {
  main.style.display = "grid";
});
