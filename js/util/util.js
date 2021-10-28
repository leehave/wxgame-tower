import * as constant from '../runtime/constant'
const res = wx.getSystemInfoSync()
const screenWidth = res.windowWidth
const screenHeight = res.windowHeight
export const checkMoveDown = engine =>
  (engine.checkTimeMovement(constant.moveDownMovement))

export const getMoveDownValue = (engine, store) => {
  const pixelsPerFrame = store ? store.pixelsPerFrame : engine.pixelsPerFrame.bind(engine)
  const successCount = engine.getVariable(constant.successCount)
  const calHeight = engine.getVariable(constant.blockHeight) * 2
  if (successCount <= 4) {
    return pixelsPerFrame(calHeight * 1.25)
  }
  return pixelsPerFrame(calHeight)
}

export const getAngleBase = (engine) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { hookAngle } = engine.getVariable(constant.gameUserOption)
  if (hookAngle) {
    return hookAngle(successCount, gameScore)
  }
  if (engine.getVariable(constant.hardMode)) {
    return 90
  }
  switch (true) {
    case successCount < 10:
      return 30
    case successCount < 20:
      return 60
    default:
      return 80
  }
}

export const getSwingBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { hookSpeed } = engine.getVariable(constant.gameUserOption)
  if (hookSpeed) {
    return hookSpeed(successCount, gameScore)
  }
  let hard
  switch (true) {
    case successCount < 1:
      hard = 0
      break
    case successCount < 10:
      hard = 1
      break
    case successCount < 20:
      hard = 0.8
      break
    case successCount < 30:
      hard = 0.7
      break
    default:
      hard = 0.74
      break
  }
  if (engine.getVariable(constant.hardMode)) {
    hard = 1.1
  }
  return Math.sin(time / (200 / hard))
}

export const getLandBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { landBlockSpeed } = engine.getVariable(constant.gameUserOption)
  if (landBlockSpeed) {
    return landBlockSpeed(successCount, gameScore)
  }
  const { width } = engine
  let hard
  switch (true) {
    case successCount < 5:
      hard = 0
      break
    case successCount < 13:
      hard = 0.001
      break
    case successCount < 23:
      hard = 0.002
      break
    default:
      hard = 0.003
      break
  }
  return Math.cos(time / 200) * hard * width
}

export const getHookStatus = (engine) => {
  if (engine.checkTimeMovement(constant.hookDownMovement)) {
    return constant.hookDown
  }
  if (engine.checkTimeMovement(constant.hookUpMovement)) {
    return constant.hookUp
  }
  return constant.hookNormal
}

export const touchEventHandler = (engine) => {
  if (!engine.getVariable(constant.gameStartNow)) return
  if (engine.debug && engine.paused) {
    return
  }
  if (getHookStatus(engine) !== constant.hookNormal) {
    return
  }
  engine.removeInstance('tutorial')
  engine.removeInstance('tutorial-arrow')
  const b = engine.getInstance(`block_${engine.getVariable(constant.blockCount)}`)
  if (b && b.status === constant.swing) {
    engine.setTimeMovement(constant.hookUpMovement, 500)
    b.status = constant.beforeDrop
  }
}

export const addSuccessCount = (engine) => {
  const { setGameSuccess } = engine.getVariable(constant.gameUserOption)
  const lastSuccessCount = engine.getVariable(constant.successCount)
  const success = lastSuccessCount + 1
  engine.setVariable(constant.successCount, success)
  if (engine.getVariable(constant.hardMode)) {
    engine.setVariable(constant.ropeHeight, engine.height * engine.utils.random(0.35, 0.55))
  }
  if (setGameSuccess) setGameSuccess(success)
}

export const addFailedCount = (engine) => {
  const { setGameFailed } = engine.getVariable(constant.gameUserOption)
  const lastFailedCount = engine.getVariable(constant.failedCount)
  const failed = lastFailedCount + 1
  engine.setVariable(constant.failedCount, failed)
  engine.setVariable(constant.perfectCount, 0)
  if (setGameFailed) setGameFailed(failed)
  if (failed >= 3) {
    engine.pauseAudio('bgm')
    engine.playAudio('game-over')
    engine.setVariable(constant.gameStartNow, false)
  }
}

export const addScore = (engine, isPerfect) => {
  const { setGameScore, successScore, perfectScore } = engine.getVariable(constant.gameUserOption)
  const lastPerfectCount = engine.getVariable(constant.perfectCount, 0)
  const lastGameScore = engine.getVariable(constant.gameScore)
  const perfect = isPerfect ? lastPerfectCount + 1 : 0
  const score = lastGameScore + (successScore || 25) + ((perfectScore || 25) * perfect)
  engine.setVariable(constant.gameScore, score)
  engine.setVariable(constant.perfectCount, perfect)
  if (setGameScore) setGameScore(score)
}

export const drawYellowString = (engine, option) => {
  const {
    string, size, x, y, textAlign
  } = option
  const { ctx } = engine
  const fontName = 'wenxue'
  const fontSize = size
  const lineSize = fontSize * 0.1
  ctx.save()
  ctx.beginPath()
  const gradient = ctx.createLinearGradient(0, 0, 0, y)
  gradient.addColorStop(0, '#FAD961')
  gradient.addColorStop(1, '#F76B1C')
  ctx.fillStyle = gradient
  ctx.lineWidth = lineSize
  ctx.strokeStyle = '#FFF'
  ctx.textAlign = textAlign || 'center'
  ctx.font = `${fontSize}px ${fontName}`
  ctx.strokeText(string, x, y)
  ctx.fillText(string, x, y)
  ctx.restore()
}

export const getCurrentTime = () => (performance.now())

export const random = (min, max) => (Math.random() * (max - min)) + min

export const randomPositiveNegative = () => (Math.random() < 0.5 ? -1 : 1)

export const isFunction = f => (typeof f === 'function')

export const isTouchDevice = () => ('ontouchstart' in window || window.navigator.msMaxTouchPoints)

// export const requestAnimationFrameTool = ((() => {
//   const FPS = 60
//   let timeout = 1000 / FPS
//   return requestAnimationFrame
//     ((callBack) => {
//       setTimeout(() => {
//         const start = getCurrentTime()
//         callBack(start)
//         const end = getCurrentTime()
//         timeout = (1000 / FPS) - (end - start)
//       }, timeout)
//     })
// }))()

export const arraySwap = (array, index1, index2) => {
  const temp = array[index2]
  array[index2] = array[index1]
  array[index1] = temp
}

export const drawImg = (ctx, src) => {
  ctx.drawImage(
    src,
    0,
    0,
    470,
    140,
    (screenWidth - 235)/2,
    (screenHeight - 70*2),
    235,
    70
  )
}
export const getLinearGradientColorRgb = (colorArr, colorIndex, proportion) => {
  const currentIndex = colorIndex + 1 >= colorArr.length ? colorArr.length - 1 : colorIndex
  const colorCurrent = colorArr[currentIndex]
  const nextIndex = currentIndex + 1 >= colorArr.length - 1 ? currentIndex : currentIndex + 1
  const colorNext = colorArr[nextIndex]
  const calRgbValue = (index) => {
    const current = colorCurrent[index]
    const next = colorNext[index]
    return Math.round(current + ((next - current) * proportion))
  }
  return `rgb(${calRgbValue(0)}, ${calRgbValue(1)}, ${calRgbValue(2)})`
}