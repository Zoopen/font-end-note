# koa入门
## 创建koa2工程
首先，创建一个目录<code>hello-koa</code>并作为工程目录用VS Code打开。然后，我们创建<code>app.js</code>,输入以下代码：
``` js
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// 对于任何请求，app将调用该异步函数处理请求：
app.use(async(ctx, next) => {
    await next();
     // 设置response的Content-Type:
    ctx.response.type = 'text/html';
     // 设置response的内容:
    ctx.response.body = '<h1>Hello, Koa2</h1>';
})

app.listen(3000);
console.log('app started at port 3000...')
```
其中，参数ctx是由koa传入的封装了request和response的变量，我们可以通过它访问request和response, next是koa传入的将要处理的下一个异步函数。

上面的异步函数中，我们首先用await next();处理下一个异步函数，然后设置responce的Content-Type和内容。
由<code>async</code>标记的函数称为异步函数，在异步函数中，可以用<code>await</code>调用另一个异步函数，这两个关键字将在ES7中引入。

现在我们遇到第一个问题，这个koa包怎么装， app.js才能正常导入它？

## 安装
方法一： 可以用npm命令直接安装koa。先打开命令提示符，务必把当前目录切换到<code>hello-koa</code>这个目录，然后执行命令：
``` shell
npm install koa@2.0.0
```
方法二：在hello-koa这个项目下创建一个package.json, 这个文件描述了我们的hello-koa工程会用到哪些包。
``` json
{
    "name": "hello-koa2",
    "version": "1.0.0",
    "description": "Hello Koa 2 example with async",
    "main": "app.js",
    "scripts": {
        "start": "node app.js"
    },
    "keywords": [
        "koa",
        "async"
    ],
    "author": "Michael Liao",
    "license": "Apache-2.0",
    "repository": {
        "type": "git",
        "url": "https://github.com/michaelliao/learn-javascript.git"
    },
    "dependencies": {
        "koa": "2.0.0"
    }
}

```
其中，<code>dependencies</code>描述了我们在工程依赖的包以及版本号。其他字段均用来描述项目信息，可任意填写。
然后，我们在hello-koa目录下执行npm install就可以把所需包以及依赖包一次性全部装好:
``` shell
npm install
```

很显然，第二个方法更靠谱，因为我们只要在package.json正确设置了依赖，npm就会把所有有用到的包都装好。
注意：任何时候都可以直接删除整个<code>node_modules</code>目录，因为用<code>npm install</code>命令可以完整地重新下载所有依赖。并且，这个目录不应该被放入版本控制中。
现在， 我们的工程结构如下：
```
hello-koa/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- app.js <-- 使用koa的js
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包 
```
紧接着，我们在<code>package.json</code>中添加依赖包：
``` js
"dependencies": {
    "koa": "2.0.0"
}
```
然后使用<code>npm install</code>命令安装后，在VS Code中执行<code>app.js</code>：
``` shell
node --inspect --nolazy app.js 
```
调试控制台输出如下:
```
Debugger listening on ws://127.0.0.1:9229/d3eccfa4-b2d0-4c04-b0f5-5144a1fe67e0
For help, see: https://nodejs.org/en/docs/inspector
app started at port 3000...
```
::: tip
Node调试工具：
http://www.ruanyifeng.com/blog/2018/03/node-debugger.html
:::
我们打开浏览器，输入<code>http://localhost:3000</code>，即可看到效果。
还可以直接用命令<code>node app.js</code>在命令行启动程序，或者用<code>npm start</code>命令会让npm执行定义在<code>package.json</code>文件中的script中的start对应命令：
``` js
"scripts": {
    "start": "node app.js"
}
```

