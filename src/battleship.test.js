const functions = require("./index");

describe("Ship class", () => {
  let ship;
  beforeEach(() => {
    ship = new functions.Ship(3);
  });

  test("Ship initialized to correct length", () => {
    expect(ship.length).toBe(3);
  });

  test("Hit", () => {
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("Hit but not sunk", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("Sunk", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("Sunk still", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe("Gameboard class", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new functions.Gameboard();
  });

  test("Place ship: add to ships basic", () => {
    gameboard.placeShip(3, 0, 0, "x");
    expect(gameboard.grid[0][1].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
    expect(gameboard.grid[0][2].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
    expect(gameboard.grid[0][0].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
  });

  test("Place ship: add to ships direction", () => {
    gameboard.placeShip(3, 0, 0, "y");
    expect(gameboard.grid[0][0].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
    expect(gameboard.grid[1][0].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
    expect(gameboard.grid[2][0].ship).toEqual({
      hits: 0,
      length: 3,
      sunk: false,
    });
  });

  test("Place ship: does not place ship, horizontal", () => {
    gameboard.placeShip(3, 9, 0, "y");
    expect(gameboard.grid[0][0]).toEqual({ mark: "O", hit: false, ship: null });
    expect(gameboard.grid[1][0]).toEqual({ mark: "O", hit: false, ship: null });
    expect(gameboard.grid[2][0]).toEqual({ mark: "O", hit: false, ship: null });
  });

  test("Place ship: change marker", () => {
    gameboard.placeShip(3, 0, 0, "y");
    expect(gameboard.grid[0][0].mark).toEqual("X");
    expect(gameboard.grid[1][0].mark).toEqual("X");
    expect(gameboard.grid[2][0].mark).toEqual("X");
  });

  test("Receive Attack: Hit a ship", () => {
    gameboard.placeShip(3, 0, 0, "x");
    gameboard.receiveAttack(0, 0);
    expect(gameboard.grid[0][0].hit).toBe(true);
    expect(gameboard.grid[0][0].ship.hits).toBe(1);
  });

  test("Receive Attack: already hit", () => {
    gameboard.placeShip(3, 0, 0, "x");
    gameboard.receiveAttack(0, 0);
    expect(gameboard.grid[0][0].hit).toBe(true);
    expect(gameboard.receiveAttack(0, 0)).toBe(false);
  });

  test("Receive Attack: misses array", () => {
    gameboard.placeShip(3, 0, 0, "x");
    gameboard.receiveAttack(4, 4);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.misses.length).toBe(1);
  });
});
