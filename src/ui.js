import { Player } from ".";

export class UI {
  constructor() {
    this.human = new Player("Human");
    this.computer = new Player("Computer");
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
            player.gameboard.grid[rowIndex][celcolIndexl].mark === "X"
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
    this.playerMove(rowIndex, colIndex);
    this.updateGame();
    if (this.checkWin()) {
      return;
    }
    this.updateGame();
    // setTimeout(computerMove, 1000);
    // this.updateGame();
  }

  playerMove(rowIndex, colIndex) {
    if (this.checkWin()) {
      return;
    }
    this.human.makeMove(this.computer.gameboard, rowIndex, colIndex);
  }

  checkWin() {
    if (this.computer.gameboard.allShipsSunk() === true) {
      console.log("YOU WIN!!");

      return true;
    }
  }
}
