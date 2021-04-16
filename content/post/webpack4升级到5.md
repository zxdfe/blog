---
title: "Webpack4升级到5"
date: 2021-04-15T11:01:09+08:00
draft: true
---
## 迁移注意
1. webpack 5 要求至少 Node.js 10.13.0 (LTS)



## 升级步骤
### 1. webpack webpack-cli等升级
```
yarn add webpack@next -D
yarn add webpack-cli@latest -D
yarn add html-webpack-plugin@next -D
```

### 2.其他依赖升级
1. yarn add babel-loader@latest -D 
2. 删除项目中无用的ESlint,重新配置
```
"eslint": "^5.9.0",
"eslint-config-standard": "^12.0.0",
"eslint-loader": "^2.1.1",
"eslint-plugin-html": "^4.0.6",
"eslint-plugin-import": "^2.14.0",
"eslint-plugin-node": "^8.0.0",
"eslint-plugin-promise": "^4.0.1",
"eslint-plugin-standard": "^4.0.0",
"eslint-plugin-vue": "^5.2.3",
"firebase": "4.6.2", // 无用
```
## 常用插件
- [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) 测速
```
yarn add speed-measure-webpack-plugin -D
```
## 错误处理
### 1. `Tapable.plugin is deprecated`
```bash
(node:29283) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```
解决: `webpack.base.config.js`中设置`process.traceDeprecation = true`
```js
process.traceDeprecation = true

webpackConfig = merge(webpackBaseConfig, {
    //....
})
module.exports = webpackConfig
// npm run xxx
```
追踪到warning在`speed-measure-webpack-plugin`和`webpack-uglify-parallel`中使用了废弃的api
```bash
(node:29694) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
    at Proxy.<anonymous> (/xxxx/speed-measure-webpack-plugin/WrappedPlugin/index.js:69:17)
    at UglifyJsParallelPlugin.apply (/xxxxx/webpack-uglify-parallel/index.js:33:11)
```
- 删除webpack-uglify-parallel,改用`webpack-parallel-uglify-plugin`
### 2. uglifyjs-webpack-plugin
使用webpack5 自带的`terser-webpack-plugin`,删除`uglifyjs-webpack-plugin`相关配置
### 3. source-map
```
// webpack4
devtool: cheap-eval-module-source-map

// webpack5
devtool: eval-cheap-module-source-map // 写法更改了
```
### 4. webpack-merge
```
// webpack 4.X
const merge = require('webpack-merge')

// webpack 5.x
const { merge } = require('webpack-merge')
```
### 5. copy-webpack-plugin
```js
// webpack 4.X
new CopyPlugin([
    {
        from: path.resolve(__dirname, '../public'),
        to: config.build.assetsRoot,
        ignore: ['\.*']
    },
]),

// webpack 5.X
new CopyPlugin({
    patterns:[
        {
            from: path.resolve(__dirname, '../public'),
            to: config.build.assetsRoot,
            globOptions:{
                ignore: ['\.*']
            }
        },
        
    ]
}),
```
### 6. optimize-css-assets-webpack-plugin
官方准备弃用了,改用`css-minimizer-webpack-plugin`

---


### PS.
- `--save` 简写`-S`, 是默认命令，当使用npm install [fileName]命令时默认调用,会把下载文件的信息记录至package.json的`dependencies`属性中
- `--save-dev` 简写`-D`, 会把信息记录至devDependencies属性中

**版本号**
- 主版本号.次版本号.补丁版本号
- `~2.1.x` 会安装2.1.x最新版本,可以是 2.1.2, 2.1.5, 2.1.9,不会到 2.2.x;
- `^2.1.x` 会安装2.1.x以上版本,2.5.0, 2.9.9,不会到3.0.0
- ~1.2.3 >= 1.2.3 < 1.3.0
- ^1.2.3 >=1.2.3 < 2.0.0

## References
1. https://webpack.docschina.org/migrate/5/
2. https://juejin.cn/post/6844904169405415432  待看
3. https://juejin.cn/post/6922622067149897735  
4. [构建效率大幅提升，webpack5 在企鹅辅导的升级实践](https://juejin.cn/post/6937609106022727717)
5. https://dongdaima.com/article/30465#/ 待删