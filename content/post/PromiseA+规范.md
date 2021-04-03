---
title: "PromiseA+规范"
date: 2021-04-03T20:05:13+08:00
draft: false
tags:
- Promise/A+
---

## Terminology 
1. “promise” is an object or function with a then method whose behavior conforms to this specification.
2. “thenable” is an object or function that defines a then method.
3. “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
4. “exception” is a value that is thrown using the throw statement.
5. “reason” is a value that indicates why a promise was rejected.
---
1. `promise`是一个拥有 then⽅法的对象或者是函数，其行为遵循本规范
2. `thenable`是一个定义 then方法的对象或者函数
3. `value` 是任意类型的JavaScript值(包括undefined, thenabel或promise)
   1. 是promise状态成功时的值，也就是resolve的参数
4. `exception` 是由 throw 抛出的异常值
5. `reason` 是promise状态失败时的值,也就是reject的参数,表示拒绝的原因

## Promise States
A promise must be in one of three states: pending, fulfilled, or rejected.

1. When `pending`, a promise:
   1. may transition to either the fulfilled or rejected state.
2. When `fulfilled`, a promise:
    1. must not transition to any other state.
    2. must have a `value`, which `must not change`.
3. When `rejected`, a promise:
    1. must not transition to any other state.
    2. must have a `reason`, which `must not change`.

- Here, “must not change” means immutable identity (i.e. ===), but does not imply deep immutability.
---
有三种状态, 他们之间的关系

1. pending
   1. 初始状态,可改变
   2. 在resolve和reject前都处于这个状态
   3. 通过resolve  ->  fulfilled状态
   4. 通过reject   ->  rejected状态

2. fulfilled
   1. 最终态, 不可变
   2. 一个promise被resolve之后会变成这个状态
   3. 必须拥有一个value

3. rejected
   1. 最终态,不可变
   2. 一个promise被reject之后会变成这个状态
   3. 必须拥有reason

**总结:**

- `pending  -> resolve(value) -> fulfilled`
- `pending  -> reject(reason) -> rejected`
  
---
## then

a promise 必须提供一个then方法, 用来访问当前或最终的结果, 无论是 value 还是 reason.

```js
promise.then(onFulfilled, onRejected)
```

1. `onFulfilled`和`onRejected` 都是可选参数
   1. onFulfilled必须是函数类型, 如果传入的不是函数, 应该被忽略
   2. onRejected必须是函数类型, 如果传入的不是函数, 应该被忽略

2. 如果onFulfilled是一个函数
   1. 在promise状态由pending变成fulfilled之后, 应该调用onFulfilled, 参数是value.(onFulfilled执行时机?)
      - 换句话说,onFulfiled必须在promise is fulfilled之后调用, value值作为它的第一个参数
   2. 在promise变成fulfilled之前, 不应该调用onFulfilled.
   3. 只能调用一次 (怎么实现只调用一次?)

3. 如果onRejected是一个函数
   1. 在promise变成 rejected 时, 调用onRejected, 参数是reason.
   2. 在promise变成 rejected 之前, 不应该调用 onRejected.
   3. 只能被调用一次

4. onFulfilled 和 onRejected 应该是微任务阶段执行. (此处参考规范)
   - 实现promise的时候, 如何去生成微任务? 

5. onFulfilled 和 onRejected 必须作为函数被调用(没有this值)
   - must be called as functions (i.e. with no this value)
6. 同一个promise上的then方法可以被调用多次
   1. promise状态 变成 fulfilled 后, 所有相应的`onFulfilled`回调都必须按照他们原始调用then的顺序执行
      - 即`promise.then(onFulfilled, onRejected).then(onFulfilled1)`, 按照 .then 的顺序执行
   2. promise状态 变成 rejected 后, 所有相应的`onRejected`回调都必须按照他们原始调用then的顺序执行

7. then必须返回一个promise
    ```js
    const promise2 = promise1.then(onFulfilled, onRejected)
    ```



---
## 一步步实现一个Promise

1. const promise = new Promise() 代表 Promise应该是一个构造函数或者class.
2. 定义三种状态.
3. 初始化状态
4. resolve 和 reject 方法
5. 对于实例化promise时的入参处理
   1. 入参是一个函数, 接收 resolve reject 两个参数
   2. 初始化promise的时候, 就要同步执行这个函数, 并且有任何的报错都要通过reject抛出去
6. then 方法
   1. then 接收两个参数, onFulfilled 和 onRejected
   2. 检查并处理参数, 如果参数不是函数, 就忽略
   3. 根据当前promise的状态, 调用不用的函数
   4. 首先我们要拿到所有的回调, 新建两个数组, 分别存储成功和失败的回调, 调用then的时候, 如果还是pending就存入数组.
   5. 在status发生变化的时候, 执行回调, 用到getter setter, 监听status
7. then 的返回值
```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MPromise {
    FULFILLED_CALLBACK_LIST = []
    REJECTED_CALLBACK_LIST = []
    _status = PENDING


    constructor(fn) {
        this.status = PENDING
        this.value = null
        this.reason = null

        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    get status() {
        return this._status
    }

    set status() {
        this._status = newStatus
        switch(newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value)
                })
                break;
            }
            case REJECTED: {

            }
        }
    }

    resolve(value) {
        if (this.status === PENDING) {
            this.status = FULFILLED;
            this.value = value;
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
        }
    }

    then(onFulfilled, onRejected) {
        const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => value
        const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {throw reason }

        // 3个或3个以上
        switch(this.status) {
            case FULFILLED: {
                fulFilledFn(this.value)
                break;
            }
            case REJECTED: {
                rejectedFn(this.reason)
                break;
            }
            case PENDING: {
                this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled)
                this.REJECTED_CALLBACK_LIST.push(realOnRejected)
                break
            }
        }
    }

    isFunction(param) {
        return typeof param === 'function'
    }
}
```
## Acknowledgments
1. [PromiseA+官方](https://promisesaplus.com/)
2. [PromiseA+译](https://zhuanlan.zhihu.com/p/143204897)
3. [github-then/promise](https://github.com/then/promise)
4. [github-es6-promise](https://github.com/stefanpenner/es6-promise)
5. [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469?utm_source=gold_browser_extension#heading-26)
6. [史上最详细手写promise](https://juejin.cn/post/6844903625769091079) 
7. [Promise实现原理](https://juejin.cn/post/6844903665686282253)
8. [待删 实现一个promise](https://zsy-x.blog.csdn.net/article/details/108716833)
9. [Promise实现原理（附源码）](https://www.jianshu.com/p/43de678e918a)
10. [手写promise跑promiseA+规范](https://juejin.cn/post/6844903935069650952)
11. [bilibili-Promise](https://www.bilibili.com/video/av795186074)
12. [promise源码](https://zhuanlan.zhihu.com/p/180541324)