## koa middleware(中间件)
让我们仔细看看koa的执行逻辑。核心代码是：
``` js
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>'
})
```
每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx, next参数。
我们可以对ctx操作，并设置返回内容。但是为什么要调用await next()?
原因是koa把很多async函数组成了一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数。我们把每个async函数成为middleware,这些middleware可以组合起来，完成很多有用的功能。
例如，可以用以下3个middleware组成处理链，依次打印日志，记录处理时间，输出HTML：
``` js
app.use(async(ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);//打印URL
    await next();//调用下一个middleware
})

app.use(async(ctx, next) => {
    const start = new Date().getTime();//当前时间
    await next();//调用下一个middleware
    const ms = new Date().getTime() - start;//耗费时间
    console.log(`Time: ${ms}ms`);//打印耗费时间
})

app.use(async(ctx, next) => {
    await next();
    ctx.response.type = `text/html`;
    ctx.response.body = `<h1>Hello, koa2</h1>`;
})
```
middleware的顺序很重要，也就是调用app.use()的顺序决定了middleware的顺序。
此外，如果一个middleware没有调用await next()，会怎么办?答案是后续的middleware将不再执行了。这种情况也很常见，例如，一个检测用户权限的middleware可以决定是否继续处理请求，还是直接返回403错误：
``` js
app.use(async(ctx, next) => {
    if(await checkUserPermission(ctx)) {
        await next();
    }else {
        ctx.response.status = 403;
    }
})
```
理解了middleware，我们就已经会用koa了！

最后注意ctx对象有一些简写的方法，例如ctx.url相当于ctx.request.url,ctx.type相当于ctx.response.type。

# 处理URL
正常情况下，我们应该对不同的URL调用不同的处理函数，这样才能返回不同的结果。例如像这样写：
``` js
app.use(async (ctx, next) => {
    if(ctx.request.path === '/') {
        ctx.response.body = 'index page';
    }else {
        await next();
    }
})

app.use(async (ctx, next) => {
    if (ctx.request.path === '/test') {
        ctx.response.body = 'TEST page';
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/error') {
        ctx.response.body = 'ERROR page';
    } else {
        await next();
    }
});
```
这么写是可以运行的，但是好像有点蠢。
应该有一个能集中处理URL的middleware，它根据不同的URL调用不同的处理函数，这样，我们才能专心为每个URL编写处理函数。

## koa-router

为了处理URL，我们需要引入koa-router这个middleware,让它负责处理URL映射。
我们把上一届的hello-koa工程复制一份，重命名为url-koa。
现在package.json中添加依赖项:
``` json
"koa-router":"7.0.0"
```
然后用npm install 安装。
接下来，我们修改app.js,使用koa-router来处理URL:
``` js
const Koa = require('koa');
//注意require('koa-router')返回的是函数
const router = require('koa-router')();

const app = new Koa();

//log request URL
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})

//add url-route
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
})

router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>`;
})

//add router middleware
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
```

注意导入koa-router的语句最后的()是函数的调用:
``` js
const router = require('koa-router')();
```
相当于：
``` js
const fn_router = require('koa-router');
const router = fn_router();
```
然后，我们使用router.get('/path', async fn)来注册一个GET请求。可以在请求路径中使用带变量的/hello/:name, 变量可以通过ctx.params.name访问。
再运行app.js，我们就可以测试不同的URL:
输入首页: localhost:3000/
输入: localhost:3000/hello/Zoopen

## 处理POST请求
用router.get('/path', async fn)处理的是GET请求。如果要处理POST请求，可以使用router.post('/path', async fn)。

用POST请求处理URL时，我们会遇到一个问题：POST请求通常会发送一个表单，或者JSON，他作为request的body发送，但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能！

所以，我们有需要引入另一个middleware来解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中。

koa-bodyparser就是用来干这个活的。

我们在package.json中添加依赖项：
``` json
"koa-bodyparser": "3.2.0"
```
然后用npm install安装。

下面，修改app.js, 引入koa-bodyparser:
``` js
const bodyParser = require('koa-bodyparser');
```
在合适的位置加上：
``` js
app.use(bodyParser());
```

由于middleware的顺序很重要，这个koa-bodypaser必须在router之前被注册到app对象上。

现在我们就可以处理POST请求了。写一个简单的登陆表单。
``` js
router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="POST">
            <p>Name: <input name="name" value="koa" /></p>
            <p>Password: <input type="passward" name="password" /></p>
            <p><input type="submit" value="提交" /></p>
        </form>
    `;
})

router.post('/signin', async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if(name === 'Zoopen' && password === '123456') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    }else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`
    }
})
```
注意到我们用var name = ctx.request.body.name || ''拿到表单的name字段，如果该字段不存在，默认值设置为''。

类似的，put、delete、head请求也可以由router处理。


## 重构
现在，我们可以处理不同的URL了，但是看看app.js，总感觉还是有点不对劲。

所有的URL处理函数都放到app.js里显得很乱，而且，每加一个URL，就需要修改app.js。随着URL越来越多，app.js就会越来越长。

如果能把URL处理函数集中到某个js文件，或者某几个js文件中就好了，然后让app.js自动导入所有处理URL的函数。这样，代码一分离，逻辑就显得清楚了。最好是这样：
```
url2-koa/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- controllers/
|  |
|  +- login.js <-- 处理login相关URL
|  |
|  +- users.js <-- 处理用户管理相关URL
|
+- app.js <-- 使用koa的js
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

