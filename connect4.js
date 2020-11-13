/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    let innerArr = []
    for (let x = 0; x < WIDTH; x++) {
      innerArr.push(undefined)
    }
    board.push(innerArr)
  }
  return board
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.querySelector('#board')
  
  // create top column tr elements with id of "column-top" and append them to the htmlBoard
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: create tr elements for rows and td elements for cells, append cells to rows and then append rows to HTMLboard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // write the real version of this, rather than always returning 0
  for(let y = HEIGHT-1; y >= 0; y--) {
    let cell = document.querySelector(`#\\3${y} -${x}`)
    if (!cell.hasChildNodes()) {
      return y
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell, update player
  const div = document.createElement('div')

  div.classList.add('piece')

  if (currPlayer === 1) {
    div.classList.add('p1')
  } else {
    div.classList.add('p2')
  }
  let tdCell = document.querySelector(`#\\3${y} -${x}`)
  tdCell.append(div)
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  const endMessage = document.querySelector('#end-message')
  endMessage.innerHTML = msg
  resetGame()
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame

    if (board.every(row => row.every(cell => cell))) {
        endGame(`This game ends in a tie...`)
      }

  // switch players
  // switch currPlayer 1 <-> 2
  if (currPlayer === 1) {
    currPlayer = 2
  } else {
    currPlayer = 1
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function resetGame() {
  const button = document.createElement('button')
  const buttonDiv = document.querySelector('#reset-button')
  button.innerHTML = "Play again?"
  buttonDiv.append(button);

  buttonDiv.addEventListener('click', function () {
    location.reload()
    buttonDiv.remove()
  })
}

makeBoard();
makeHtmlBoard();
