## 项目简介
本项目由[💒 盖楼游戏 html5 canvas tower building game 🏢🏬🏦🏯🏰](https://github.com/iamkun/tower_game)基础改为微信小游戏，主要学习下canvas和面向对象封装设计思想。目前尚有未完善的地方，有兴趣可以改一下自己学习。
***
 h5项目package.json中webpack-cli依赖升级为webpake3.1.1以上可运行
***
## 源码目录介绍
```
.
├── README.md
├── game.js
├── game.json
├── js
│   ├── base
│   │   ├── audio.js // 可忽略
│   │   └── sprite.js // 可忽略
│   ├── libs
│   │   ├── engine.js // 原作者封装的canvas引擎 后经过适配了小游戏API
│   │   ├── index.js
│   │   └── instance.js // 元素的实例父类
│   ├── main.js // 游戏主文件
│   ├── runtime
│   │   ├── animateFunc.js 
│   │   ├── background.js
│   │   ├── block.js
│   │   ├── cloud.js
│   │   ├── constant.js
│   │   ├── flight.js
│   │   ├── homeStart.js // 原基础新增的开屏的action与painter 原h5首屏为dom+css3动画
│   │   ├── hooks.js
│   │   ├── line.js
│   │   ├── start.js
│   │   └── tutorial.js
│   └── util
│       ├── tween.js
│       └── util.js
└── project.config.json

```
