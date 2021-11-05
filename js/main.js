import {TowerGame} from './runtime/start.js'

const screen = wx.getSystemInfoSync()
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
		this.canvas = wx.createCanvas()
    this.restart()
  }

  restart() {
		let option = {
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
			}
		}
		let game = new TowerGame(option)
		game.load(function(){
			game.init()
		})

  }
}
