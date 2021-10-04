const playground = document.querySelector(".playground > ul")

// Setting
const gameRows = 20
const gameCols = 10

// variables
let score = 0
let duration = 500
let downInterval
let tempMovingItem

const blocks = {
  tree: [
    [[0,0],[0,1],[1,0],[1,1]],
    [[],[],[],[]],
    [[],[],[],[]],
    [[],[],[],[]]
  ]
}

const movingItem = {
  type: "",
  direction: 0,
  top: 0,
  left: 0
}

init ()

// functions

function init() {
  tempMovingItem = {...movingItem}

  for(let i=0; i < gameRows; i++) {
    prependNewLine()
  }
  renderBlocks()
}

function prependNewLine() {
  const li = document.createElement("li")
  const ul = document.createElement("ul")
  for(let j=0; j < gameCols; j++) {
    const matrix = document.createElement("li")
    ul.prepend(matrix)
  }
  li.prepend(ul)
  playground.prepend(li)
}

function renderBlocks() {
  const { type, direction, top, left } = tempMovingItem
  
}
