function PromiseAll(array) {
    return new Promise((resolve,reject) => {
        if(!Array.isArray(array)) {
            return reject(new Error('传入的参数必须是数组哦!'))
        }
        const res = []
        const promiseNums = array.length
        let counter = 0 // 计数器, 保证返回顺序和传入顺序一致

        for(let i = 0; i < promiseNums; i++) {
            Promise.resolve(array[i]).then(value => {
                counter++;
                res[i] = value;
                if (counter === promiseNums) {
                    resolve(res)
                }
            }).catch(e => reject(e))
        }

    })
}