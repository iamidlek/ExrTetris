import blocks from "./blocks.js"

// Dom
const playground = document.querySelector(".playground > ul")
const gameOver = document.querySelector(".game-over")
const reStartBtn = gameOver.querySelector("button")
const scoreDisplay = document.querySelector(".score")

// Setting
const gameRows = 23
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

// 게임당 한번 처음에만 실행되는 함수
function init() {
  // 내용 없음 객체만 만들기
  tempMovingItem = {...movingItem}

  for(let i=0; i < gameRows; i++) {
    prependNewLine()
  }
  generatedNewBlock()
}

// 맨 위의 줄에 한줄 생성
function prependNewLine() {
  // playground의 한 줄
  const li = document.createElement("li")
  // 한칸의 틀
  const ul = document.createElement("ul")
  // 한줄의 열 개수 만큼 생성
  for(let j=0; j < gameCols; j++) {
    const matrix = document.createElement("li")
    // 한칸의 틀에 실제 칸
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
      if (moveType === 'retry') {
        clearInterval(downInterval)
        showGameover()
      }
      setTimeout(()=> {
        renderBlocks('retry')
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
  checkMatch()
}

function checkMatch() {
  const childNodes = playground.childNodes
  childNodes.forEach( child => {
    let matched = true
    child.children[0].childNodes.forEach( li => {
      if (!li.classList.contains("seized")) {
        matched = false
      }
    })
    if (matched) {
      child.remove()
      prependNewLine()
      score++
      scoreDisplay.innerText = score
    }
  })  
  generatedNewBlock()
}

// 블럭 생성
function generatedNewBlock() {
  // 기본 내려오는 속도
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock('top',1)
  },duration)

  // key: val 을 배열로 전환 [tree , [4가지 모양]]
  const blockArray = Object.entries(blocks)
  const randomIndex = Math.floor(Math.random() * blockArray.length)
  movingItem.type = blockArray[randomIndex][0]
  // 기본 위치 선정
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

// 스페이스를 누를 경우
function dropBlock() {
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock("top",1)
  },7)
}

function showGameover() {
  gameOver.style.display = "flex"
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

reStartBtn.addEventListener("click", () => {
  playground.innerHTML = ""
  gameOver.style.display = "none"
  init()
})
