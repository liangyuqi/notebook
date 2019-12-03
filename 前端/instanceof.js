// 模拟 instanceof
function instance_of(L, R) {
    //L 表示左表达式，R 表示右表达式
    var R = R.prototype; // 取 R 的显示原型
    var L = L.__proto__; // 取 L 的隐式原型

    while (true) {
        if (L === null) return false;
        // 这里重点：当 R 严格等于 L 时，返回 true
        if (R === L) return true;
        // 一直遍历到底层
        L = L.__proto__;
    }
}


/**
 * Object和Function既是对象(__proto__)，又是函数(prototype)
 * 自底向上为这样：
 * '123'.__proto__ 指向String.prototype , 
 * Object.__proto__ === Function.prototype === Function.__proto__ , 指向”内置对象“
 * 对象的（包括内置和普通，Function和String）__proto__指向“根源对象”，为Object.prototype。
 * 根源之上再没有其他根源，Object.prototype.__proto__ === null
 */