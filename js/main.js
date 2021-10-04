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
    [[2,1],[0,1],[1,0],[1,1]],
    [[],[],[],[]],
    [[],[],[],[]],
    [[],[],[],[]]
  ]
}

const movingItem = {
  type: "tree",
  direction: 0,
  top: 0,
  left: 3
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
  const movingBlocks = document.querySelectorAll(".moving")
  movingBlocks.forEach(moving => {
    moving.classList.remove(type, "moving")
  })
  blocks[type][direction].forEach(block => {
    const x = block[0] + left
    const y = block[1] + top
    const target = playground.childNodes[y] ? 
    playground.childNodes[y].childNodes[0].childNodes[x] : null
    target.classList.add(type, "moving")
  });
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount
  renderBlocks()
}

// event handling
document.addEventListener("keydown", e => {
  console.log(e)
  switch(e.keyCode){
    case 39:
      moveBlock("left", 1)
      break
    case 37:
      moveBlock("left", -1)
      break
    default:
      break
  }
})
