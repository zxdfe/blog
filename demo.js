const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
    FULFILLED_CALLBACK_LIST = []
    REJECTED_CALLBACK_LIST = []
    constructor(fn) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
    }

    resolve(value) {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
        }
    }

    reject(reason) {
        if(this.status === PENDING) {
             this.status = REJECTED
             this.reason = reason
        }
    }
}