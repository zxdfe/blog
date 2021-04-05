const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {

    onFulfilledCallbacks = [] // 实例属性
    onRejectedCallbacks = []
    // _status = PENDING
    constructor(executor){
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        // this.onFulfilledCallbacks = []  写上面和这里是一样的
        // this.onRejectedCallbacks = [] // 实例属性
        try {
            executor(this.resolve.bind(this),this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    // 利用getter, setter监听status改变  其实可以不用这里监听
    // get status() {
    //     return this._status
    // }

    // set status(newStatus) {
    //     this._status = newStatus
    //     switch (newStatus) {
    //         case FULFILLED: {
    //             this.FULFILLED_CALLBACK_LIST.forEach(callback => {
    //                 callback(this.value);
    //             });
    //             break;
    //         }
    //         case REJECTED: {
    //             this.REJECTED_CALLBACK_LIST.forEach(callback => {
    //                 callback(this.reason);
    //             });
    //             break;
    //         }
    //     }
    // }

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
            this.onFulfilledCallbacks.forEach(cb=>cb(this.value));
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
            this.onRejectedCallbacks.forEach(cb=>cb(this.reason));
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : value => value
        const realOnRejected = this.isFunction(onRejected) ? onRejected : reason => {throw reason}
        // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
        const promise2 = new MyPromise((resolve,reject)=>{
             // fulfilled处理
             const fulfilledMicrotask = () => {
                 // 创建一个微任务等待 promise2 完成初始化
                 queueMicrotask(() => {
                     try {
                         // 获取成功回调函数的执行结果
                         const x = realOnFulfilled(this.value);
                         // 传入 resolvePromise 集中处理
                         this.resolvePromise(promise2, x, resolve, reject);
                     } catch (e) {
                         reject(e)
                     }
                 })
             }
             // rejected处理
             const rejectedMicrotask = () => {
                 queueMicrotask(() => {
                     try {
                         // 调用失败回调，并且把原因返回
                         const x = realOnRejected(this.reason);
                         this.resolvePromise(promise2, x, resolve, reject);
                     } catch (e) {
                         reject(e);
                     }
                 })
             }
             // 判断状态
             switch (this.status) {
                 case FULFILLED: {
                     fulfilledMicrotask();break;
                 }
                 case REJECTED: {
                     rejectedMicrotask();break;
                 }
                 case PENDING: {
                     this.onFulfilledCallbacks.push(fulfilledMicrotask)
                     this.onRejectedCallbacks.push(rejectedMicrotask)
                 }
             }
             
         })
         // then 返回promise2 实现链式调用
         return promise2
    }  // end then

    resolvePromise(promise2, x, resolve, reject){
        /* 2.3.1 */
        if (promise2 === x) {
            return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
        }
        /* 2.3.2 */
        if (x instanceof MyPromise) {
            // 如果 x 为 Promise ，则使 promise2 接受 x 的状态
            // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
            // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
            x.then((y) => {
                this.resolvePromise(promise2, y, resolve, reject);
            }, reject);
        }
        /* 2.3.3 */
        if (x!=null&&(typeof x === 'object' || typeof x === 'function')) {  

            let then = null;
            try {
                /* 2.3.3.1 */
                then = x.then; // 把 x.then 赋值给 then
            } catch (e) {
                /* 2.3.3.2 */
                return reject(e);
            }
    
            /* 2.3.3.3 */
            if (typeof then === 'function') {
                let called = false; // 标记是否调用过
                // 将 x 作为函数的作用域 this 调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                try {
                    then.call(
                        x,
                        // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                        (y) => {
                            /* 2.3.3.3.1 */ 
                            // 需要有一个变量called来保证只调用一次.
                            if (called) return;
                            called = true; /* 2.3.3.3.3 */ 
                            this.resolvePromise(promise2, y, resolve, reject);
                        },
                        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                        (r) => {
                            /* 2.3.3.3.2 */ 
                            if (called) return;
                            called = true; /* 2.3.3.3.3 */ 
                            reject(r);
                        })
                /* 2.3.3.3.4 */     
                } catch (e) {
                    // 如果调用 then 方法抛出了异常 e：
                    if (called) return;
                    // 否则以 e 为据因拒绝 promise
                    reject(e);
                }
            }
             /* 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise*/ 
            if (typeof then !== 'function') resolve(x)
        }
        /* 2.3.4 // 如果 x 不为对象或者函数，以 x 为参数执行 promise*/
        if (typeof x !== 'object' && typeof x !=='function' || x === null) resolve(x)
    } 
    // resolve 静态方法
    static resolve (parameter) {
        // 如果传入 MyPromise 就直接返回
        if (parameter instanceof MyPromise) {
            return parameter
        }

        // 转成常规方式
        return new MyPromise(resolve =>  {
            resolve(parameter)
        })
    }
    // reject 静态方法
    static reject (reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
    // 工具函数, 判断function
    isFunction(value) {
        return typeof value === 'function';
    }
}


// 测试
// npm install promises-aplus-tests -D
MyPromise.deferred = function() {
    let result = {}
    result.promise = new MyPromise(function(resolve,reject){
        result.resolve = resolve
        result.reject = reject
    })
    return result
}

module.exports = MyPromise