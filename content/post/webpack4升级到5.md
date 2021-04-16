---
title: "Webpack4升级到5"
date: 2021-04-15T11:01:09+08:00
draft: true
---
## 迁移
1. webpack 5 要求至少 Node.js 10.13.0 (LTS)

## 常用插件
- [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) 测速
```
npm install --save-dev speed-measure-webpack-plugin
yarn add -D speed-measure-webpack-plugin
```

## 升级步骤
### 1. webpack webpack-cli等升级
```
yarn add webpack@next -D
yarn add webpack-cli@latest -D
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
```
追踪到warning在`speed-measure-webpack-plugin`和`webpack-uglify-parallel`中使用了废弃的api
```bash
(node:29694) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
    at Proxy.<anonymous> (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/speed-measure-webpack-plugin/WrappedPlugin/index.js:69:17)
    at UglifyJsParallelPlugin.apply (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/webpack-uglify-parallel/index.js:33:11)
    at WrappedPlugin.apply (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/speed-measure-webpack-plugin/WrappedPlugin/index.js:288:29)
    at webpack (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/webpack/lib/webpack.js:37:12)
    at /Users/zxd/Documents/qimai-workspace/appdata_web/build/build-client.js:100:5
    at next (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/rimraf/rimraf.js:83:7)
    at CB (/Users/zxd/Documents/qimai-workspace/appdata_web/node_modules/rimraf/rimraf.js:119:9)
    at FSReqCallback.oncomplete (fs.js:156:23)

```
- 删除webpack-uglify-parallel,改用`webpack-parallel-uglify-plugin`
### 2. `terser-webpack-plugin`替换掉`uglifyjs-webpack-plugin`
webpack5 自带`terser-webpack-plugin`,不需要安装

### 3. 去掉`"firebase": "4.6.2",`,无用依赖

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