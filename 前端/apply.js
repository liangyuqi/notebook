Function.prototype.myApply = function(context, arr) {
    context = context || {};
    context.fn = this;
    const res = context.fn(...arr);
    delete context.fn;
    return res;
  }
  
  