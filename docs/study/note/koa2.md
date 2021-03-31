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