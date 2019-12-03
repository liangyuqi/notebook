/**
 * 类数组对象，属性从0开始，依次1，2，3...还有callee和length属性
 * 还有getElementsByXX 获取的HTMLCollection
 * 以及childNodes获取的 nodeList
 */

//  怎么转换为数组呢

// Array.prototype.slice.call()
let args = Array.prototype.slice.call(arguments)

// Array.from
let args = Array.from(arguments)

// es6展开运算符
let args = [...arguments]

// concat + apply
let args = Array.prototype.concat.apply([],arguments)