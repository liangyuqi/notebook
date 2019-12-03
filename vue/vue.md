# vue 双向绑定 defineproperty

### 1.1 什么是数据劫持

数据劫持比较好理解,通常我们利用`Object.defineProperty`劫持对象的访问器,在属性值发生变化时我们可以获取变化,从而进行进一步操作。

举个 🌰

```javascript
// 这是将要被劫持的对象
const data = {
  name: "tony"
};

// 遍历对象,对其属性值进行劫持
Object.keys(data).forEach(function(key) {
  Object.defineProperty(data, key, {
    enumerable: true, // 可遍历
    configurable: true, // 可修改
    get: function() {
      console.log("get");
    },
    set: function(newVal) {
      console.log(`i am ${newVal}`);
    }
  });
});

data.name = "tony"; // tony
```

---

### 1.2 vue 优势

1. 无需显示调用: 例如**Vue 运用数据劫持+发布订阅**,直接可以通知变化并驱动视图,上面的例子也是比较简单的实现 data.name = 'tony'后直接触发变更,而比如 Angular 的脏检测则需要显示调用 markForCheck(可以用 zone.js 避免显示调用,不展开),react 需要显示调用 setState。
2. 可精确得知变化数据：还是上面的小例子，我们劫持了属性的 setter,当属性值改变,我们可以精确获知变化的内容 newVal,因此在这部分不需要额外的 diff 操作,否则我们只知道数据发生了变化而不知道具体哪些数据变化了,这个时候需要大量 diff 来找出变化值,这是额外性能损耗。

### 1.3 实现思路

- Observer 负责将数据转换成 getter/setter 形式；
- Dep 负责管理数据的依赖列表；是一个发布订阅模式，上游对接 Observer，下游对接 Watcher
- Watcher 是实际上的数据依赖，负责将数据的变化转发到外界(渲染、回调)；

1. 首先将 data 传入 Observer 转成 getter/setter 形式；
2. 当 Watcher 实例读取数据时，会触发 getter，被收集到 Dep 仓库中；
3. 当数据更新时，触发 setter，通知 Dep 仓库中的所有 Watcher 实例更新，Watcher 实例负责通知外界
