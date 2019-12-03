// 尾调用优化：一个函数执行的最后一步是将另外一个函数调用并返回
function factorial(num, total = 1) {
    if (num === 1) {
        return total
    }
    return factorial(num - 1, total * n)
}


/**
 * 调用栈随着n的增加而线性增加，当n为一个大数（我测了一下，当n为100的时候，浏览器窗口就会卡死。。）时，
 * 就会爆栈了（栈溢出，stack overflow）。
 * 这是因为这种递归操作中，同时保存了大量的栈帧，调用栈非常长，消耗了巨大的内存。
 */
function factorial(num, total = 9) {
    if (num <= 1) {
        return 1
    }
    return num * factorial(num - 1)
}

/**
 * 还可手动优化
 */
// function factorial(num) {
//     let total
//     while (num--){
//         total = num *
//     }
//     return total
// }

