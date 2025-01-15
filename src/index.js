class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    this.sunk = this.hits >= this.length;
    return this.sunk;
  }
}

class Gameboard {
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
    if (y + length > 9 || x > 9) return null;
    for (let i = 0; i < length; i++) {
      if (this.grid[x][y + i].ship) {
        return "Ship already there";
      }
    }
    for (let i = 0; i < length; i++) {
      this.grid[x][y + i].ship = ship;
      this.grid[x][y + i].mark = "X";
    }
  }

  verticalShip(length, x, y, ship) {
    if (x + length > 9 || y > 9) return null;
    for (let i = 0; i < length; i++) {
      if (this.grid[x + i][y].ship) {
        return "Ship already there";
      }
    }
    for (let i = 0; i < length; i++) {
      this.grid[x + i][y].ship = ship;
      this.grid[x + i][y].mark = "X";
    }
  }

  placeShip(length, x, y, direction) {
    if (length < 1) return;
    let ship = new Ship(length);

    if (direction === "x") {
      this.horizontalShip(length, x, y, ship);
    } else {
      this.verticalShip(length, x, y, ship);
    }

    this.ships.push(ship);
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
}

module.exports = {
  Ship,
  Gameboard,
};
