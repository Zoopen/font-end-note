##  快速开始


### 全局安装
``` shell
npm install -g typescript
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
最基本的数据类型就是简单的 true/false 值, 在JavaScript和TypeScript里叫做<code> boolean </code>（其它语言中也一样）。
``` ts
let isDone: boolead = false;
```

### 数字 <code>number</code>
和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是<code> number </code>。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。
``` ts
let decLiteral: number = 6; //十进制
let hexLiteral: number = 0xf00d; //十六进制
let binaryLiteral: number = 0b1010; //二进制
let octalLiteral: number = 0o744; //八进制
```

### 字符串 <code>string</code>
JavaScript程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用<code> string </code>表示文本数据类型。 和JavaScript一样，可以使用双引号（ <code> " </code>）或单引号（<code> ' </code>）表示字符串。
``` ts
let name: string = 'bob';
name = "smith";
```
你还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（<code> ` </code>），并且以<code> ${ expr } </code>这种形式嵌入表达式
``` ts 
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

### 数组
TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。
第一种，可以在元素类型后面接上 <code> [] </code>，表示由此类型元素组成的一个数组：
``` ts
let list: number[] = [1, 2, 3];
```
 第二种方式是使用数组泛型，<code> Array<元素类型> </code>：
``` ts
 let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为<code> string </code>和<code> number </code>类型的元组。
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
<code> enum </code>类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

``` ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
console.log(c);//0
```
默认情况下，从<code> 0 </code>开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从<code> 1 </code>开始编号：
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
有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用<code> any </code>类型来标记这些变量：
``` ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```
在对现有代码进行改写的时候，<code> any </code>类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为<code> Object </code>有相似的作用，就像它在其它语言中那样。 但是 <code> Object </code>类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：
``` ts
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```
当你只知道一部分数据的类型时，<code> any </code>类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：
``` ts
let list: any[] = [1, true, "free"];

list[1] = 100;
```

### Void
某种程度上来说，<code> void </code>类型像是与<code> any </code>类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是<code> void </code>：
``` ts
function warnUser(): void {
    console.log("This is my warning message");
    //return null;//undefined; 只允许返回null 和 undefined, 否则报错。
}
```
声明一个<code> void </code>类型的变量没有什么大用，因为你只能为它赋予<code> undefined </code>和<code> null </code>：
``` ts
let unusable: void = undefined;
```

### Null和Undefined;
TypeScript里，<code> undefined </code>和<code> null </code>两者各自有自己的类型分别叫做<code> undefined </code>和<code> null </code>。 和 <code> void </code>相似，它们的本身的类型用处不是很大：
``` ts
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```
默认情况下<code> undefined </code>和<code> null </code>是所有类型的子类型。 就是说你可以把<code> undefined </code>和<code> null </code>赋值给<code> number </code>类型的变量。
然而，当你指定了<code> --strictNullChecks </code>标记，<code> undefined </code>和<code> null </code>只能赋值给<code> void </code>void和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个<code> string </code>或<code> undefined </code>或<code> null </code>，你可以使用联合类型<code>string | null | undefined </code>。 再次说明，稍后我们会介绍联合类型。
::: tip 注意
我们鼓励尽可能地使用<code> --strictNullChecks </code>，但在本手册里我们假设这个标记是关闭的。
:::

### Never 
<code> never </code>类型表示的是那些永不存在的值的类型。 例如， <code> never </code>类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是<code> never </code>类型，当它们被永不为真的类型保护所约束时。

<code> never </code>类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是<code> never </code>的子类型或可以赋值给<code> never </code>类型（除了<code> never </code>本身之外）。 即使 <code> any </code>也不可以赋值给<code> never </code>。

下面是一些返回<code> never </code>类型的函数：
``` ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

### Object
<code> object </code>表示非原始类型，也就是除<code> number，string，boolean，symbol，null或undefined </code>之外的类型。

使用<code> object </code>类型，就可以更好的表示像<code> Object.create </code>这样的API。例如：
``` ts 
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // 没报错？
```

### 类型断言
有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：
``` ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
另一个为<code>as</code>语法：
``` ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```
两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。

### 关于<code>let</code>
你可能已经注意到了，我们使用let关键字来代替大家所熟悉的JavaScript关键字var。 let关键字是JavaScript的一个新概念，TypeScript实现了它。 我们会在以后详细介绍它，很多常见的问题都可以通过使用 let来解决，所以尽可能地使用let来代替var吧。


## 变量声明
<code>let</code>和<code>const</code>







