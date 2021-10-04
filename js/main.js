import blocks from "./blocks.js"

// Dom
const playground = document.querySelector(".playground > ul")

// Setting
const gameRows = 20
const gameCols = 10

// variables
let score = 0
let duration = 500
let downInterval
let tempMovingItem

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
  generatedNewBlock()
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

function renderBlocks(moveType="") {
  const { type, direction, top, left } = tempMovingItem
  const movingBlocks = document.querySelectorAll(".moving")
  movingBlocks.forEach(moving => {
    moving.classList.remove(type, "moving")
  })
  blocks[type][direction].some(block => {
    const x = block[0] + left
    const y = block[1] + top

    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null

    const isAvailable = checkEmpty(target)

    if (isAvailable) {
      target.classList.add(type, "moving")
    } else {
      tempMovingItem = {...movingItem}
      setTimeout(()=> {
        renderBlocks()
        if (moveType === "top") {
          seizeBlock()
        }
      },0)
      // some을 끝내는 방법
      return true
    }
  });
  movingItem.left = left
  movingItem.top = top
  movingItem.direction = direction
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving")
  movingBlocks.forEach(moving => {
    moving.classList.remove("moving")
    moving.classList.add("seized")
  })
  generatedNewBlock()
}

function generatedNewBlock() {
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock('top',1)
  },duration)

  const blockArray = Object.entries(blocks)
  const randomIndex = Math.floor(Math.random() * blockArray.length)
  movingItem.type = blockArray[randomIndex][0]
  movingItem.top = 0
  movingItem.left = 3
  movingItem.direction = 0
  tempMovingItem = {...movingItem}
  renderBlocks()
}

function checkEmpty(target) {
  if(!target || target.classList.contains("seized")){
    return false
  }
  return true
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount
  renderBlocks(moveType)
}

function changeDirection() {
  const direction = tempMovingItem.direction
  direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1
  renderBlocks()
}

function dropBlock() {
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock("top",1)
  },7)
}

// event handling
document.addEventListener("keydown", e => {
  switch(e.keyCode){
    case 39:
      moveBlock("left", 1)
      break
    case 37:
      moveBlock("left", -1)
      break
    case 40:// 아래키
      moveBlock("top", 1)
      break
    case 38:// 위키
      changeDirection()
      break
    case 32:// 스페이스
      dropBlock()
      break
    default:
      break
  }
})
