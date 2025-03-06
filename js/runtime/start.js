import * as constant from './constant'

import { cloudAction, cloudPainter } from './cloud'
import { endAnimate, startAnimate } from './animateFunc'
import {
	gameEndPainter,
	gameEndScorePainter,
	gameRestartAction,
	gameRestartTrigger,
	homeStartAction,
	homeStartPainter,
	homeStartTrigger,
	homeTopTitleAction,
	homeTopTitlePainter
} from './homeStart'
import { hookAction, hookPainter } from './hooks'
import { lineAction, linePainter } from './line'
import { tutorialAction, tutorialPainter } from './tutorial'

import Engine from '../libs/engine.js'
import Instance from '../libs/instance.js'
import { background } from './background'
import { touchEventHandler } from '../util/util'

export const TowerGame = (option = {}) => {
  const {
    canvas,
    width,
    height,
    soundOn,
    onRestart
  } = option
	const game = new Engine({
		canvas:canvas,
		width,
		height,
		soundOn,
		highResolution: true
	});
	const pathGenerator = (dir,path) => `${dir}/${path}`
	game.addImg('background', pathGenerator('images','background.png'))
	game.addImg('hook', pathGenerator('images','hook.png'))
	game.addImg('blockRope', pathGenerator('images','block-rope.png'))
	game.addImg('block', pathGenerator('images','block.png'))
	game.addImg('block-perfect', pathGenerator('images','block-perfect.png'))
	game.addImg('homeStart', pathGenerator('images','main-index-start.png'))
	game.addImg('endBg', pathGenerator('images','main-modal-bg.png'))
	game.addImg('restart', pathGenerator('images','main-modal-again-b.png'))
	game.addImg('modal-over', pathGenerator('images','main-modal-over.png'))
	for (let i = 1; i <= 8; i += 1) {
		game.addImg(`c${i}`, pathGenerator('images',`c${i}.png`))
	}
	game.addLayer(constant.flightLayer)
	for (let i = 1; i <= 7; i += 1) {
		game.addImg(`f${i}`, pathGenerator('images',`f${i}.png`))
	}
	game.swapLayer(0, 1)
	game.addImg('tutorial', pathGenerator('images','tutorial.png'))
	game.addImg('tutorial-arrow', pathGenerator('images','tutorial-arrow.png'))
	game.addImg('heart', pathGenerator('images','heart.png'))
	game.addImg('score', pathGenerator('images','score.png'))
	game.addImg('main-index-title', pathGenerator('images', 'main-index-title.png'))
	game.setVariable(constant.blockWidth, game.width * 0.25)
	game.setVariable(constant.blockHeight, game.getVariable(constant.blockWidth) * 0.71)
	game.setVariable(constant.cloudSize, game.width * 0.3)
	game.setVariable(constant.ropeHeight, game.height * 0.4)
	game.setVariable(constant.blockCount, 0)
	game.setVariable(constant.successCount, 0)
	game.setVariable(constant.failedCount, 0)
	game.setVariable(constant.gameScore, 0)
	game.setVariable(constant.hardMode, false)
	game.setVariable(constant.gameUserOption, option)
	game.setVariable(constant.homeIndexStart, game.width * 0.5)
	game.setVariable(constant.restartBtn, game.width * 0.5)
	game.setVariable(constant.homeTopTitle, game.width * 0.5)
	game.setVariable(constant.gameEndPic, game.width * 0.5)
	game.setVariable(constant.homeTitleState, constant.homeTitleStateMap.ready)
	for (let i = 1; i <= 4; i += 1) {
		const cloud = new Instance({
			name: `cloud_${i}`,
			action: cloudAction,
			painter: cloudPainter
		})
		cloud.index = i
		cloud.count = 5 - i
		game.addInstance(cloud)
	}
	const line = new Instance({
		name: 'line',
		action: lineAction,
		painter: linePainter
	})
	game.addInstance(line)
	const hook = new Instance({
		name: 'hook',
		action: hookAction,
		painter: hookPainter
	})
	game.addInstance(hook)
	game.startAnimate = startAnimate
	game.endAnimate = endAnimate
	game.paintUnderInstance = background
	const start = new Instance({
		name: 'homeStart',
		action: homeStartAction,
		painter: homeStartPainter,
		trigger: homeStartTrigger
	})
	game.addInstance(start)
	const title = new Instance({
		name: 'homeTop',
		action: homeTopTitleAction,
		painter: homeTopTitlePainter
	})
	game.addInstance(title)
	game.touchStartListener = () => {
		touchEventHandler(game)
	}
	game.setVariable(constant.gameEnd, false)
	game.stop = () => {
		const gameEnd = new Instance({
			name: 'gameEnd',
			painter: gameEndPainter
		})
		game.addInstance(gameEnd)
		const restart = new Instance({
			name: 'gameRestart',
			painter: gameEndScorePainter,
			trigger: gameRestartTrigger,
			action: gameRestartAction
		})
		game.addInstance(restart)
	},
  game.restart = () => {
    console.log(' game.restart = () => {');
    // 重置游戏状态
    game.setVariable(constant.gameEnd, false)
    game.setVariable(constant.blockCount, 0)
    game.setVariable(constant.successCount, 0)
    game.setVariable(constant.failedCount, 0)
    game.setVariable(constant.gameScore, 0)
    game.setVariable(constant.hardMode, false)
    game.setVariable(constant.gameStartNow, false)
    
    // 重置背景相关变量
    game.setVariable(constant.bgImgOffset, 0)
    game.setVariable(constant.lineInitialOffset, 0)
    game.setVariable(constant.bgLinearGradientOffset, 0)
    
    // 确保资源加载完成后再重建实例
    if (game.assetsObj.image['main-index-title']) {
      // 清理所有实例
      game.layerArr.forEach(layer => {
        game.instancesObj[layer] = []
      })
      game.instancesReactionArr = []
      
      // 重新初始化基础实例
      for (let i = 1; i <= 4; i += 1) {
        const cloud = new Instance({
          name: `cloud_${i}`,
          action: cloudAction,
          painter: cloudPainter
        })
        cloud.index = i
        cloud.count = 5 - i
        game.addInstance(cloud)
      }
  
      const line = new Instance({
        name: 'line',
        action: lineAction,
        painter: linePainter
      })
      game.addInstance(line)
  
      const hook = new Instance({
        name: 'hook',
        action: hookAction,
        painter: hookPainter
      })
      game.addInstance(hook)
  
      const start = new Instance({
        name: 'homeStart',
        action: homeStartAction,
        painter: homeStartPainter,
        trigger: homeStartTrigger
      })
      game.addInstance(start)
  
      const title = new Instance({
        name: 'homeTop',
        action: homeTopTitleAction,
        painter: homeTopTitlePainter
      })
      game.addInstance(title)
    }
  }
  
	game.init()
	game.start = () => {
		const tutorial = new Instance({
			name: 'tutorial',
			action: tutorialAction,
			painter: tutorialPainter
		})
		game.addInstance(tutorial)
		const tutorialArrow = new Instance({
			name: 'tutorial-arrow',
			action: tutorialAction,
			painter: tutorialPainter
		})
		game.setTimeMovement(constant.bgInitMovement, 800)
		game.setTimeMovement(constant.tutorialMovement, 300)
		game.setVariable(constant.gameStartNow, true)
	}
  return game
}