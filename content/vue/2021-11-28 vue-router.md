---
title: "Vue Router"
date: 2021-11-28T12:04:40+08:00
draft: false
tags:
 - 
---
## Vue-Router

### Vue-Router-Base
```js
// router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

// 1. 注册路由插件
// Vue.use是用来注册插件,接受一个参数,如果参数是函数,直接执行
// 如果参数是对象, 调用传入对象的 install 方法
Vue.use(VueRouter)

// 2. 定义routes路由规则
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启 props，会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]

// 创建 router 路由对象
const router = new VueRouter({
  routes
})

export default router
```

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 3. 注册 router 对象
  router, // 给vue实例注入两个对象 $route和$router
  render: h => h(App)
}).$mount('#app')

```

```js
// app.vue
  <div id="app">
    <div>
      <img src="@/assets/logo.png" alt="">
    </div>
    <div id="nav">
      <!-- 5. 创建链接 -->
      <router-link to="/">Index</router-link> |
      <router-link to="/blog">Blog</router-link> |
      <router-link to="/photo">Photo</router-link>
    </div>
    <!-- 4. 创建路由组建的占位 -->
    <router-view/>
  </div>
```

### 动态路由
```js
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/detail/:id', // 动态路由
    name: 'Detail',
    // 开启 props，会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]
```
#### 动态路由中获取参数
- $route.params.id
- props

```html
<template>
  <div>
    <!-- 方式1： 通过当前路由规则，获取数据 -->
    通过当前路由规则获取：{{ $route.params.id }}

    <br>
    <!-- 方式2：路由规则中开启 props 传参 -->
    通过开启 props 获取：{{ id }}
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['id']
}
</script>
```

### 嵌套路由
```js
const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  // 嵌套路由
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'index',
        path: '',
        component: Index
      },
      {
        name: 'detail',
        path: 'detail/:id',
        props: true,
        component: () => import('@/views/Detail.vue')
      }
    ]
  }
]
```

## 编程式导航
- [Vue-Router](https://router.vuejs.org/zh/guide/essentials/navigation.html)
### router.push 
该方法的参数可以是一个字符串路径，或者一个描述地址的对象
```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
### router.replace

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

### router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。
```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```
## Hash 和 History 模式区别
- Hash 模式
    - https://music.go.com/#/playlist?id=001
- History 模式
    - https://music.go.com/playlist/001

### 原理
- Hash 模式是基于锚点, 以及`onhashchange`事件
- History 模式是基于HTML5中的History API
  - history.pushState()  IE10以后才支持
  - history.replaceState()
  - history.go()

- 开启history模式
```js
const router = new VueRouter({ 
 // mode: 'hash',
 mode: 'history', 
 routes
})
```

**History 模式的使用**

- History 模式需要服务器支持
- 单页面应用中, 只有一个index.html 服务端不存在http://www.test.com/login等这样的地址,会返回找不到该页面
- 在服务端应该除了静态资源以外都返回单页面应用的index.html

### Node.js中配置history模式
```js
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})

```

### Nginx中配置history模式
- 从官网下载nginx压缩包
- 解压到某盘根目录
- 打开命令行,切换到nginx目录中 (不能有中文)

```bash
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```

```bash
# nginx.conf http-server-location

location / { 
 root   html;
 index  index.html index.htm; 
 #新添加内容
 #尝试读取$uri(当前请求的路径)，如果读取不到读取$uri/这个文件夹下的首页 
 #如果都获取不到返回根目录中的    index.html
 try_files $uri $uri/ /index.html; 
}

```

## 模拟实现Vue-Router

### Hash 模式 原理
- URL 中 # 后面的内容作为路径地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应组件重新渲染

### History 模式 原理
- 通过 history.pushState() 方法改变地址栏
  - pushState方法会把当前地址记录到浏览器的访问历史中, 并不会向服务器发送请求
- 监听 popstate 事件
- 根据当前路由地址找到对应组件重新渲染

