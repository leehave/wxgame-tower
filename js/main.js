import {TowerGame} from './runtime/start.js'

const screen = wx.getSystemInfoSync()
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.canvas = wx.createCanvas()
    this.initGame()
  }

  initGame() {
    const option = {
      canvas: this.canvas,
      width: screen.windowWidth,
      height: screen.windowHeight,
      soundOn: true,
      setGameScore: function (s) {
        console.log(s, 'setGameScore')
      },
      setGameSuccess: function (s) {
        console.log(s, 'setGameSuccess')
      },
      setGameFailed: function (f) {
        console.log(f, 'setGameFailed')
      },
      // 添加重新开始的回调
      onRestart: () => {
        this.restart()
      }
    }
    this.game = new TowerGame(option)
    this.game.load(() => {
      this.game.init()
    })
  }

  restart() {
    if (this.game) {
      // 清除所有实例
      this.game.layerArr.forEach(layer => {
        this.game.instancesObj[layer] = []
      })
      this.game.instancesReactionArr = []
      // 重新初始化游戏
      this.initGame()
    }
  }
}
