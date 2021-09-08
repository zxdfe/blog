---
title: "Promise API"
date: 2021-04-06T23:29:11+08:00
draft: false
tags:
- Promises/A+
---

## Promise API
> 实例方法
- Promise.prototype.then() 
- Promise.prototype.catch()
- Promise.prototype.finally()  

> 静态方法
- Promise.all()  
- Promise.race()
- Promise.allSettled()
- Promise.any()
- Promise.resolve()
- Promise.reject()

---

### Promise.all()
1. 参数必须是数组
2. 要保证返回结果顺序要与数组中顺序一致
3. 一起执行,全部执行完才返回

```js
static all (params) {
    // 判断入参是否为数组
    if(!Array.isArray(params)) {
        const type = typeof params;
        return new TypeError(`TypeError: ${type} ${params} is not iterable`)
    }
    return new MyPromise((resolve,reject) => {
        let resultArr = []
        let orderCounter = 0
        const processResult = (i, value) => {
            resultArr[i] = value 
            // 合并++和判断相等
            if(++orderCounter === params.length) resolve(resultArr)
        }
        for (let i = 0; i < params.length; i++) {
            let current = params[i]
            if (current instanceof MyPromise) {
                // promise对象 先执行
                current.then(value => processResult(i, value), reason => reject(reason))
            }else {
                // 普通值,这儿可以省略改成下面的一种All实现
                processResult(i, params[i])
            }
        }
    })
}
```
- Best!
```js
function PromiseAll(array) {
    if(!Array.isArray(array)) {
        const type = typeof array;
        return new TypeError(`TypeError: ${type} ${array} is not iterable`)
    }
    return new Promise((resolve,reject) => {
        let resultArr = []
        let orderCounter = 0 // 计数器, 保证返回顺序和传入顺序一致
        const promiseNums = array.length

        for(let i = 0; i < promiseNums; i++) {
            // 这里默认把所有入参都包装成promise返回了
            // 因为如果是普通值,在Promise内部实现 2.3.4时, 有返回值的操作
            Promise.resolve(array[i]).then(value => {
                // counter++;
                resultArr[i] = value;
                if ( ++orderCounter === promiseNums) resolve(resultArr)
                // 只要有一个被rejected时, 就reject
            }).catch(e => reject(e))
        }

    })
}
```
以上是我参考了网上一些版本后,下来自己改写的两个版比较满意的all实现~,仅供参考哈 ~~

### Promise.race() 
用来处理多个请求, 采用最快的一个(谁先完成用谁)

```js
static race(array) {
    return new Promise((resolve, reject) => {
        for(let i = 0; i < promises.length; i++) {
            // let current = promises[i]
            // if(current instanceof MyPromise) {
            //     current.then(resolve,reject)
            // }else {
            //     resolve(current)
            // }
            Promise.resolve(array[i]).then(
                value => { resolve(value)},
                reason => reject(reason))
        }
    })
}

```

### Promise.resolve()
```js
// resolve 静态方法
static resolve (value) {
    // 如果传入 MyPromise 就直接返回
    if (value instanceof MyPromise) return value
    // 普通值,创建promise对象
    return new MyPromise(resolve => resolve(value))
}
```

### _.prototype.catch()

```js
Promise.prototype.catch = function(errCallback){
  return this.then(undefined,errCallback)
}

// 构造函数中写法
catch (failCallback) {
    return this.then(undefined, failCallback)
}
```
- Example
```js
const p = () => {
    return new Promise((resolve,reject)=>{
        reject('失败了哦')
    })
}

p().then(value => console.log(value))
    .catch(reason => console.log(reason))
// failCallback ::: reason => console.log(reason)  
```
### _.prototype.finally()
1. 无论当前promise状态是成功或者失败,finally中的回调始终会执行一次
2. 在finally()方法的后面可以链式调用then方法,拿到当前promise对象最终返回的结果

```js
finally (callback) {
  return this.then(value =>{
      // Promise包装是保证异步等待执行后面的then方法
    return MyPromise.resolve(callback()).then(() => value)
        // callback()
        // return value
    }, reason => {
     return MyPromise.resolve(callback()).then(() => {throw reason})
        // callback()
        // throw reason
    })
}
```
