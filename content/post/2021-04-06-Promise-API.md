---
title: "Promise API"
date: 2021-04-06T23:29:11+08:00
draft: true
tags:
- Promises/A+
---

## Promise-API
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
                    // 普通值
                    processResult(i, params[i])
                }
            }
        })
    }
```

```js
function PromiseAll(array) {
    return new Promise((resolve,reject) => {
        if(!Array.isArray(array)) {
            return reject(new Error('传入的参数必须是数组哦!'))
        }
        const res = []
        const promiseNums = array.length
        let counter = 0 // 计数器, 保证返回顺序和传入顺序一致

        for(let i = 0; i < promiseNums; i++) {
            // 这里默认把所有入参都包装成promise返回了
            Promise.resolve(array[i]).then(value => {
                counter++;
                res[i] = value;
                if (counter === promiseNums) resolve(res)
                // 只要有一个被rejected时, 就reject
            }).catch(e => reject(e))
        }

    })
}
```
以上是参考了网上一些版本后,改写的两个版比较满意的all实现~~