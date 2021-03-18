## How to build a VuePress

### 1.创建并进入一个新的目录
```shell
mkdir vuepress-starter && cd vuepress-starter
```

### 2.使用你喜欢的包管理器进行初始化
```shell
yarn init # npm init
```

### 3.将 VuePress 安装为本地依赖
官方不再推荐全局安装 VuePress
```shell
yarn add -D vuepress # npm install -D vuepress
```
::: warning 注意
如果你的现有项目依赖了 webpack 3.x，官方推荐使用 Yarn (opens new window)而不是 npm 来安装 VuePress。因为在这种情形下，npm 会生成错误的依赖树。
:::

### 4.创建你的第一篇文档
```shell
mkdir docs && echo '# Hello vuepress' > docs/README.md
```

### 5.在*package.json*中添加一些scripts