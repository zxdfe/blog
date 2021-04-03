class MPromise {
    // FULFILLED_CALLBACK_LIST = []
    REJECTED_CALLBACK_LIST = []
    constructor(fn) {
        this.value = null
        this.reason = null
        this.FULFILLED_CALLBACK_LIST= []
    }
}