### Vue-Router
```js
// 1. 注册插件
// Vue.use() 内部调用传入对象的 install 方法
Vue.use(VueRouter) 
// 2. 创建路由对象
const router = new VueRouter({ 
 routes: [{name : 'home', path:'/', component: homeComponent}] 
})
// 3. 创建 Vue 实例，注册 router 对象 
new Vue({
 router,
 render: h => h(App) 
}).$mount('#app')
```
- VueRouter类图
![](https://gtd-imgs-md.oss-cn-beijing.aliyuncs.com/imgs/20211128135341.png)
- options : 记录构造函数中传入的对象(new VueRouter传入的路由规则routes)
- routeMap : 记录路由地址和组件的对应关系,将来会把路由规则解析到routeMap中
- data : current 记录当前路由地址

### _install(Vue):void

```js
let _Vue = null
class VueRouter {
    static install (Vue) {
        // 1. 判断当前插件是否已经被安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        // 2. 把Vue构造函数记录到全局变量
        _Vue = Vue
        // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
        // _Vue.prototype.$router = this.$options.router
        // 混入
        _Vue.mixin({
            beforeCreate() {
                // 如果是Vue实例执行,组件就不执行了
                // 只有Vue实例的$options里才有router对象
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            },
        })
    }
}
export default VueRouter
```
### Constructor(Options):VueRouter
```js
    constructor (options) {
        this.options = options
        // 将options中传入的routes解析出来存入到routeMap对象中
        // {url:component} 键值对
        this.routeMap = {}
        // data应该是响应式的对象 
        // vue提供一个observable()方法创建响应式对象
        this.data = _Vue.observable({
            current:'/' // current存储当前路由地址
        }) 
    }
```

### createRouteMap
该方法作用: 将构造函数传入的options中的routes路由规则转换为键值对形式,存入到routeMap对象里
```js
createRouteMap () {
    // 遍历所有的路由规则, 把路由规则解析成键值对的形式, 存储到routeMap中
    this.options.routes.forEach(route => {
        this.routeMap[route.path] = route.component
    })
}
```

### iniComponents
```js
    iniComponents (Vue) {
        // 1. template模板形式 需要compiler
        // Vue.component('router-link', {
        //     props: {
        //         to: String
        //     },
        //     template: '<a :href="to"><slot></slot></a>'
        // })
        // 2. 手写render函数
        Vue.component('router-link', {
            props: {
                to: String
            },
            // h: h函数作用:创建虚拟dom, 三个参数
            // 1. 选择器,对应标签名字
            // 2. 对创建的dom对象设置一些属性
            // 3. 可以设置生成的a标签的子元素
            render (h) {
                return h ('a', {
                    attrs: {
                        href: this.to
                    }
                }, [this.$slots.default])
            }
        })
    }

    init () {
        this.createRouteMap()
        this.iniComponents(_Vue)
    }
```

PS: Vue的构建版本
- 运行时版: 不支持 template 模板, 需要打包的时候提前编译
- 完整版 : 包含运行时和编译器, 体积比运行时版大10k左右, 在程序运行时的时候把模板转换成render函数
- Vue-cli创建的项目默认使用的是运行时runtime版本
- Runtime + Compiler开启
```js
// 根文件下创建vue.config.js
module.exports = {
 runtimeCompiler: true 
}
```

### router-view
```js
iniComponents (Vue) {
    // Vue.component('router-link', {
    //     props: {
    //         to: String
    //     },
    //     template: '<a :href="to"><slot></slot></a>'
    // })
    Vue.component('router-link', {
        props: {
            to: String
        },
        // h: h函数作用:创建虚拟dom, 三个参数
        render (h) {
            return h ('a', {
                attrs: {
                    href: this.to
                },
                on: {
                    click: this.clickHandler // 注册事件不用加()
                }
            }, [this.$slots.default])
        },
        methods: {
            clickHandler (e) {
                // 第一个data:将来触发popstate的,暂时不用  title:''
                // 改变地址栏
                history.pushState({}, '', this.to)
                // 响应式, 会触发下面的组件重新渲染
                this.$router.data.current = this.to
                e.preventDefault()
            }
        }
    })

    const self = this // self 是VueRouter的实例
    Vue.component('router-view', {
        render (h) {
            // 获取当前路由对应的组件
            const component = self.routeMap[self.data.current]
            return h(component)
        }
    })
}
```

### initEvent
点击浏览器的前进后退时, 也触发组件重新渲染
```js
initEvent () {
    window.addEventListener('popstate', () => {
        // 这里的this就是initEvent里的this, 即VueRouter对象
        this.data.current = window.location.pathname
    })
}

init () {
    this.createRouteMap()
    this.iniComponents(_Vue)
    this.initEvent()
}
```

## total source
```js
let _Vue = null
class VueRouter {
    constructor (options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current:'/' // current存储当前路由地址
        }) // vue创建响应式对象
    }

    static install (Vue) {
        // 1. 判断当前插件是否已经被安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        // 2. 把Vue构造函数记录到全局变量
        _Vue = Vue
        // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
        // _Vue.prototype.$router = this.$options.router
        // 混入
        _Vue.mixin({
            beforeCreate() {
                // 如果是Vue实例执行,组件就不执行了
                // 只有Vue实例的$options里才有router对象
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router

                    this.$options.router.init() // 调用init方法
                }
            },
        })
    }

    init () {
        this.createRouteMap()
        this.iniComponents(_Vue)
        this.initEvent()
    }

    createRouteMap () {
        // 遍历所有的路由规则, 把路由规则解析成键值对的形式, 存储到routeMap中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    iniComponents (Vue) {
        // Vue.component('router-link', {
        //     props: {
        //         to: String
        //     },
        //     template: '<a :href="to"><slot></slot></a>'
        // })
        Vue.component('router-link', {
            props: {
                to: String
            },
            // h: h函数作用:创建虚拟dom, 三个参数
            render (h) {
                return h ('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler // 注册事件不用加()
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    // 第一个data:将来触发popstate的,暂时不用  title:''
                    // 改变地址栏
                    history.pushState({}, '', this.to)
                    // 响应式, 会触发下面的组件重新渲染
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })

        const self = this // self 是VueRouter的实例
        Vue.component('router-view', {
            render (h) {
                // 获取当前路由对应的组件
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent () {
        window.addEventListener('popstate', () => {
            // 这里的this就是initEvent里的this, 即VueRouter对象
            this.data.current = window.location.pathname
        })
    }

}

export default VueRouter
```