现在我们重构这个项目。
我们先在controllers目录下编写index.js:
``` js
//index.js
var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index page</h1>
    <form action="/signin" method="POST">
        <P>Name: <input name="name" value="Zoopen"/></P>
        <P>Password: <input type="password" name="password"/></P>
        <P><input type="submit" value="提交"/></P>
    </form>
    `;
}

var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    if(name === 'Zoopen' && password === `123456`) {
        ctx.response.body = `<h1>Hello, ${name}</h1>`;
    }else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again!</a></p>`;
    }
}

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
}
```

这个index.js通过module.exports把两个URL处理函数暴露出来。
类似的，hello.js把一个URL处理函数暴露出来：
``` js
var fn_hello = async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
};

module.exports = {
    'GET /hello/:name': fn_hello
}
```

现在，我们修改app.js, 让它自动扫描controllers目录，找到所有js文件，导入，然后注册每个URL：
``` js
// 先导入fs模块，然后用readdirSync列出文件
// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
var files = fs.readdirSync(_dirname + '/controllers');

//过滤出.js文件
var js_files = files.filter((f)=> {
    return f.endsWith('.js');
})

//处理每个js文件
for(var f of js_files) {
    console.log(`process controller: ${f}...`);
    //导入js文件
    let mapping = require(_dirname + '/controllers/' + f);
    for (var url in mapping) {
        //如果URL类似'GET xxx'
        var path = url.substring(4);
        router.get(path, mapping[url]);
        console.log(`register URL mapping: GET ${path}`);
    }else if(url.startsWith('POST')) {
        //如果URL类似'POST xxx'
        var path = url.substring(5);
        router.post(path, mapping[url]);
        console.log(`register URL mapping: POST ${path}`);
    }else {
        //无效的URL
        console.log(`invalid URL: ${url}`);
    }
} 
```
如果上面的大段代码看起来还是有点费劲，那就把它拆成更小单元函数：
``` js

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            //如果url类似'GET XXX'
            var path = url.substring(4);//从第4个字符开始截取
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`)
        } else if (url.startsWith('POST')) {
            //如果url类似'POST XXX'
            var path = url.substring(5);//从第5个字符开始截取
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`)

        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    const files = fs.readdirSync(__dirname + '/controllers');

    //过滤出.js文件
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    })

    for(var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }


}

addControllers(router);

```
确保每个函数功能非常简单，一眼就能看明白，是代码可维护的关键。

## Controller Middleware
最后，我们把扫描controllers目录和创建router的代码从app.js中提取出来，作为一个简单的middleware使用，命名为controller.js:
``` js
const fs = require('fs');

function addMapping(router, mapping) {...}
function addControllers(router, dir) {...}

module.exports = function(dir) {
    let controllers_dir = dir || 'controllers',
        router = reuqire('koa-router')();

    addControllers(router, controllers_dir);
    return router.routes();
}
```
这样一来，我们在app.js的代码又简化了：
``` js
// 导入controller middleware:
const controller = require('./controller');

...
// 使用middleware:
app.use(controller());

```
经过重新整理后的工程目前具备非常好模块化，所有处理URL的函数按功能组存放在controllers目录，今后我们也只需要不断往这个目录下加东西就可以了，app.js保持不变。

# 使用Nunjucks
## Nunjucks
Nunjucks是一个模板引擎。
什么是模板引擎？
模板引擎就是基于模板配合数据构造出字符串输出的一个组件。比如下面的函数就是一个模板引擎：
``` js
function examResult(data) {
    return `${data.name}同学一年级期末考试语文${data.chinese}分，数学${data.math}分，位于年级第${data.ranking}名。`
}
```
如果我们输入数据如下：
``` js
examResult({
    name: '小明',
    chinese: 58,
    math:50,
    ranking: 999
});
```
该模板引擎吧模板字符串里面对应的变量替换以后，就可以得到以下输出：
```
小明同学一年级期末考试语文58分，数学50分，位于年级第999名。
```
模板引擎最常见的输出就是输出网页，也就是HTML文本。当然，也可以输出任意格式的文本，如Text,XML,Markdown等等。

有同学要问了：既然JavaScript的模板字符串可以实现模板功能，那为什么我们还需要另外的模板引擎？

因为JavaScript的模板字符串必须写在JavaScript代码中，要想写出新浪首页这样复杂的页面，是非常困难的。
输出HTML有几个特别重要的问题需要考虑：

### 转义
对特殊字符要转义，避免受到XSS攻击。比如，如果变量name的值不是小明，而是小明<script>...</script>, 模板引擎输出的HTML到了浏览器，就会自动执行恶意JavaScript代码。

### 格式化
对不同类型的变量要格式化，比如，货币需要变成12,345.00这样的格式，日期需要变成2021-04-01这样的格式。

### 简单逻辑
模板还需要能进行一些简单逻辑，比如，要按条件输出内容，需要if实现如下输出：
``` js
{{name}}同学,
{% if score >= 90 %}
成绩优秀，应该奖励
{% elif score >= 60 %}
成绩良好，继续努力
{% else %}
不及格，建议回家大屁股
{% endif %}
```

所以，我们需要一个功能强大的模板引擎，来完成页面输出的功能。

## Nunjucks
我们选择NunJucks作为模板引擎。NumJucks是Mozilla开发的一个纯JavaScript编写的模板引擎，既可以用在Node环境下，又可以运行在浏览器端。但是，主要还是运行在Node环境下，因为浏览器端有更好的模板解决方案，例如MVVM框架。

如果你使用过Python的模板引擎jinja2，那么使用Nunjucks就非常简单，两者的语法几乎是一模一样的，因为Nunjucks就是用JavaScript重新实现了jinjia2。

从上面的例子我们可以看到，虽然模板引擎内部可能非常复杂，但是使用一个模板引擎是非常简单的，因为本质上我们只需要构造这样一个函数：
``` js
function render(view, model) {
    //TODO...
}
```
其中，view是模板的名称（又称为视图），因为可能存在多个模板，需要选择其中一个。model就是数据，在JavaScript中，他就是一个简单的Object。render函数返回一个字符串，就是模板的输出。

下面我们来使用Nunjucks这个模板引擎来编写几个HTML模板，并且用实际数据来渲染模板并获得最终的HTML输出。

我们创建一个use-nunjucks的VS Code工程结构如下：
```
use-nunjucks/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- views/
|  |
|  +- hello.html <-- HTML模板文件
|
+- app.js <-- 入口js
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```
其中，模板文件存放在views目录中。
我们现在package.json中添加nunjucks的依赖:
``` json
"nunjucks": "2.4.2"
```

注意，模板引擎是可以独立使用的，并不需要依赖koa。用npm install安装所有依赖包。
紧接着，我们要编写使用Nunjucks的函数render。怎么写？方法是查看Nunjucks的[官方文档](https://nunjucks.bootcss.com/)，仔细阅读后，在app.js中编写代码如下:
