# Class和样式绑定

## 绑定html类名
### Object语法
你可以传递一个对象给<code>:class</code>(<code>v-bind:class</code>缩写)来动态切换类名。
``` html
<div :class="{active: isActive}"></div>
```
上面的语法意思是active这个类名是否存在取决于isActive的真假。

你可以通过在对象中拥有多个字段来切换更多的类。此外，<code>:class</code>也可以与普通的<code>class</code>属性共存。当有如下模板：
``` html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```
且data数据是：
``` js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```
则渲染结果为：
``` html
<div class="static active"></div>
```

当<code>isActive</code>或者<code>hasError</code>变化时，<code>class</code>列表将相应地更新。例如，如果<code>hasError</code>的值为 <code>true</code>，<code>class</code>列表将变为 <code>"static active text-danger"</code>。

绑定的数据对象不必内联定义在模板里：
``` html
<div v-bind:class="classObject"></div>
```

``` js 
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```
渲染结果同上。我们也可以在这里绑定一个返回对象的<a href="">计算属性</a>。这是一个常用且强大的模式：
``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Array语法
我们可以传递一个数组给<code>:class</code>来应用该类列表。
``` html
<div :class="[activeClass, errorClass]"></div>
```
``` js
data() {
  return {
    activeClass: 'active',
    errorClass: 'error'
  }
}
```
渲染结果
``` html
<div class="active error"></div>
```

如果你也想根据条件切换列表中的 class，可以用三元表达式：
``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```
这样写将始终添加 errorClass，但是只有在 isActive 是 truthy<sup>[1]</sup>时才添加 activeClass。

不过，当有多个条件 class 时这样写有些繁琐。所以在数组语法中也可以使用对象语法：
``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### 用在组件上
当你在具有单个根元素的自定义组件上使用<code>class</code>属性为组件添加类名时，这些类名将添加到这个根元素上。已经存在在根元素上的类名不会被覆盖。
例如，如果你定义了以下组件：
``` js 
const app = Vue.createApp({})

app.component('my-component',{
  template: `<div class="foo bar">Hello vue</div>`
})
```
在使用该组件时，添加一些类名:
``` html
<div id="app">
    <my-component class="abc ddd"></my-component>
</app>
```
渲染后的HTML为：
``` html
<div class="foo bar abc ddd">Hello vue</div>
```

使用class绑定也是同样效果：
``` js
<my-component v-bind:class="{active: isActive}"></my-component>
```
当isActive为真值时，HTML渲染为：
``` html
<div class="foo bar active">Hello vue</div>
```

如果你的自定义组件有多个根元素，需要定义由哪个元素来接收这个class,可以使用<code>$attrs</code>这个组件属性:
``` html
<div id="app">
    <my-component class="abc"></my-component>
</div>
```
``` js
const app = Vue.createApp({})
app.component("my-component", {
  template: `
    <p :class="$attrs.class">Hi!</p>
    <span>This is a child Component</span>
  `
})
```

## 绑定行内样式
### Object语法
<code>v-bind:style</code>的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名：
``` html
<div :style="{color: activeColor, fontSize: fontSize + 'px'}"></div>
```
``` js 
data: {
  activeColor: 'red',
  fontSize: 16
}
```

直接绑定到一个样式对象通常是一个好主意，这样模板就会更简洁:
``` html
<div :style="styleObject"></div>
```
``` js
data() {
  return {
    styleObject: {
      color: 'red',
      'font-size': '14px'
    }
  }
}
```
同样，对象语法经常与返回对象的计算属性一起使用。

### Array语法
v-bind:style 的数组语法可以将多个样式对象应用到同一个元素上：
``` html
<div :style="[baseStyles, errorStyles]"></div>
```
``` js
data() {
  return {
    baseStyles: {
      color: 'black',
      fontSize: '40px'
    },
    errorStyles: {
      backgroundColor: 'red'
    }
  }
}
```
渲染效果：
``` html
<div style="color: black; font-size: 30px; background-color: red;"></div>
```

### 自动添加前缀
当<code>v-bind:style</code>使用需要添加浏览器引擎前缀的 CSS property 时，如<code>transform</code>，Vue.js 会自动侦测并添加相应的前缀。

### 多重值
::: tip
2.3.0+
:::
从 2.3.0 起你可以为<code>style</code>绑定中的 property 提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：
``` html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 <code>display: flex</code>。


## 条件判断
v-if 根据条件控制DOM元素销毁创建。
v-show 根据条件控制元素的样式来实现显隐。
### 使用哪一个？
如果需要频繁改变元素显隐，优先
使用v-show指令，它不会频繁销毁DOM。
如果不需要频繁改变元素显隐，这两个指令都差不多，具体情况具体分析。

## 列表循环
v-for。
循环的每一项需要添加key值，以提高性能。

v-for的优先级比v-if优先级高。
这种写法是无效的。
``` js 
<div v-for="(value, key, index) in listObject" v-if="key != 'lastname' ">
      {{value}}----{{key}}----{{index}}
</div>
```
应该改成这样:
``` js 
<div v-for="(value, key, index) in listObject">
    <template v-if="key != 'lastname' ">
        {{value}}----{{key}}----{{index}}
    </template>
</div>
```

## 事件绑定
使用v-on:click为元素绑定事件：
``` html
<button v-on:click="handleBtnClick">btn</button>
```
在methods中书写该事件方法：
``` js 
methods: {
  handleBtnClick(event) {
    console.log('Click', event)
  }
}
```
其中，当绑定事件没有传递参数时，event为原生事件对象。
如果传递了参数，则在后面的参数中传递$event以获取原生事件对象：
``` html
<button v-on:click="handleBtnClick(2, $event)">btn</button>
```
``` js 
methods: {
  handleBtnClick(num, event) {
    console.log('Click', num, event)
  }
}
```

