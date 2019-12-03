// 节流函数
// 防抖函数原理:规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

const throttle = (fn, delay = 500) => {
    let flag = true;
    return (...args) => {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, args);
            flag = true;
        }, delay);
    };
};