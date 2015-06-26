var board;

var setBoard = function() {
  $('.grid-box').html("").removeClass("shiny").css("background", "#e6e6e6").removeClass("bounceIn");
  for (x=0; x<=3; x++) {
    for (y=0; y<=3; y++) {
      if (board.cells[x][y].constructor == Tile) {
        var content = board.cells[x][y].content;
        var rowClass = ".row-" + y;
        var columnClass = ".column-" + x;
        $(columnClass).find(rowClass).addClass("shiny").html("<span>" + content + "</span>").css("background", board.cells[x][y].setColor());
        if (board.cells[x][y].moves == 0 || board.cells[x][y].canMerge == false) {
          $(columnClass).find(rowClass).addClass("bounceIn");
        }
      }
    }
  }
};

$(document).ready(function() {
  board = new Board();
  board.setup();
  board.initializeCells();
  setBoard();

  $('body').on('keyup', function(event) {
    var idx = event.keyCode.toString();
    var keys = {"37": "left", "38": "up", "39": "right", "40": "down"};
    var direction = keys[idx];

    board.move(direction);
    if (keys[idx]) {
      board.setRandomTile();
    }
    setBoard();
    $('.score').html(board.score);

  });
});

// var View = {}
//
// View.draw = function(board) {
//   $('.grid-box').html("").removeClass("shiny");
//   for (x=0; x<=3; x++) {
//     for (y=0; y<=3; y++) {
//       if (board.cells[x][y].constructor == Tile) {
//         var content = board.cells[x][y].content;
//         var rowClass = ".row-" + (y);
//         var columnClass = ".column-" + (x);
//         $(columnClass).find(rowClass).addClass("shiny").html("<span>" + content + "</span>");
//       }
//     }
//   }
// };
