// fn.myCall(obj,parm1,parm2)
Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
}

/**
 * 1. 获取执行上下文，没有的话window
 * 2. 指定this到函数Fn
 * 3. 执行fn ，获得res
 * 4. 删除fn ，返回res
 * 
 */