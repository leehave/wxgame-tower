import * as constant from './constant'
import {
  getSwingBlockVelocity
} from './utils'
import {
  getCurrentTime
} from '../util/util'
export const homeStartAction = (instance, engine, time = 1000) => {
  const homeIndexHeight = engine.getVariable(constant.homeIndexStart)
  if (!instance.ready) {
    instance.x = engine.width / 2
    instance.y = homeIndexHeight * -1.5
    instance.ready = true
  }
  engine.getTimeMovement(
    constant.hookUpMovement,
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
  engine.getTimeMovement(
    constant.hookDownMovement,
    [
      [instance.y, instance.y + homeIndexHeight]
    ],
    (value) => {
      instance.y = value
    }, {
      name: 'hook'
    }
  )
  const initialAngle = engine.getVariable(constant.initialAngle)
  instance.angle = initialAngle *
    getSwingBlockVelocity(engine, time)
  instance.weightX = instance.x +
    (Math.sin(instance.angle) * homeIndexHeight)
  instance.weightY = instance.y +
    (Math.cos(instance.angle) * homeIndexHeight)
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

}
// 贝塞尔曲线绘制
const pointArr = [{
  begin: {
    x: 500,
    y: 0
  },
  control1: {
    x: 0,
    y: 75
  },
  control2: {
    x: 1000,
    y: 225
  },
  end: {
    x: 500,
    y: 300
  }
}, {
  begin: {
    x: 500,
    y: 300
  },
  control1: {
    x: 50,
    y: 375
  },
  control2: {
    x: 1100,
    y: 525
  },
  end: {
    x: 500,
    y: 600
  }
}, {
  begin: {
    x: 500,
    y: 600
  },
  control1: {
    x: 360,
    y: 675
  },
  control2: {
    x: 1800,
    y: 825
  },
  end: {
    x: 500,
    y: 900
  }
}]

function drawLine(engine, x, y){
  // requestAnimationFrame(() => drawLine(engine, x, y))
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
  const homeTopTitle = engine.getVariable(constant.homeTopTitle)
  const homeTop = engine.getImg('main-index-title')
  const homeTopWidth = homeTop.width
  drawLine(engine, homeTop.width - 40, homeTop.height)
  ctx.clearRect(0,0,instance.x,instance.y)
  ctx.drawImage(homeTop, instance.x - (instance.x - homeTopWidth * 0.5 / 2), 0, homeTopWidth * 0.5, homeTop.height * 0.5)
  ctx.restore()
}