## JavaScript面试知识点总结

### 1.介绍js的基本数据类型。
```
js一共有六种基本数据类型，分别是undefined, null, number, string, boolean, 还有在ES6中新增的symbol和ES10中新增的BigInt类型。
Symbol 代表创建后独一无二且不可变的数据类型，它的出现我认为主要是为了解决可能出现的全局变量冲突的问题。
BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。
```


## 防抖与节流
防抖与节流是什么？有什么区别？如何实现？
### 一、是什么
本质上是优化高频率代码的一种手段。
如： 浏览器的resize、scroll、mousemove、keypress等事件在触发时，会不断地调用绑定在事件上的回调函数，极大的浪费资源，降低前端性能。

为了优化体验，需要对这类事件进行调用次数的限制，对此我们可以采用debounce(防抖)和throttle(节流)的方式来减少调用频率。

#### 定义
防抖：n秒后再执行该事件，若在n秒内重复触发，则重新计时。
节流：n秒内只执行一次，若在n秒内重复触发，只有一次执行。

一个经典的比喻:
想象每天上班大厦底下的电梯。把电梯完成一次运送，类比为一次函数的执行和响应
假设电梯有两种运行策略 debounce 和 throttle，超时设定为15秒，不考虑容量限制
电梯第一个人进来后，15秒后准时运送一次，这是节流
电梯第一个人进来后，等待15秒。如果过程中又有人进来，15秒等待重新计时，直到15秒后开始运送，这是防抖

#### 代码实现
##### 防抖
简单版本的实现
``` js
function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;//保存this指向
        let args = arguments;//拿到event对象
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args)
        }, wait);
    }
}
```
防抖如果需要立即执行，可加入第三个参数用于判断，实现如下：
``` js
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        
        if(timeout) clearTimeout(timeout);

        if(immediate) {
            let callNow = !timeout;

            timeout = setTimeout(function () {
                timeout = null;
            }, wait)

            if(callNow) {
                func.apply(context, args);
            }

        }else {
            timeout = setTimeout(function () {
                func.apply(context, args);
            })
        }
    }
}
```
##### 节流
完成节流可以使用时间戳与定时器的写法

使用时间戳写法，事件会立即执行，停止触发后没有办法再次执行
``` js
function throttled1(fn, delay = 500) {
    let oldtime = Date.now()
    return function (...args) {
        let newtime = Date.now()
        if (newtime - oldtime >= delay) {
            fn.apply(null, args)
            oldtime = Date.now()
        }
    }
}
```
使用定时器写法，delay毫秒后第一次执行，第二次事件停止触发后依然会再一次执行
``` js
function throttled2(fn, delay = 500) {
    let timer = null
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
            }, delay);
        }
    }
}
```
可以将时间戳写法的特性与定时器写法的特性相结合，实现一个更加精确的节流。实现如下
``` js
function throttled(fn, delay) {
    let timer = null
    let starttime = Date.now()
    return function () {
        let curTime = Date.now() // 当前时间
        let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if (remaining <= 0) {
            fn.apply(context, args)
            starttime = Date.now()
        } else {
            timer = setTimeout(fn, remaining);
        }
    }
}
```

### 二、区别
#### 相同点：
- 都可以通过使用 setTimeout 实现
- 目的都是，降低回调执行频率。节省计算资源
#### 不同点：
- 函数防抖，在一段连续操作结束后，处理回调，利用clearTimeout和 setTimeout实现。函数节流，在一段连续操作中，每一段时间只执行一次，频率较高的事件中使用来提高性能
- 函数防抖关注一定时间连续触发的事件，只在最后执行一次，而函数节流一段时间内只执行一次

### 三、应用场景
防抖在连续的事件，只需触发一次回调的场景有：
- 搜索框搜索输入。只需用户最后一次输入完，再发送请求
- 手机号、邮箱验证输入检测
- 窗口大小resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。

节流在间隔一段时间执行一次回调的场景有：
- 滚动加载，加载更多或滚到底部监听
- 搜索框，搜索联想功能






