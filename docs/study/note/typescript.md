##  快速开始


### 全局安装
``` shell
npm install -g typescipt
```

### 创建一个ts文件
``` shell
//greeter.ts
function greeter(person) {
    return 'Hello ,' + person;
}
let user = 'Mike';
document.body.innerHTML = greeter(user);
```

### 编译代码
``` shell
tsc greeter.ts
```
输出结果为一个greeter.js文件，它包含了和输入文件中相同的JavsScript代码。 一切准备就绪，我们可以运行这个使用TypeScript写的JavaScript应用了！

### 类型注解
给 person函数的参数添加: string类型注解
```ts
function greeter(person: string) {
    return 'Hello ,' + person;
}
let user = 'Mike';
document.body.innerHTML = greeter(user);
```
TypeScript里的类型注解是一种轻量级的为函数或变量添加约束的方式。 在这个例子里，我们希望 greeter函数接收一个字符串参数。 然后尝试把 greeter的调用改成传入一个数组：
```ts
function greeter(person: string) {
    return 'Hello ,' + person;
}
let user = [1,2,3];
document.body.innerHTML = greeter(user);
```
重新编译，你会看到产生了一个错误。
``` shell
greeter.ts:5:35 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```
尝试删除greeter调用的所有参数, 再次编译，一样报错。
``` shell
greeter.ts:5:27 - error TS2554: Expected 1 arguments, but got 0.
```
::: warning 注意
尽管有错误，greeter.js文件还是被创建了。 就算你的代码里有错误，你仍然可以使用TypeScript。但在这种情况下，TypeScript会警告你代码可能不会按预期执行。
:::

### 接口
使用接口来描述一个拥有firstName和lastName字段的对象。
``` ts
interface Person {
    firstname: string;
    lastname: string;
}
//接口用作类型注解
function greeter(person: Person) {
    return 'Hello, ' + person.firsname + ' ' + person.lastname;
}

let user = { firstname: 'Jone', lastname: 'DJ'};

document.body.innerHTML = greeter(user);
```
在TypeScript里，只在两个类型内部的结构兼容那么这两个类型就是兼容的。 这就允许我们在实现接口时候只要保证包含了接口要求的结构就可以，而不必明确地使用 implements语句。

### 类
使用类来改写这个例子。 TypeScript支持JavaScript的新特性，比如支持基于类的面向对象编程。让我们创建一个Student类，它带有一个构造函数和一些公共字段。 注意类和接口可以一起共作，程序员可以自行决定抽象的级别。

还要注意的是，在构造函数的参数上使用public等同于创建了同名的成员变量。
``` ts
class Student {
    fullName: string;
    constructor(public firstname, public middleInitial, public lastname) {
        this. fullName = firstname + ' ' + middleInitial + ' ' + lastname;
    }
}
interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstname + ' ' + person.lastname; 
}

let user = new Student('Jane', 'M.', 'User');
/*
    Student {firstname: "Jane", middleInitial: "M.", lastname: "User", fullName: "Jane M. User"}
    firstname: "Jane"
    fullName: "Jane M. User"
    lastname: "User"
    middleInitial: "M."
    __proto__: Object
*/

document.body.innerHTML = greeter(user);
```

## 基础类型

### 介绍
为了让程序有价值，我们需要能够处理最简单的数据单元：数字，字符串，结构体，布尔值等。 TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

### 布尔值 <code>boolean</code>
最基本的数据类型就是简单的 true/false 值, 在JavaScript和TypeScript里叫做<font color=bf414a> boolean </font>（其它语言中也一样）。
``` ts
let isDone: boolead = false;
```

### 数字 <code>number</code>
和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是<font color=bf414a> number </font>。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。
``` ts
let decLiteral: number = 6; //十进制
let hexLiteral: number = 0xf00d; //十六进制
let binaryLiteral: number = 0b1010; //二进制
let octalLiteral: number = 0o744; //八进制
```

### 字符串 <code>string</code>
JavaScript程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用<font color=bf414a> string </font>表示文本数据类型。 和JavaScript一样，可以使用双引号（ <font color=bf414a> " </font>）或单引号（<font color=bf414a> ' </font>）表示字符串。
``` ts
let name: string = 'bob';
name = "smith";
```
你还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（<font color=bf414a> ` </font>），并且以<font color=bf414a> ${ expr } </font>这种形式嵌入表达式
``` ts 
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

### 数组
TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。
第一种，可以在元素类型后面接上 <font color=bf414a> [] </font>，表示由此类型元素组成的一个数组：
``` ts
let list: number[] = [1, 2, 3];
```
 第二种方式是使用数组泛型，<font color=bf414a> Array<元素类型> </font>：
``` ts
 let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为<font color=bf414a> string </font>和<font color=bf414a> number </font>类型的元组。
``` ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```
当访问一个已知索引的元素，会得到正确的类型：
``` ts
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```
当访问一个越界的元素，会使用联合类型替代：
```ts
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```
::: danger 注意
试了一下访问越界元素会报错, 联合类型得再深入了解一下
:::

### 枚举
<font color=bf414a> enum </font>类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

``` ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
console.log(c);//0
```
默认情况下，从<font color=bf414a> 0 </font>开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从<font color=bf414a> 1 </font>开始编号：
``` ts
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
console.log(c);//1
```
或者，全部都采用手动赋值：
``` ts
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```
枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：
``` ts
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
```
#### 遍历枚举
``` ts
enum Color {Red, Green, Blue}
for(let key in Color) {
    console.log(key); //显示 0  1  2  Red  Green  Blue  
}
```
枚举本质是存了枚举名 ，枚举值得对象,实际上这两个属性是相互为键相互对应的, 通过枚举名可以找到枚举值，反之通过枚举值也可以获得枚举名。
``` ts
enum Color {Red, Green, Blue}
let a: Color = Color.Red;
let b: string = Color[0];
console.log(a, b); // 显示 0 Red
```
### Any
有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量：
``` ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```