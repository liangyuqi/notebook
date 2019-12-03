function Promise(executor) {
    let self = this
    self.status = 'pending' //Promise当前状态
    self.data = undefined //当前Promise的值
    self.onResolvedCallback = [] //Promise resolve时的回调函数集合
    self.onRejectedCallback = [] //Promise reject时的回调函数集合

    function resolve(value) { // value成功态时接收的终值
        if (value instanceof Promise) {
            value.then(resolve, reject)
            return
        }
        setTimeout(function () {
            if (self.status === 'pending') {
                self.status = 'fulfilled'
                self.data = value
                self.onResolvedCallback.forEach(callback => callback(value))
            }
        }, 0)
    }

    function reject(reason) { // reason失败态时接收的拒因
        setTimeout(function () {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                self.onRejectedCallback.forEach(callback => callback(reason))
            }
        }, 0)
    }

    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }

}

Promise.prototype.then = function (onResolve, onReject) {
    let self = this
    let promise2

    onResolve = typeof onResolve === 'function' ? onResolve : function (value) {
        return value
    }
    onReject = typeof onReject === 'function' ? onReject : function (reason) {
        throw reason
    }

    if (self.status === 'pending') { // 等待态
        return promise2 = new Promise(function (resolve, reject) {

            self.onResolvedCallback.push(function (value) {
                try {
                    let x = onResolve(value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push(function (reason) {
                try {
                    let x = onReject(reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status === 'fulfilled') { // 成功态
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onResolve(self.data)
                    resolvePromise(promise2, x, resolve, reject) // 新的promise resolve 上一个onFulfilled的返回值
                } catch (e) {
                    reject(e) // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
                }
            }, 0)
        })
    }

    if (self.status === 'rejected') { // 失败态
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onReject(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        })
    }
}

/*
resolvePromise函数即为根据x的值来决定promise2的状态的函数
也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
x为`promise2 = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值
`resolve`和`reject`实际上是`promise2`的`executor`的两个实参，因为很难挂在其它的地方，所以一并传进来。
相信各位一定可以对照标准把标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释
*/
function resolvePromise(promise2, x, resolve, reject) {

    let then
    let thenCalledOrThrow = false

    if (promise2 === x) {
        reject(new TypeError('循环引用'))
        return
    }

    if (x instanceof Promise) { // 对应标准2.3.2节
        // 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值的
        // 所以这里需要做一下处理，而不能一概的以为它会被一个“正常”的值resolve
        if (x.status === 'pending') {
            x.then(value => {
                resolvePromise(promise2, value, resolve, reject)
            }, err => {
                reject(err)
            })
        } else { // 但如果这个Promise的状态已经确定了，那么它肯定有一个“正常”的值，而不是一个thenable，所以这里直接取它的状态
            x.then(resolve, reject)
        }
        return
    }

    if ((x !== null) && ((typeof x === 'function') || (typeof x === 'object'))) {
        try {
            // 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
            // 即要判断它的类型，又要调用它，这就是两次读取
            then = x.then //because x.then could be a getter
            if (typeof then === 'function') { // 2.3.3.3
                then.call(x, value => { // 2.3.3.3.1
                    if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
                    thenCalledOrThrow = true
                    resolvePromise(promise2, value, resolve, reject) // 2.3.3.3.1
                    return
                }, err => { // 2.3.3.3.2
                    if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
                    thenCalledOrThrow = true
                    reject(err)
                    return
                })
            } else { // 2.3.3.4
                resolve(x)
            }
        } catch (e) { // 2.3.3.2
            if (thenCalledOrThrow) return // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
            thenCalledOrThrow = true
            reject(e)
            return
        }
    } else { // 2.3.4
        resolve(x)
    }

}



/**
 * Promise.all Promise进行异步并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。有一个被rejected，p的状态就变成rejected
 * 
 Promise.all([new Promise((resolve)=>setTimeout(()=>{resolve(456)},2000)),new Promise((resolve)=>setTimeout(()=>{resolve(123)},1000))])
Promise {<pending>}
VM1159:7 value: 456 index: 1
VM1159:7 value: 123 index: 0
Promise {<resolved>: Array(2)} [123,456]
 */
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let values = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then(value => {
                values[index] = value
                count++
                if (count === promises.length) {
                    resolve(values)
                }
            }, reject)
        })
    })
}


/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(resolve, reject);
        });
    });
}

Promise.resolve = function (value) {
    return new Promise(resolve => {
        resolve(value);
    });
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}


// 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}


// finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018(es7) 引入标准的。
// Promise.prototype.finally = function (callback) {
//     let P = this.constructor;
//     return this.then(
//       value  => P.resolve(callback()).then(() => value),
//       reason => P.resolve(callback()).then(() => { throw reason })
//     );
//   };



//   Promise.try就是模拟try代码块 ， 可以捕捉同步和异步错误
// database.users.get({id: userId})
// .then(...)
// .catch(...)


//   Promise.try(() => database.users.get({id: userId}))
//   .then(...)
//   .catch(...)