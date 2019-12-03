// 模拟一个new操作
// new Person('Jack',18) => newObject(Persion,'Jack',18)

function newObject() {
    let obj = {};
    let constructorFn = Array.prototype.shift(arguments)
    obj.__proto__ = constructorFn.prototype

    const ret = constructorFn.apply(obj, arguments);

    return typeof ret === "object" ? ret : obj;
}

/**
 * 1. 创建一个新对象
 * 2. 新对象__proto__,指向构造函数prototype
 * 3. 修改this（执行构造函数）
 * 4. 返回
 */