绑定一个事件想要执行多个函数，使用逗号间隔，且不能使用方法引用，而是写调用：
``` html
<button @click="handleBtnClick(), handleBtnClick1()">Btn3</button>
```

### 事件修饰符
如以下代码，当点击Btn按钮时，事件会冒泡(即handleDivClick也会被触发)：
``` html
<div @click="handleDivClick">
    <button @click="handleBtnClick(2, $event)">Btn</button>
</div>
```
使用stop修饰符阻止事件冒泡。
``` html
<div @click="handleDivClick">
    <button @click.stop="handleBtnClick(2, $event)">Btn</button>
</div>
```
使用self修饰符：点击的元素绑定的事件是自己时才触发。
使用prevent修饰符阻止默认行为。
使用capture修饰符将使用捕获模式触发事件。
使用once修饰符绑定的事件只执行一次。
使用passive修饰符提升滚动性能。

### 按键修饰符
按键修饰符： enter, tab, delete, backspace， up, down, left, right
enter，回车时才触发
``` html
<div>
  <input @keydown.enter="handleKeyDown" />
</div>
```

### 鼠标修饰符
鼠标修饰符： left, right, middle
``` html
<div>
    <div @click.left="handleClick">123</div>
</div>
```

### 精确修饰符
exact

### 双向绑定
input 与 textarea中使用v-model指令实现数据双向绑定。
``` html
 <div>
    {{message}}
    <input v-model="message" />
    <textarea v-model="message" />
</div>
```
#### 复选框
boolean为真值时，为选中状态，为假则非选中状态。
``` html
jack<input type="checkbox" v-model="boolean" value="jack" />
```

当有多个复选框时，绑定一个数组，选中的value会被添加到数组中。如下：
``` html
jack<input type="checkbox" v-model="arr" value="jack" />
well<input type="checkbox" v-model="arr" value="well" />
dell<input type="checkbox" v-model="arr" value="dell" />
```
如果选择了jack,  well,则arr状态为['jack', 'well']

#### 单选框
为单选框绑定数据时，使用字符串形式绑定。sex: ""
``` html
{{sex}}
男<input type="radio" v-model="sex" value="男" />
女<input type="radio" v-model="sex" value="女" />
```


#### 下拉选择框
只选定其中一个，selectVal使用字符串绑定。
``` html
{{selectVal}}
<select v-model="selectVal">
  <option disabled value="">请选择</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>

</select>
```

多选
选定多个，selectVal使用数组, 选择的时候需要按住ctrl键
``` html
{{selectVal}}
<select v-model="selectVal" multiple>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
</select>
```

下拉框中option通常是被循环出来的。
``` js
data: {
  selectVal: [],
  options: [
              {
                  text: 'A', value: 'A'
              },
              {
                  text: 'B', value: 'B'
              },
              {
                  text: 'C', value: 'C'
              }
          ]
}
```

``` html
下拉选择框
{{selectVal}}
<select v-model="selectVal" multiple>
    <option v-for="item in options" :value="item.value">{{item.text}}</option>
</select>
```
因为item.value为表达式，所有使用:value。

#### 更多功能
在复选框的双向绑定中，可以使用指定值来决定其是否选中，如下，当值为Hello时，为选中。
``` html
<input type="checkbox" v-model="checkboxVal"  true-value="Hello" false-value="world"/>
```

表单修饰符。
lazy, 当input框输入时，不再实时更新，只有blur时才触发。
``` html
<input v-model.lazy="msg" />
```
number, 当input框输入数字时，检查其类型，会发现其返回的类型为string, 当需要设置返回类型为number时，使用number修饰符。
``` html
<input v-model.number="msg" />
```
trim,去除首尾空格。

# 组件的定义及复用性，局部组件和全局组件
把一个复杂的应用拆分成多个小的子组件，然后将这些子组件合并到一起。降低项目维护的成本。
组件是页面中的一部分，它具备复用性，且每个组件中的数据是该组件独享的。
## 全局组件
只要定义了，处处可以使用，使用简单但性能不高。
``` js
const app = Vue.createApp({})
app.component("child-component", {
  template: `<div>child-component</div>`
})//通过此方法生成的组件为全局组件。
const vm = app.mount("#root")
```

## 局部组件
定义，声明（注册）及使用局部组件。定义之后，要注册之后才能使用，性能比较高， 使用起来比较麻烦。
``` js
//定义局部组件
const Counter = {
  data() {
    return {
      count: 1
    }
  },
  template: `
    <div @click="count += 1">{{count}}</div>
  `
}

const app = Vue.component({
  //声明（注册）局部组件
  components: {
    counter: Counter
  },
  //  components: {counter},//当key-value值一样时，可以使用es6语法
  //使用局部组件
  template: `
    <counter/>
  `
})
```
在使用局部组件时，可以为其改名：
``` js
const app = Vue.component({
  //声明（注册）局部组件
  components: {
    'my-component': Counter
  },
  //使用局部组件
  template: `
    <my-component/>
  `
})
```
### 全局组件vs局部组件
全局组件：只要定义了，处处可以使用，性能相对不高，但是使用方便，组件名称建议使用小写字母单词，中间用横线间隔。
局部组件：定义了要注册之后才能使用，使用有些麻烦，组件名称建议首字母大写，驼峰式命名。
局部组件使用时，要做一个名字和组件间的映射对象，不写的话Vue底层也会自动帮你常识映射。