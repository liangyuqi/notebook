# vue3.0 Proxy 实现双向绑定

### 1.1 什么是 proxy

Proxy 在 ES2015 规范中被正式发布,它在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写,我们可以这样认为,Proxy 是`Object.defineProperty`的全方位加强版。

Proxy 对象方法和`Reflect`一一对应，Reflect 让之前 Object 的**命令式操作**， name in obj，delete obj\[name\],变成了**函数声明式**，Reflect.has(obj,name),Reflect.deleteProperty(obj,name)

**Proxy 可以直接监听对象而非属性**

---

### 1.2 proxy 优势

1. **Proxy 有多达 13 种拦截方法**,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的。
2. **Proxy 返回的是一个新对象**,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改。
3. Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的**新标准的性能红利**。

当然,Proxy 的劣势就是兼容性问题,而且无法用 polyfill 磨平,因此 Vue 的作者才声明需要等到下个大版本(3.0)才能用 Proxy 重写。
