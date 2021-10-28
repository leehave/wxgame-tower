import {TowerGame} from './runtime/start.js'
// import DataBus    from './databus'
const screen = wx.getSystemInfoSync()
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.aniId    = 0
		this.canvas = wx.createCanvas()
		this.gameStart = true
		this.bg = {}
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
			},
			setGameFailed: function (f) {
			}
		}
		let game = new TowerGame(option)
		this.bg = game
		game.load(function(){
      game.init()
		})

    // 清除上一局的动画
		cancelAnimationFrame(this.aniId)
		
    if(this.gameStart){
			requestAnimationFrame(() => this.loop(),this.canvas)
		} 
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if ( databus.frame % 30 === 0 ) {
      
    }
  }


  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    var ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  // 游戏逻辑更新主函数
  update() {
    if ( databus.gameOver )
      return;

    this.bg.update()

    databus.bullets
           .concat(databus.enemys)
           .forEach((item) => {
              item.update()
            })

    this.enemyGenerate()

    this.collisionDetection()

    if ( databus.frame % 20 === 0 ) {
      
    }
  }

  // 实现游戏帧循环
  loop() {
    
    this.render()
    this.aniId = requestAnimationFrame(() => this.loop(), this.canvas)
  }
}
