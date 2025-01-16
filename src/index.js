import "./styles.css";
import { UI } from "./ui";

export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
    this.isSunk();
  }

  isSunk() {
    this.sunk = this.hits >= this.length;
    if (this.sunk) console.log("SUNK SHIP");
    return this.sunk;
  }
}

export class Gameboard {
  constructor() {
    this.size = 10;
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = { mark: "O", hit: false, ship: null };
      }
    }
    this.ships = [];
    this.misses = [];
  }

  horizontalShip(length, x, y, ship) {
    if (x < 0 || y < 0 || y + length > 9 || x > 9) return false;

    // Check surrounding cells
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= length; j++) {
        const checkX = x + i;
        const checkY = y + j;
        if (checkX >= 0 && checkX < 10 && checkY >= 0 && checkY < 10) {
          if (this.grid[checkX][checkY].ship) return false;
        }
      }
    }

    // Place ship
    for (let i = 0; i < length; i++) {
      this.grid[x][y + i].ship = ship;
      this.grid[x][y + i].mark = "X";
    }
    return true;
  }

  verticalShip(length, x, y, ship) {
    if (x < 0 || y < 0 || x + length > 9 || y > 9) return false;

    // Check surrounding cells
    for (let i = -1; i <= length; i++) {
      for (let j = -1; j <= 1; j++) {
        const checkX = x + i;
        const checkY = y + j;
        if (checkX >= 0 && checkX < 10 && checkY >= 0 && checkY < 10) {
          if (this.grid[checkX][checkY].ship) return false;
        }
      }
    }

    // Place ship
    for (let i = 0; i < length; i++) {
      this.grid[x + i][y].ship = ship;
      this.grid[x + i][y].mark = "X";
    }
    return true;
  }

  placeShip(length, x, y, direction) {
    if (length < 1) return false;
    let ship = new Ship(length);

    if (direction === "x") {
      // Need to check the return value
      const placed = this.horizontalShip(length, x, y, ship);
      if (placed) {
        this.ships.push(ship);
        return true;
      }
      return false;
    } else {
      const placed = this.verticalShip(length, x, y, ship);
      if (placed) {
        this.ships.push(ship);
        return true;
      }
      return false;
    }
  }

  checkIfHit(x, y) {
    if (this.grid[x][y].hit) return true;
  }

  receiveAttack(x, y) {
    if (this.checkIfHit(x, y)) return false;
    this.grid[x][y].hit = true;
    if (this.grid[x][y].ship) {
      this.grid[x][y].ship.hit();
      return true;
    } else {
      this.misses.push([x, y]);
    }
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export class Player {
  constructor(type) {
    this.gameboard = new Gameboard();
    this.type = type;
  }

  makeMove(opponentBoard, x, y) {
    opponentBoard.receiveAttack(x, y);
  }
}

const play = new UI();

play.initializeGame();
