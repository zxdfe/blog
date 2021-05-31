---
title: "SSR"
date: 2021-05-29T23:09:53+08:00
draft: true
tags:
 - 
---

### 1. webpack.config.server.js

```js
target: 'node', // 指定打包后的执行环境
entry : 'server-entery.js',
devtool : 'source-map', // 代码调试
output: {
		 // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2', // module.exports = 
    filename: 'server-entry.js',
    path: path.join(_dirname, '../server-build')
},
externals: Object.keys(require('../package.json').dependencies) // 这部分不打包到输出文件中
```
### 2. server-entry
```js
import  createApp  from './create-app'

export default context => {
    return new Promise((resolve, reject) => {
        // 每次都要创建
        const { app, router, store } = createApp()

        router.push(context.url)
        
        // 一般服务端渲染才用到
        // 所以异步操作做完才调用回调
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) {
                return reject(new Error('no component matched'))
            }
            resolve(app)
        })

    })
}
```