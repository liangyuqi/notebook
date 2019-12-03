// window.history.back();       // 后退
// window.history.forward();    // 前进
// window.history.go(-3);       // 后退三个页面

// history.pushState用于在浏览历史中添加历史记录,但是并不触发跳转,此方法接受三个参数，依次为：

// state:一个与指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填null。
// title：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null。
// url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

// history.replaceState方法的参数与pushState方法一模一样，区别是它修改浏览历史中当前纪录,而非添加记录,同样不触发跳转。
// popstate事件,每当同一个文档的浏览历史（即history对象）出现变化时，就会触发popstate事件。
// 需要注意的是，仅仅调用pushState方法或replaceState方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用back、forward、go方法时才会触发。
// 另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

class Routers {
  constructor() {
    this.routes = {};
    // 在初始化时监听popstate事件
    this._bindPopState();
  }
  // 初始化路由
  init(path) {
    history.replaceState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 将路径和对应回调函数加入hashMap储存
  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  // 触发路由对应回调
  go(path) {
    history.pushState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 监听popstate事件
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }
}
