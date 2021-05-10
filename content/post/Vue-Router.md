---
title: "Vue Router"
date: 2021-05-09T20:35:33+08:00
draft: true
tags:
 - 
---

## 实现hash

## 实现history

## 路由守卫
1. router.beforeEach 全局前置守卫
2. router.beforeResolve 全局解析守卫 2.5.0+新增
3. router.afterEach 全局后置
4. beforeEnter()  路由独享的守卫

### 组件内守卫
- beforeRouteEnter
- beforeRouteUpdate (2.2 新增)
- beforeRouteLeave

## 导航解析流程
1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
