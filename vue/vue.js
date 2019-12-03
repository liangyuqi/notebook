class Observer {
    constructor(data) {
        this._data = data;
        Object.entries(data).forEach((entry, index) => {
            this.defineProperty(this._data, entry[0], entry[1])
        })
    }
    defineProperty(data, key, value) {
        let dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                dep.depend();
                return value;
            },
            set: function (newValue) {
                if (newVal === val) {
                    return;
                }
                val = newValue;
                dep.notify();
            }
        })
    }
}


function observe(value) {
    // 当值不存在，或者不是复杂数据类型时，不再需要继续深入监听
    if (!value || typeof value !== 'object') {
        console.error('Error:只能监听data对象');
    }
    return new Observer(value);
}


class Dep {
    constructor() {
        this.depID = uuid()
        this.subs = [];
    }

    depend() {
        Dep.target.addDep(this);
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update()
        })
    }
}

Dep.target = null;


class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        this.val = this.get()
        this.deps = {}
    }
    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.deps[dep.id] = dep;
        }
    }

    update() {
        let val = this.get();
        if (val !== this.val) {
            this.cb.call(this.vm, val);
        }
    }

    get() {
        Dep.target = this;
        const val = this.vm._data[this.key];
        Dep.target = null;
        return val;
    }
}

class Vue {
    constructor(options = {}) {
        if (options && typeof options.data === 'function') {
            this._data = options.data.apply(this);
        }
        // 将所有data最外层属性代理到Vue实例上
        Object.keys(data).forEach(key => this._proxy(key));
        // 监听数据
        observe(data);
    }
    $watch(key, cb) {
        new Watcher(this, key, cb);
    }
    _proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => this._data[key],
            set: val => {
                this._data[key] = val;
            },
        });
    }
}

//   let demo = new Vue({
//     data: {
//       text: '',
//     },
//   });

//   const p = document.getElementById('p');
//   const input = document.getElementById('input');

//   input.addEventListener('keyup', function(e) {
//     demo.text = e.target.value;
//   });

//   demo.$watch('text', str => p.innerHTML = str);