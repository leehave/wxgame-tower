import * as constant from './constant'

import {
  drawYellowString,
  getSwingBlockVelocity
} from '../util/util'

import {
  getCurrentTime
} from '../util/util'

const {
  homeTitleState: HOME_TITLE_STATE,
  homeTitleStateMap
} = constant

const HOME_TITLE_ANIMATE = 'HOME_TITLE_ANIMATE'

export const homeStartTrigger = (instance,engine) => {
  engine.setVariable(constant.gameStartNow, true)
  engine.start()
}
export const gameRestartTrigger = (instance, engine) => {
  // 移除重启按钮实例
  engine.removeInstance('gameRestart')
  engine.removeInstance('gameEnd')
  
  // 重启游戏
  engine.restart()
}
export const gameRestartAction = (instance, engine) => {
  const gameEndRestart = engine.getImg('restart')
  const gameEndBg = engine.getImg('endBg')
  const gameScore = engine.getImg('modal-over')
  const gameRestartVerible = engine.getVariable(constant.restartBtn)
  if (!instance.ready) {
    instance.x = engine.width / 2 - (engine.width - gameEndRestart.width * 0.5)/2
    instance.y = (engine.height - gameEndBg.height * 0.5)/2 + (gameScore.height * 0.5)/2 + gameEndRestart.width * 0.5, gameEndRestart.width * 0.5 + 32
    instance.ready = true
  }
  const start = engine.getVariable(constant.gameStartNow)
  if(!start) return
  instance.visible = false
  engine.getTimeMovement(
    constant.restartBtn,
    [
      [instance.y, instance.y - gameEndRestart.height]
    ],
    (value) => {
      instance.y = value
    }, {
      after: () => {
        instance.y = gameEndRestart.height * -1.5
      }
    }
  )
}
// 结束弹窗
export const gameEndScorePainter = (instance, engine) => {
  const gameEndTag = engine.getVariable(constant.gameEnd)
  if (!gameEndTag) return
  const gameEndBg = engine.getImg('endBg')
  const gameScore = engine.getImg('modal-over')
  const gameEndRestart = engine.getImg('restart')
  const { ctx } = engine
  instance.width = gameEndRestart.width * 0.5
  instance.height = gameEndRestart.height * 0.5
  // ctx.save()
  ctx.drawImage(gameEndRestart, (engine.width - gameEndRestart.width * 0.5)/2, (engine.height - gameEndBg.height * 0.5)/2 + (gameScore.height * 0.5)/2 + gameEndRestart.width * 0.5, gameEndRestart.width * 0.5, gameEndRestart.height * 0.5)
  ctx.restore()
}
export const gameEndPainter = (instance, engine) => {
  const gameEndTag = engine.getVariable(constant.gameEnd)
  if (!gameEndTag) return
  const gameEndBg = engine.getImg('endBg')
  const gameScore = engine.getImg('modal-over')
  const { ctx } = engine
  ctx.rect(0,0,engine.width, engine.height)
  ctx.fillStyle = 'RGBA(0,0,0,.5)'
  ctx.fillRect(0,0,engine.width,engine.height)
  // ctx.restore()
  ctx.drawImage(
    gameEndBg,
    (engine.width - gameEndBg.width * 0.5)/2,
    (engine.height - gameEndBg.height * 0.5)/2,
    gameEndBg.width * 0.5,
    gameEndBg.height * 0.5
  )
  // ctx.save()
  ctx.drawImage(gameScore, (engine.width - gameScore.width * 0.5)/2,
  (engine.height - gameEndBg.height * 0.5)/2 + (gameScore.height * 0.5)/2,
  gameScore.width * 0.5,
  gameScore.height * 0.5)
  drawYellowString(engine, {
    string: engine.getVariable(constant.gameScore),
    size: 36,
    textAlign: 'center',
    x: engine.width/ 2,
    y: (engine.height - gameEndBg.height * 0.5) / 2 + gameScore.height
  })
  const font = 'Microsoft Yahei'
  ctx.fillStyle = '#ff0000'
  ctx.strokeStyle = '#ff0000'
  ctx.font = `18px ${font}`
  ctx.textAlign = 'center'
  ctx.fillText('再来一次', engine.width / 2, (engine.height - gameEndBg.height * 0.5) / 2 + gameScore.height + 32)
  
  ctx.restore()
}

