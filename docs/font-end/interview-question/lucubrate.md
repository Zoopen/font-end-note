## 浏览器怎么和服务端确定自己用啥协议版本沟通
0.9、1.0、1.1、2.0


## cookie属性值里samesite是用来做啥子用的,怎么用
Chrome51开始，浏览器的Cookie新增加了一个SameSite属性，用来防止CSRF攻击和用户追踪。

### 一、CSRF攻击是什么？
Cookie往往用来存储用户的身份信息，恶意网站可以设法伪造带有正确Cookie的HTTP请求，这就是CSRF（Cross site request forgery，跨站请求伪造）攻击。
举例来说，用户登陆了银行网站<code>your-bank.com</code>，银行服务器发来了一个Cookie:
```
Set-Cookie: id=a3fWa;
```
用户后来又访问了恶意网站<code>malicious.com</code>，上面有一个表单。
``` html
<form action="your-bank.com/transfer" method="POST">
    ...
</form>
```
用户一但被诱骗发送这个表单，银行网站就会收到带有正确Cookie的请求。为了防止这种攻击，表单一般都带有一个随机token，告诉服务器这是真实请求。
``` html
<form action="your-bank.com/transfer" method="POST">
    <input type="hidden" name="token" value="dad3weg34">
    ...
</form>
```
这种第三方网站引导发出的Cookie，就称为第三方Cookie。它除了用于CSRF攻击，还可以用于用户追踪。
比如，Facebook在第三方网站插入一张看不见的图片。
``` js
<img src="facebook.com" style="visibility:hidden;">
```
浏览器加载上面代码时，就会像向Facebook发出带有Cookie的请求，从而Facebook就会知道你是谁，访问了什么网站。

### 二、SameSite属性
Cookie的<code>SameSite</code>属性用来限制第三方Cookie，从而减少安全风险。
它可以设置三个值。
``` md
- Strict
- Lax
- None
```

#### 2.1 Strict
<code>Strict</code>最为严格，完全禁止第三方Cookie，跨站点时，任何情况下都不会发送Cookie。换言之，只有当网页的URL与请求目标一致，才会带上Cookie。
```
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```
这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个GitHub链接，用户点击跳转就不会带有GitHub的Cookie，跳转过去总是未登录状态。

#### 2.2 Lax
<code>Lax</code>规则稍微放宽，大多数情况也是不发送第三方Cookie，但是导航到目标网址的Get请求除外。
```
Set-Cookie: CookieName=CookieValue; SameSite=Lax;
```
导航到目标网址的GET请求，只包括三种情况：链接，预加载请求，GET表单，详见下表：
| 请求类型 | 示例 | 正常情况 | Lax |
| ------ | ------ | ------ | ------ |
| 链接 | ```<a href="..."></a>``` | 发送Cookie | 发送Cookie | 
| 预加载 | ```<link rel="prerender" href="..." />``` | 发送Cookie | 发送Cookie | 
| GET表单 | ```<form method="GET" action="..."></form>``` | 发送Cookie | 发送Cookie | 
| POST表单 | ```<form method="POST" action="..."></form>``` | 发送Cookie | 不发送 | 
| iframe | ```<iframe src="..."></iframe>``` | 发送Cookie | 不发送 | 
| AJAX | ```$.get("...")``` | 发送Cookie | 不发送 | 
| Image | ```<img src="...">``` | 发送Cookie | 不发送 | 
设置了<code>Strict</code>或<code>Lax</code>以后，基本就杜绝了CSRF攻击。当然，前提是用户浏览器支持SameSite属性。

#### 2.3 None
Chorme计划将<code>Lax</code>变为默认设置。这是，网站可以选择显式关闭SameSite属性，将其设为None。不过，前提是必须同时设置Secure属性（Cookie只能通过HTTPS协议发送），否则无效。
下面的设置无效。
```
Set-Cookie: widget_session=abc123; SameSite=None;
```
下面的设置有效。
```
Set-Cookie: widget_session=abc123; SameSite=None; Secure;
```

### 三、参考链接
<http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html>

### 四、实践测试
待完成


## js执行会先干啥


## PWA

## Service worker
### 背景
为了解决丢失网络连接，web app无法打开，用户体验不好的问题， Service worker被提出。
它的出现，是为了更好的统筹资源缓存和对自定义的网络请求进行控制。

在Service worker出现之前，HTML5提出了AppCache的标准来解决离线缓存的问题。但是由于种种原因，已经被废弃。
Service Worker可以使用JavaScript更加精细的控制AppCache的静默行为。它可以解决目前离线应用的问题，同时也可以做更多的事。
Service Worker可以使你的应用先访问本地缓存资源，所以在离线状态时，在没有通过网络接收到更多的数据前，仍可以提供基本的功能（一般称之为Offline First）。这是原生App本来就支持的功能，这也是相比于Web App， 原生App更受青睐的主要原因。

### 使用前的设置
在已经支持service workers的浏览器版本中，很多特性没有默认开启。如果要使用service workers的所有特性，需要开启一下浏览器的相关配置。
- Firefox Nightly: 访问about:config并设置dom.serviceWorkers.enabled的值为true;重启浏览器;
- Chrome Canary: 访问 chrome://flags并开启experimental-web-platform-features;重启浏览器（注意：有些特性在Chrome中没有默认开放支持）;
- Opera: 访问 opera://flags并开启ServiceWorker的支持;重启浏览器。

另外，出于安全原因，Service Workers要求必须在HTTPS下才能运行。为了便于本地开发，localhost也被浏览器认为是安全源。

### 基本架构
通常遵循以下基本步骤来使用service workers:
1. service worker URL通过serviceWorkerContainer.register()来获取和注册。
2. 如果注册成功，service worker就在ServiceWorkerGlobalScope环境中运行；这是一个特殊类型的worker上下文运行环境，与主运行线程（执行脚本）相对立，同时也没有访问DOM的能力。
3. service worker现在可以处理事件了。
4. 受service worker控制的页面打开后会尝试去安装service worker。最先发送给service worker的事件是安装事件（在这个事件里可以开始进行填充IndexDB和缓存站点资源）。这个流程同原生App或者Firefox OS App 是一样的————让所有资源可以离线访问。
5. 当oninstall事件的处理程序执行完毕后，可以认为service worker安装好了。
6. 下一步是激活。当service worker安装完成后，会接收到一个激活事件（activate event）。onactivate主要用途是清理先前版本的service worker脚本中使用的资源。
7. Service Worker现在可以控制页面了，但仅是在register()成功后的打开的页面。也就是说，页面起始于有没有service worker，且在页面的接下来的生命周期内维持这个状态。所以，页面不得不重新加载以让service worker获得完全的控制。

### Promises
Promises是一种异步操作的机制，一个操作依赖于另一个操作的成功执行。这是service worker的核心工作机制。

同步
此例子中，我们必须等待myFuction()执行完成, 并返回一个value值，在此之前，后续其他代码无法执行。
``` js
try {
    var value = myFuction();
    console.log(value);
}catch(err) {
    console.log(err)
}
```
在此例子中，myFuction()返回一个promise对象，下面的代码可以继续执行。当promise成功resolves后，then()中的函数会异步地执行。
异步
``` js
myFuction().then(function(value) {
    console.log(value);
}).catch(function(err) {
    console.log(err)
})
```

现在来举下实际的例子 — 如果我们想动态地加载图片，而且要在图片下载完成后再展示到页面上，要怎么实现呢？这是一个比较常见的场景，但是实现起来会有点麻烦。我们可以使用 .onload 事件处理程序，来实现图片的加载完成后再展示。但是如果图片的 onload事件发生在我们监听这个事件之前呢？我们可以使用 .complete来解决这个问题，但是仍然不够简洁，如果是多个图片该怎么处理呢？并且，这种方法仍然是同步的操作，会阻塞主线程。

``` js
function imgLoad(url) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';
        
        request.onload = function() {
            if(request.status == 200) {
                resolve(request.response);
            }else {
                reject(Error('Image didn\'t load successfully; erro code:' + request.statusText));
            }
        }

        request.onerror = function() {
            reject(Error('There was a network error.'));
        }

        request.send();
    })
}
```
::: tip Note
service worker在实际使用中，会使用 caching 和 onfetch 等异步操作，而不是使用老旧的 XMLHttpRequest API。这里的例子使用 XMLHttpRequest API只是为了让你能将注意力集中于理解 Promise上。
:::



### Service workers demo
#### 注册你的worker




性能优化
图片等外部文件压缩
图片懒加载
按需引入
性能优化的调试工具 浏览器F12？

移动端兼容问题
IOS安全区域
系统改变字体大小，使用rem布局，整体比例会变

微信某些功能使用问题

token过期时间设置问题，由后端设置，前端走接口是判断

vuex mutation action区别

常识封装过Promise源码吗

js继承

闭包的现象？遇到过什么闭包问题？怎么解决？


web安全问题
前端正则防止sql注入
XSS
安全这块怎么应用到项目中。


Vue cli 的版本
