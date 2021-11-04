import * as constant from './constant'
import {
  getSwingBlockVelocity
} from '../util/util'
import {
  getCurrentTime
} from '../util/util'
export const homeStartTrigger = (instance, engine) => {
  const homeIndexHeight = engine.getVariable(constant.homeIndexStart)
  const homeIndex = engine.getImg('homeStart')
  console.log(homeIndex, 'getimghomstart')
  const homeIndexWidth = homeIndex.width
  engine.triggerReaction(homeIndexWidth * 0.5, homeIndexHeight * 0.5)
  engine.setVariable(constant.gameStartNow, true)
}
export const homeStartAction = (instance, engine, time = 1000) => {
  const homeIndexHeight = engine.getVariable(constant.homeIndexStart)
  if (!instance.ready) {
    instance.x = engine.width / 2
    instance.y = homeIndexHeight * -1.5
    instance.ready = true
  }
  
  const start = engine.getVariable(constant.gameStartNow)
  if(!start) return
  instance.visible = false
  engine.getTimeMovement(
    constant.homeIndexStart,
    [
      [instance.y, instance.y - homeIndexHeight]
    ],
    (value) => {
      instance.y = value
    }, {
      after: () => {
        instance.y = homeIndexHeight * -1.5
      }
    }
  )
}
export const homeStartPainter = (instance, engine) => {
  const {
    ctx
  } = engine
  const homeIndexHeight = engine.getVariable(constant.homeIndexStart)
  const homeIndex = engine.getImg('homeStart')
  const homeIndexWidth = homeIndex.width
  ctx.drawImage(homeIndex, instance.x - (homeIndexWidth * 0.5 / 2), ctx.canvas.height - homeIndexHeight + 20, homeIndexWidth * 0.5, homeIndexHeight * 0.5)
  ctx.restore()
}
// 顶部title
export const homeTopTitleAction = (instance, engine) => {
  const start = engine.getVariable(constant.gameStartNow)
  if(!start) return
  instance.visible = false
}

function drawLine(engine, x, y){
  const { ctx } = engine
  const kmp = 30
  let lastTime = getCurrentTime()
  let now = new Date().getTime() * 1.2,
    		deltaTime = now - lastTime
        lastTime = now

  let a = 0
  a += deltaTime * 0.01
  const r = Math.sin(a)
  ctx.beginPath()
  ctx.lineWidth = 5
  ctx.lineCap = "round"
  ctx.strokeStyle = "rgba(255,255,255,1)"
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x, y-30, x + r * kmp, y - 120)
  ctx.stroke()
  ctx.restore()
}
export const homeTopTitlePainter = (instance, engine) => {
  const {
    ctx
  } = engine
  const homeTop = engine.getImg('main-index-title')
  const homeTopWidth = homeTop.width
  ctx.drawImage(
    homeTop,
    instance.x - (instance.x - (homeTopWidth * 0.5) / 2),
    0,
    homeTopWidth * 0.5,
    homeTop.height * 0.5
  )
  ctx.restore()
}