var json = '{"name":"cxk", "age":25}';
var obj = eval("(" + json + ")");

// 此方法属于黑魔法，极易容易被xss攻击，还有一种new Function大同小异。