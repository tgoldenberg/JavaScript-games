// Tile prototype with default of 2
COLORS = ["#FF6600", "#CC0000", "#3333CC", "#285128", "#996600"];
var Tile = function(content) {
  this.content = content || 2;
  this.color = 0;
  this.moves = 0;
  this.movingDirection = "";
  this.setColor = function() {
    if (this.color >= COLORS.length) {
      return COLORS[this.color % COLORS.length];
    } else {
      return COLORS[this.color];
    }
  }
}

// Board prototype with 2-d array
var Board = function() {
  this.cells = [];
  this.score = 0;
  this.gameOver = false;
  // initialize the Board.cells
  this.setup = function(string) {
    if (!string) {
      this.cells = [
                  [ 0, 0, 0, 0 ],
                  [ 0, 0, 0, 0 ],
                  [ 0, 0, 0, 0 ],
                  [ 0, 0, 0, 0 ]
                  ]
    }
  }
}

Board.prototype.initializeCells = function() {
  // add two Tiles in the grid to start the game
  this.setRandomTile();
  this.setRandomTile();
}
Board.prototype.setRandomTile = function() {
  // first find the available tiles, then pick one randomly
  var arr = this.availableTiles();
  if (arr.length == 0) {
    alert("Game Over")
  }
  var idx = Math.floor(Math.random()*arr.length);
  var cellIndex = arr[idx] // returns {x: x, y: y}
  this.cells[cellIndex.x][cellIndex.y] = new Tile();
  return this.cells;
}

Board.prototype.eachCell = function(callback) {
  for(x=0; x<4; x++) {
    for(y=0; y<4; y++) {
      // callback here
    }
  }
}

Board.prototype.availableTiles = function() {
  // iterate through Board.cells and push cell if there is no Tile
  var availableTiles = [];
  for(x=0; x<4; x++) {
    for(y=0; y<4; y++) {
      if (this.cells[x][y] == 0) {
        availableTiles.push({x: x, y: y})
      }
    }
  }
  return availableTiles;
}

// basic function which hands off to specific directional functions
Board.prototype.move = function(direction) {
  switch(direction) {
    case "right":
      this.right(this.cells);
      break;
    case "down":
      this.down(this.cells);
      break;
    case "left":
      this.left(this.cells);
      break;
    case "up":
      this.up(this.cells);
      break;
  }
}

Board.prototype.right = function(board) {
  // iterate through cells from right to left and provide callback if cell has Tile
  for(x=3; x>=0; x--) {
    for(y=0; y<4; y++) {
      if (board[x][y] != 0) {
        this.adjustCell({x:x, y:y}, {vertical: 1, horizontal: 0});
      }
    }
  }
}

Board.prototype.left = function(board) {
  for(x=0; x<4; x++) {
    for(y=0; y<4; y++) {
      if (board[x][y] != 0) {
        this.adjustCell({x:x, y:y}, {vertical: -1, horizontal: 0});
      }
    }
  }
}

Board.prototype.up = function(board) {
  for(y=0; y<4; y++) {
    for(x=3; x>=0; x--) {
      if (board[x][y] != 0) {
        this.adjustCell({x:x, y:y}, {vertical: 0, horizontal: -1});
      }
    }
  }
}

Board.prototype.down = function(board) {
  for(x=0; x<4; x++) {
    for(y=3; y>=0; y--) {
      if (board[x][y] != 0) {
        this.adjustCell({x:x, y:y}, {vertical: 0, horizontal: 1});
      }
    }
  }
}


Board.prototype.adjustCell = function(coordinates, direction, board) {
  // recursive function to move piece while there are no Tiles in front
  if (board) {
    var column = coordinates.y;
    var row = coordinates.x;
    var vertical = direction.vertical;
    var horizontal = direction.horizontal;

    if (horizontal == 1) {
      while (column < 3) {
        var tile = board[row][column];
        column += horizontal;
        var otherTile = board[row][column];

        if (otherTile == 0) {
          board[row][column - horizontal] == 0;
          board[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          board[row][column - horizontal] = 0;
        }
      }
    } else if (horizontal == -1) {
      while (column > 0) {
        var tile = board[row][column];
        column += horizontal;
        var otherTile = board[row][column];

        if (otherTile == 0) {
          board[row][column - horizontal] == 0;
          board[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          board[row][column - horizontal] = 0;
        }
      }
    } else if (vertical == 1) {
      while (row < 3) {
        // save variables
        var tile = board[row][column];
        row += vertical;
        var otherTile = board[row][column];
        // move over if empty, or merge
        if (otherTile == 0) {
          board[row - vertical][column] = 0;
          board[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          board[row - vertical][column] = 0;
        }
      }
    } else if (vertical == -1) {
      while (row > 0) {
        // save variables
        var tile = board[row][column];
        row += vertical;
        var otherTile = board[row][column];
        // move over if empty, or merge
        if (otherTile == 0) {
          board[row - vertical][column] = 0;
          board[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          board[row - vertical][column] = 0;
        }
      }
    } return board;

  } else {
    var column = coordinates.y;
    var row = coordinates.x;
    this.cells[row][column].moves += 1;
    var vertical = direction.vertical;
    var horizontal = direction.horizontal;

    if (horizontal == 1) {
      while (column < 3) {
        // save the current tile and the next tile as variables
        var tile = this.cells[row][column];
        column += horizontal;
        var otherTile = this.cells[row][column];
        // if the next cell is empty, move the current tile over one space
        if (otherTile == 0) {
          this.cells[row][column - horizontal] = 0;
          this.cells[row][column] = tile;

        } else if (otherTile.content == tile.content) {
          this.cells[row][column - horizontal] = 0;
          this.cells[row][column].content *= 2;
          this.cells[row][column].color += 1;
          this.score += this.cells[row][column].content;
        }
      }
    } else if (vertical == 1) {
      while (row < 3) {
        // save variables

        var tile = this.cells[row][column];
        row += vertical;
        var otherTile = this.cells[row][column];
        // move over if empty, or merge
        if (otherTile == 0) {
          this.cells[row - vertical][column] = 0;
          this.cells[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          this.cells[row - vertical][column] = 0;
          this.cells[row][column].content *= 2;
          this.cells[row][column].color += 1;

          this.score += this.cells[row][column].content;
        }
      }
    } else if (vertical == -1) {
      while (row > 0) {
        // save variables

        var tile = this.cells[row][column];
        row += vertical;
        var otherTile = this.cells[row][column];
        // move over if empty, or merge
        if (otherTile == 0) {
          this.cells[row - vertical][column] = 0;
          this.cells[row][column] = tile;
        } else if (otherTile.content == tile.content) {
          this.cells[row - vertical][column] = 0;
          this.cells[row][column].content *= 2;
          this.cells[row][column].color += 1;
          this.score += this.cells[row][column].content;
        }
      }
    } else if (horizontal == -1) {
      while (column > 0) {
        // save the current tile and the next tile as variables
        var tile = this.cells[row][column];
        column += horizontal;
        var otherTile = this.cells[row][column];
        // if the next cell is empty, move the current tile over one space
        if (otherTile == 0) {
          this.cells[row][column - horizontal] = 0;
          this.cells[row][column] = tile;
          tile.moves += 1;
        } else if (otherTile.content == tile.content) {
          this.cells[row][column - horizontal] = 0;
          this.cells[row][column].content *= 2;
          this.cells[row][column].color += 1;
          this.score += this.cells[row][column].content;
        }
      }
    }
    return this.cells;
  }
}

Board.prototype.isFinished = function() {
  // logic for determining end of game
}
