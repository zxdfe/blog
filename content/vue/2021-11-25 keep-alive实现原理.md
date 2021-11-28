---
title: "Keep Alive实现原理"
date: 2021-11-25T18:03:55+08:00
draft: true
tags:
 - 
---
## keep-alive
- activated / deactivated 是 keep-alive 独有的两个声明周期钩子
- 初始化, 先执行 A mounted, 再执行 A activated 钩子函数, 
- 切换 B 组件时, A 组件执行 deactivated 钩子, 然后 B 执行 mounted / activated,
- 再切换 A, 执行 A activated, 不再有mounted钩子函数了

### 源码
- core / components / keep-alive.js 中