export const homeStartAction = (instance, engine) => {
  const homeIndex = engine.getVariable(constant.homeIndexStart)
  const gameStartBtn = engine.getImg('homeStart')
  if (!instance.ready) {
    instance.x = (engine.width)/2 - (engine.width - homeIndex)/2
    instance.y = engine.height - homeIndex + 20
    instance.ready = true
  }
  const start = engine.getVariable(constant.gameStartNow)
  if(!start) return
  instance.visible = false
  
  engine.getTimeMovement(
    constant.homeIndexStart,
    [
      [instance.y, instance.y - homeIndex]
    ],
    (value) => {
      instance.y = value
    }, {
      after: () => {
        instance.y = homeIndex * -1.5
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
  instance.width = homeIndex.width
  instance.height = homeIndexHeight
  ctx.drawImage(homeIndex, (engine.width - homeIndexWidth * 0.5) / 2, engine.height - homeIndex.height + 20, homeIndex.width * 0.5, homeIndex.height * 0.5)
  ctx.restore()
}
// 顶部title
export const homeTopTitleAction = (instance, engine) => {
  const homeIndexHeight = engine.getVariable(constant.homeTopTitle)
  instance.x = engine.width / 2
  instance.y = homeIndexHeight * -1.5
  const homeTitleState = engine.getVariable(HOME_TITLE_STATE)
  
  const homeTop = engine.getImg('main-index-title')
  // 添加资源检查
  if (!homeTop) return
  const homeTopWidth = homeTop.width
  instance.x = engine.width / 2 - (homeTopWidth * 0.5) / 2
  instance.y = 0
  if (homeTitleState === homeTitleStateMap.ready) {
    engine.setTimeMovement(HOME_TITLE_ANIMATE, 2000)
    engine.setVariable(HOME_TITLE_STATE, homeTitleStateMap.left)
    instance.rotation = 0
    instance.direction = -1
  } else if(!engine.checkTimeMovement(HOME_TITLE_ANIMATE)) {
    engine.setTimeMovement(HOME_TITLE_ANIMATE, 2000)
    if( homeTitleState === homeTitleStateMap.left) {
      instance.direction = 1
      engine.setVariable(HOME_TITLE_STATE,  homeTitleStateMap.right)
    }else {
      instance.direction = -1
      engine.setVariable(HOME_TITLE_STATE, homeTitleStateMap.left)
    }
  }
  instance.ready = true
  engine.getTimeMovement(
    HOME_TITLE_ANIMATE,
    [[instance.rotation, Math.PI / 180 * 5 * instance.direction]],
    (angle) =>  {
      instance.rotation = angle
    },
    {
      easing: 'easeInOut'
    }
  )
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
  ctx.quadraticCurveTo(x, y - 30, x + r * kmp, y - 120)
  ctx.stroke()
  ctx.restore()
}
export const homeTopTitlePainter = (instance, engine) => {
  const {
    ctx
  } = engine
  const homeTop = engine.getImg('main-index-title')
  // 添加资源检查
  if (!homeTop) return
  const homeTopWidth = homeTop.width
  ctx.save()
  ctx.translate(engine.width/2, 0)
  ctx.rotate(instance.rotation)
  ctx.translate(-engine.width/2, 0)
  ctx.drawImage(
    homeTop,
    instance.x,
    instance.y,
    homeTopWidth * 0.5,
    homeTop.height * 0.5
  )
  ctx.restore()
}