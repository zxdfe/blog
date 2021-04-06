function Promiseall (params) {
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