---
title: "Webpack4升级到5"
date: 2021-04-15T11:01:09+08:00
draft: false
tags:
- webpack
---
## 迁移注意
1. webpack 5 要求至少 Node.js 10.13.0 (LTS)



## 升级步骤
### 1. webpack webpack-cli等升级
```
yarn add webpack@next -D
yarn add webpack-cli@next -D
yarn add html-webpack-plugin@next -D
yarn add vue-loader@next @vue/compiler-sfc -D // vue-loader相关两个不建议升级
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
"babel-plugin-transform-runtime": "^6.23.0",
"babel-plugin-transform-object-rest-spread": "^6.26.0", // ??
"babel-preset-env": "^1.6.1",
"babel-preset-es2015": "^6.24.1",
"babel-preset-stage-2": "^6.24.1",
"babel-plugin-syntax-dynamic-import": "^6.18.0",
"babel-plugin-dynamic-import-node": "^2.3.0",
"babel-core": "^6.26.3", // 8配置改变
"@babel/eslint-parser": "^7.13.14", // 删掉
"btoa": "^1.2.1",
"atob": "^2.1.1",
```
## 优化分析
### 打包速度优化分析
- [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) 测速
```
yarn add speed-measure-webpack-plugin -D
```
### 打包体积优化分析
- [webpack-bundle-analyzer]()
```
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

### 7. babel-loader
```bash
Error: Compiling RuleSet failed: Query arguments on 'loader' has been removed in favor of the 'options' property (at clonedRuleSet-1[0].rules[0].loader: babel-loader?cacheDirectory)
```
```js
// loader: 'babel-loader?cacheDirectory',

// 改为
loader: 'babel-loader'
```
### 8.speed-measure-webpack-plugin
不兼容webpack5,报错
```
DeprecationWarning: Compilation.hooks.normalModuleLoader was moved to NormalModule.getCompilationHooks(compilation).loader
```

### 9.vue-loader
路径改变
```js
// Error: Cannot find module 'vue-loader/lib/plugin'
// const VueLoaderPlugin = require('vue-loader/lib/plugin') 
const { VueLoaderPlugin }  = require('vue-loader') 
```
### 10.new webpack.HashedModuleIdsPlugin(),
```
TypeError: webpack.HashedModuleIdsPlugin is not a constructor

暂时注释掉
```

### 11. babel-loader升级到8
```
yarn add -D babel-loader @babel/core @babel/preset-env  // 必须装
// 搞定浏览器不兼容的Api Promise,Set,Symbol等什么的
yarn add @babel/runtime @babel/plugin-transform-runtime -D  // 必须装
yarn add @babel/plugin-proposal-object-rest-spread --d  // 
// https://www.babeljs.cn/docs/babel-plugin-proposal-object-rest-spread
```
### 12. polyfill
webpack5中移除了node核心模块polyfill的自动引入, 需要手动引入, 如果打包过程中使用到了, 需要进行相应配置,
并安装相应依赖

```js
module.exports = {
    resolve:{
        fallback:{
            url: require.resolve('url'),
            timers:require.resolve("timers-browserify"),
        }
    }
}
```
- [ReferenceError: process is not defined](https://stackoverflow.com/questions/65018431/webpack-5-uncaught-referenceerror-process-is-not-defined)
- [stack overflow](https://stackoverflow.com/questions/41359504/webpack-bundle-js-uncaught-referenceerror-process-is-not-defined)
```js
plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
]
```

### 13. less-loader
```bash
ValidationError: Invalid options object. Less Loader has been initialized using an options object that does not match the API schema.
 - options has an unknown property 'javascriptEnabled'. These properties are valid:
   object { lessOptions?, additionalData?, sourceMap?, webpackImporter?, implementation? }
```
less-loader 6.X已上,配置要修改
```js
// old
{
    loader: "less-loader",
    options: {
        javascriptEnabled: true
    }
}
// new
// https://github.com/ant-design/ant-design-landing/issues/235
{
    loader: "less-loader",
    options: {
        lessOptions:{
        javascriptEnabled: true
        }
    }
}
```

### 14. ReferenceError: Buffer is not defined
[stack overflow](https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error)
排查发现引入的btoa,atob模块中,Buffer在浏览器和node环境中兼容不一致造成
改写Base64 decode和encode方法
```js
const atobImp = (b64Encode) => {
    try {
        return atob(b64Encode) // 浏览器window对象自带
    }catch(err){
        return Buffer.from(b64Encoded, 'base64').toString()
    }
}

const btoaImp = (str) => {
    try {
        return btoa(str) 
    }catch(err){
        return Buffer.from(str).toString('base64')
    }
}
```
### 15. img标签中src为[object Module]
url-loader中配置esModule:false
```js
{
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
        limit: 5000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        esModule:false // 关闭url-loader中ES6模块化,使用commonjs解析
    }
},
```

---

## Node版本升级
- `nvm ls-remote --lts` 查看node lts版本
- `nvm install 14.16.1`
- `nvm use 14`
- `npm rebuild node-sass` 切换node版本后需要执行
### PS.
**-S -D**
- `--save` 简写`-S`, 是默认命令，当使用npm install [fileName]命令时默认调用,会把下载文件的信息记录至package.json的`dependencies`属性中
- `--save-dev` 简写`-D`, 会把信息记录至devDependencies属性中

**版本号**
- 主版本号.次版本号.补丁版本号
- `~2.1.x` 会安装2.1.x最新版本,可以是 2.1.2, 2.1.5, 2.1.9,不会到 2.2.x;
- `^2.1.x` 会安装2.1.x以上版本,2.5.0, 2.9.9,不会到3.0.0
- ~1.2.3 >= 1.2.3 < 1.3.0
- ^1.2.3 >=1.2.3 < 2.0.0

**查看CPU,OS信息**
```
// run:
npx envinfo --system --binaries --npmPackages clean-webpack-plugin,webpack
```
```bash
  System:
    OS: macOS 10.15.7
    CPU: (8) x64 Intel(R) Core(TM) i5-8259U CPU @ 2.30GHz
    Memory: 19.04 MB / 8.00 GB
    Shell: 5.7.1 - /bin/zsh
  Binaries:
    Node: 12.20.1 - ~/.nvm/versions/node/v12.20.1/bin/node
    Yarn: 1.22.10 - ~/.nvm/versions/node/v12.20.1/bin/yarn
    npm: 6.14.10 - ~/.nvm/versions/node/v12.20.1/bin/npm
  npmPackages:
    webpack: ^5.33.2 => 5.33.2 
```

## References
1. https://webpack.docschina.org/migrate/5/
2. https://juejin.cn/post/6844904169405415432  待看
3. https://juejin.cn/post/6922622067149897735  
4. [构建效率大幅提升，webpack5 在企鹅辅导的升级实践](https://juejin.cn/post/6937609106022727717)
5. https://dongdaima.com/article/30465#/ 待删
6. https://webpack.js.org/loaders/babel-loader/  webapck babel
7. https://blog.csdn.net/weixin_33727510/article/details/93264765 待删
8. https://www.cnblogs.com/sk-3/p/14147612.html 待删