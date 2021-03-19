##  快速开始
<code>Flow</code>是一个js代码静态类型检查器。<code>Flow</code>通过静态类型注释来检查你的代码。

### 安装编译器
第一步你需要安装一个编译器来过滤掉Flow的类型注释。可以选择<code>Babel</code>或<code>flow-remove-types</code>.
<code>Babel</code>是一个支持Flow的js代码编译器。它将会获取你的Flow代码并过滤掉其中的任何类型注释。
<code>flow-remove-types</code>是一个小型CLI工具,用于从文件中剥离Flow的类型注释。对于那些不需要Babel提供的项目来说，它是一个轻量级的Babel替代品。
#### 使用babel编译器。
使用yarn或npm安装<code>@babel/core</code>, <code>@babel/cli</code>, and <code>@babel/preset-flow</code>

``` shell
yarn add --dev @babel/core @babel/cli @babel/preset-flow
# npm install --save-dev @babel/core @babel/cli @babel/preset-flow
```
然后在跟目录下创建一个.babelrc文件，并在<code>"presets"</code>中添加<code>"@babel/preset-flow"</code>
``` js
{
  "presets": ["@babel/preset-flow"]
}
```
如果你将所有源文件放在<code>src</code>目录中，你可以通过运行以下脚本编译它们到另一个目录。
``` shell
yarn run babel src/ -d lib/
# ./node_modules/.bin/babel src/ -d lib/
```
可以在package.json中的scripts中添加以下字段。
``` json
{
  "name": "my-project",
  "main": "lib/index.js",
  "scripts": {
    "build": "babel src/ -d lib/",
    "prepublish": "yarn run build"
  }
}
```

### 安装Flow
Flow推荐每个项目局部安装，而不是全局安装。
#### 使用yarn安装
``` shell
yarn add --dev flow-bin
```

运行Flow:
```
yarn run flow
```
::: tip 注意
 在运行<code>yarn run flow</code>前你可能需要先运行<code>yarn run flow init</code>. 
:::

#### 使用npm安装
``` shell
npm install --save-dev flow-bin
```
可以在package.json中的scripts中添加以下字段。
``` json
{
  "name": "my-flow-project",
  "version": "1.0.0",
  "devDependencies": {
    "flow-bin": "^0.147.0"
  },
  "scripts": {
    "flow": "flow"
  }
}
```
运行Flow:
第一次运行：
``` shell
npm run flow init 
```
第二次运行：
``` shell
npm run flow
```
### 开始使用
#### 初始化项目
``` shell
flow init
```
发现报错
``` shell
flow : 无法将“flow”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
+ flow init
+ ~~~~
    + CategoryInfo          : ObjectNotFound: (flow:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```
重启电脑无效
应该使用如下代码
``` shell
yarn run flow init
```
没错，在上一步中我们已经运行过一次了，再次运行，将会报错：
``` shell
Error: "D:\code\flowdemo\.flowconfig" already exists!

error Command failed with exit code 8.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```
运行该命令后，在根目录将生成.flowconfig文件。该文件告诉Flow后台进程从哪里开始检查代码错误。
现在，你的项目已经允许使用Flow了。

#### 运行后台进程
Flow的核心好处是能够快速的检查代码中的错误。
``` shell
yarn run flow status
```
该命令首先启动一个后台进程，该进程将检查所有Flow文件是否有错误。后台进程继续运行，监视对代码的更改，并逐步检查这些更改是否有错误。
::: tip 
您还可以键入flow来实现相同的效果，因为status是Flow二进制的默认标志。
:::
::: tip 
在任何给定的时间只有一个后台进程在运行，因此如果您多次运行flow status，它将使用相同的进程。
:::
::: tip 
如果需要停止后台进程，使用flow stop命令。
:::

测试一下
``` js
//test.js
// @flow
function demo(n: ?number) {
    return n;
}
demo("123")
```
然后运行后台进程：
``` shell
yarn run flow status
# 或
yarn run flow
## 得再深入了解下两者的区别
```
报错：
``` shell
Error -------------------------------------------------------------------------------------------------- src/test.js:5:6

Cannot call `demo` with `"123"` bound to `n` because string [1] is incompatible with number [2]. [incompatible-call]

   src/test.js:5:6
   5| demo("123")
           ^^^^^ [1]

References:
   src/test.js:2:19
   2| function demo(n: ?number) {
                        ^^^^^^ [2]



Found 1 error
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.

```
我们定义了demo函数接受一个number类型的参数， 但是调用的时候传了一个string类型的参数。