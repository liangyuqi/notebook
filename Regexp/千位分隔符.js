// 保留三位小数
// parseToMoney(1234.56); // return '1,234.56'
// parseToMoney(123456789); // return '123,456,789'
// parseToMoney(1087654.321); // return '1,087,654.321'

function parseToMoney(num) {
    num = parseFloat(num.toFixed(3));
    let [integer, decimal] = String.prototype.split.call(num, '.');
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
    return integer + '.' + (decimal ? decimal : '');
}


//   正则表达式(运用了正则的?=正向预测（前向声明），和?!反前向声明):
// 正向预测(?=pattern),即查找一个字符串，该字符串的后边接有符合pattern条件的子字符串，但此pattern为非匹配捕获，即不需要获取以供以后使用
function parseToMoney(str) {
    // 仅仅对位置进行匹配
    let re = /(?=(?!\b)(\d{3})+$)/g;
    return str.replace(re, ',');
}