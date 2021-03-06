## Class和样式绑定

### 绑定html类名
#### Object语法
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

#### Array语法
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

#### 用在组件上
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

### 绑定行内样式
#### Object语法
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

#### Array语法
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

#### 自动添加前缀
当<code>v-bind:style</code>使用需要添加浏览器引擎前缀的 CSS property 时，如<code>transform</code>，Vue.js 会自动侦测并添加相应的前缀。

#### 多重值
::: tip
2.3.0+
:::
从 2.3.0 起你可以为<code>style</code>绑定中的 property 提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：
``` html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 <code>display: flex</code>。


### 条件判断
v-if 根据条件控制DOM元素销毁创建。
v-show 根据条件控制元素的样式来实现显隐。
#### 使用哪一个？
如果需要频繁改变元素显隐，优先
使用v-show指令，它不会频繁销毁DOM。
如果不需要频繁改变元素显隐，这两个指令都差不多，具体情况具体分析。

### 列表循环
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

### 事件绑定
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

#### 事件修饰符
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

#### 按键修饰符
按键修饰符： enter, tab, delete, backspace， up, down, left, right
enter，回车时才触发
``` html
<div>
  <input @keydown.enter="handleKeyDown" />
</div>
```

#### 鼠标修饰符
鼠标修饰符： left, right, middle
``` html
<div>
    <div @click.left="handleClick">123</div>
</div>
```

#### 精确修饰符
exact

#### 双向绑定
input 与 textarea中使用v-model指令实现数据双向绑定。
``` html
 <div>
    {{message}}
    <input v-model="message" />
    <textarea v-model="message" />
</div>
```
##### 复选框
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

##### 单选框
为单选框绑定数据时，使用字符串形式绑定。sex: ""
``` html
{{sex}}
男<input type="radio" v-model="sex" value="男" />
女<input type="radio" v-model="sex" value="女" />
```


##### 下拉选择框
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

##### 更多功能
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

## 组件的定义及复用性，局部组件和全局组件
把一个复杂的应用拆分成多个小的子组件，然后将这些子组件合并到一起。降低项目维护的成本。
组件是页面中的一部分，它具备复用性，且每个组件中的数据是该组件独享的。
### 全局组件
只要定义了，处处可以使用，使用简单但性能不高。
``` js
const app = Vue.createApp({})
app.component("child-component", {
  template: `<div>child-component</div>`
})//通过此方法生成的组件为全局组件。
const vm = app.mount("#root")
```

### 局部组件
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
    <counter />
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

#### 全局组件vs局部组件
全局组件：只要定义了，处处可以使用，性能相对不高，但是使用方便，组件名称建议使用小写字母单词，中间用横线间隔。
局部组件：定义了要注册之后才能使用，使用有些麻烦，组件名称建议首字母大写，驼峰式命名。
局部组件使用时，要做一个名字和组件间的映射对象，不写的话Vue底层也会自动帮你常识映射。


### 组件间传值及传值检验
#### 父传子
父组件调用子组件标签，并通过标签的属性向子组件传值，子组件通过props接受父组件传递过来的值，就可以在子组件中使用该值了。
``` js
const app = Vue.createApp({
    data() {
        return {
            num: 123
        }
    },
    template: `
        <div>
            <test content="hello world! Zoopen" :num="num" />    
        </div>
    `
})

app.component('test', {
    props: ['content'],
    template: `<div>{{content}}</dic>`
})
const vm = app.mount("#root");
```

其中，content为静态传值，num为动态传值。静态传值只能传递字符串，动态传值传递类型更丰富。

#### 校验
子组件对父组件传递过来的值做一个校验。

类型校验
子组件在接收props时，使用对象的方式：
``` js
props: {
  content: String
}
```

上面如果传递过来的数据非字符串，控制台会出现警告信息。

也可以通过required规定该参数必传，否则警告：
``` js
props: {
  content: {
    type: String,
    required: true
  }
}
```

可以通过default设置默认值，通过validator对值进行深度的校验：
``` js
props: {
    content: {
        type: Number,
        required: true,
        validator: function(value) {
            return value > 1000;
        },
        default: function() {
            return 123;
        }
    },
    num: Function
},
```

type:String, Boolean, Array, Object, Function, Number, Symbol
required: ture/false
default: 234
validator

#### 向子组件传递多个参数
当需要传递多个参数给子组件时，你可能会这样写：
``` js
const app = Vue.createApp({
    data() {
        return {
            num: 234,
            a: 123,
            b:456,
            c: 789
        }
    },
    template: `
        <div>
            <test :content="num" :a="a" :b="b" :c="c" />    
        </div>
    `
})

app.component('test', {
    props: ['content', 'a', 'b', 'c'],
    
    template: `<div>test
        {{content}}-{{a}}-{{b}}-{{c}}
        </div>`
})
const vm = app.mount("#root");
```

如上父组件传递多个数据给子组件，一个一个v-bind太麻烦了，可以使用另一种办法：
``` js
const app = Vue.createApp({
    data() {
        return {
          params: {
            content: 234,
            a: 123,
            b:456,
            c: 789
          }

        }
    },
    template: `
        <div>
            <test v-bind="params" />    
        </div>
    `
})

app.component('test', {
    props: ['content', 'a', 'b', 'c'],
    
    template: `<div>test
        {{content}}-{{a}}-{{b}}-{{c}}
        </div>`
})
const vm = app.mount("#root");
```

这种方法跟上面那种是等价的。

#### 参数大小写问题
在传递参数时，当参数名称太长时，考虑短横杠连接，如果写成小驼峰，大驼峰，html将会自动将其转为小写字母。子组件接受参数时，将短横杠后面首个字母大写的方式接收。
``` js
  const app = Vue.createApp({
        data() {
            return {
                content: 234,
            }
        },
        template: `
            <div>
                <test :content-abc="content" />    
            </div>
        `
    })

    app.component('test', {
        props: ['contentAbc'],

        template: `<div>test
            {{contentAbc}}
            </div>`
    })
    const vm = app.mount("#root");
```

即传的时候使用content-abc
  接的时候使用contentAbc

### 单项数据流的理解
父组件向子组件传递数据，子组件接收后可以使用这些数据，但是子组件不能直接修改传递过来的数据，即props是只读的。
以下代码，期望点击div时，count自增，但是这是不被允许的：
``` js
    const app = Vue.createApp({
        data() {
            return {
                count: 1,
            }
        },
        template: `
            <div>
                <counter :count="count" />    
            </div>
        `
    })

    app.component('counter', {
        props: ['count'],
 
        template: `
        <div @click="count+=1">{{count}}</div>`
    })
    const vm = app.mount("#root");
```

那么，我们难道就无法实现我们想要的功能了吗?我们可以试试这样做：
``` js
const app = Vue.createApp({
    data() {
        return {
            count: 1,
        }
    },
    template: `
        <div>
            <counter :count="count" />    
        </div>
    `
})

app.component('counter', {
    props: ['count'],
    data() {
        return {
            myCount: this.count,
        }
    },
    template: `
    <div @click="myCount+=1">{{myCount}}</div>`
})
const vm = app.mount("#root");
```

通过props接收到父组件传递过来的参数后，保存到自己的data状态中，每个组件都能操作自己的状态，这时候，就可以实现点击div,count自增了。

为什么Vue中子组件不能直接改变父组件的数据呢。为何要强调单项数据流的概念呢。
假设现在子组件可以直接修改父组件数据：
``` js
const app = Vue.createApp({
        data() {
            return {
                count: 1,
            }
        },
        template: `
            <div>
                <counter :count="count" />    
                <counter :count="count" />    
                <counter :count="count" />    
            </div>
        `
    })
    app.component('counter', {
        props: ['count'],
        template: `
        <div @click="count+=1">{{count}}</div>`
    })
    const vm = app.mount("#root");
```

在父组件中定义几个counter组件,现在，当我点击第一个counter,那么他会执行count+=1，（假设现在子组件可以直接修改父组件数据），那么父组件中的count将变为2，此时，其他的counter组件也将受到影响，因为他们用的也是父组件的count数据。

这样带来什么问题呢。组件之间的数据互相耦合无法区分开，不利于组件的维护，也避免一些以后很难找的BUG。


## Non-props
当父组件给子组件传递参数，子组件不使用props接收时，我们怎么获取这些参数呢：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" />
            </div>
        `
    })
    app.component('counter', {
        template: `
        <div>Counter</div>
        `
    })

    app.mount('#root')
```

此时，打开浏览器控制台，选中该元素，可以看到：
``` html
<div>
  <div msg="Hello">Counter</div>
</div>
```

此时，底层做了什么操作呢，它把父组件传递过来的内容，放到子组件最外层的标签上，作为最外层标签的一个属性。

那如果此时我们不想要子组件最外层标签有这个属性，怎么办呢？可以使用inheritAttrs: false：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" />
            </div>
        `
    })
    app.component('counter', {
        inheritAttrs: false,
        template: `
        <div>Counter</div>
        `
    })

    app.mount('#root')
```

### 一般什么时候用Non-props呢？
当我们想给子组件添加style， class的时候


当子组件有多个根节点的时候，会发现Non-props不起作用：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" />
            </div>
        `
    })
    app.component('counter', {
        template: `
        <div>Counter</div>
        <div>Counter</div>
        <div>Counter</div>
        `
    })

    app.mount('#root')
```

如果此时想要它生效，可以这样：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" />
            </div>
        `
    })
    app.component('counter', {
        template: `
        <div>Counter</div>
        <div v-bind="$attrs">Counter</div>
        <div>Counter</div>
        `
    })

    app.mount('#root')
```

通过绑定$attrs, 将父组件传递过来的所有Non-props属性接收到指定节点。


如果父组件传递了多个Non-props，想在子组件中接收特定的Non-props，可以通过v-bind:xxx="$attrs.xxx",就像这样：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" style='color:red' />
            </div>
        `
    })
    app.component('counter', {
        template: `
        <div v-bind:msg="$attrs.msg">Counter</div>
        <div v-bind="$attrs">Counter</div>
        <div>Counter</div>
        `
    })
    app.mount('#root')

```

为什么用v-bind, 因为$attrs.xxx是js表达式，而不是一个字符串。

除了以上的在template标签中v-bind接收$attrs外，还可以在生命周期中使用：
``` js
    const app = Vue.createApp({
        template: `
            <div>
                <counter msg="Hello" style='color:red' />
            </div>
        `
    })
    app.component('counter', {
        beforeMount() {
            console.log(this.$attrs)
        },
        mounted() {
            console.log(this.$attrs)
        },
        template: `
        <div v-bind:msg="$attrs.msg">Counter</div>
        <div v-bind="$attrs">Counter</div>
        <div>Counter</div>
        `
    })

    app.mount('#root')
```


## 父子组件通过事件通信
### 怎么用
已知，父组件向子组件中传递参数，父组件在使用子组件时通过属性向子组件传递数据，子组件通过props接收。
如果我们想要在子组件中，监听点击事件来改变父组件的数据，应该怎么做呢？

我们可以在父组件使用子组件时绑定一个自定义事件add-one,
在子组件中使用this.$emit(event, param1, param2), 传入事件名称来触发一个事件：
``` js
const app = Vue.createApp({
  data() {
    return {
      count: 1
    }
  },
  methods: {
    handleAddOne() {
      this.count += 1;
    }
  },
  template: `
    <div>
      <counter :count="count" @add-one="handleAddOne" />
    </div>
  `
})

app.component('counter', {
  props: ['count'],
  methods: {
    handleItemClick() {
      this.$emit('addOne');
    }
  },
  template: `
    <div @click="handleItemClick">Counter {{count}}</div>
  `
})

app.mount('#root')
```

### 使用事件抛出一个值
有的时候用一个事件来抛出一个特定的值是非常有用的。例如我们可能想让 counter组件决定它每次要加多少。这时可以使用 $emit 的第二个参数来提供这个值：
``` js
    const app = Vue.createApp({
        data() {
            return {
                count: 1
            }
        },
        methods: {
            handleAdd(param1, param2) {
                this.count += param2;
            }
        },
        template: `
            <div>
                <counter :count="count" @add="handleAdd"/>
            </div>
        `
    })

    app.component('counter', {
        props: ['count'],
        methods: {
            handleItemClick() {
                this.$emit('add', 2, 3);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{count}}</div>
        `
    })

    app.mount('#root')
```

我们也可以在子组件中完成对值的修改，将修改后的值传递给父组件：
``` js
  const app = Vue.createApp({
        data() {
            return {
                count: 1
            }
        },
        methods: {
            handleAdd(count) {
                this.count = count;
            }
        },
        template: `
            <div>
                <counter :count="count" @add="handleAdd"/>
            </div>
        `
    })

    app.component('counter', {
        props: ['count'],
        methods: {
            handleItemClick() {
                this.$emit('add', this.count + 2);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{count}}</div>
        `
    })

    app.mount('#root')
```

### emits 声明与校验
可以对$emit中使用的事件进行声明, 如果未经声明就使用，触发该事件时，会报警告：
``` js
app.component('counter', {
    props: ['count'],
    emits: ['counter'],
    methods: {
        handleItemClick() {
            this.$emit('add', this.count + 2);
        }
    },
    template: `
    <div @click="handleItemClick">Counter {{count}}</div>
    `
})
```

上面代码emits中没有声明add, 所以触发时会警告。

除了使用数组的形式，还可以使用对象的形式对emits进行校验：
``` js
app.component('counter', {
    props: ['count'],
    emits: {
        add: (count)=> {//事件参数count为$emit传递过来的第二个参数
            if(count < 0) {
                return true;
            }
            return false;
        }
    },
    methods: {
        handleItemClick() {
            this.$emit('add', this.count + 2);
        }
    },
    template: `
    <div @click="handleItemClick">Counter {{count}}</div>
    `
})
```

### 父子组件使用到双向绑定时
父子组件中使用v-model绑定数据时，使用固定语法，如下：
``` js
   const app = Vue.createApp({
        data() {
            return {
                count: 1
            }
        },
        template: `
            <div>
                <counter 
                v-model="count"
                />
            </div>
        `
    })

    app.component('counter', {
        props: ['modelValue'],
        methods: {
            handleItemClick() {
                this.$emit('update:modelValue', this.modelValue + 2);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{modelValue}}</div>
        `
    })

    app.mount('#root')
```
父组件调用子组件时，通过v-model绑定数据，子组件在props中使用modelValue接收，子组件在通过this.$emit与父组件通信时，第一个参数使用'update:modelValue'。

如果想要使用别名，可以这样修改：
``` js
   const app = Vue.createApp({
        data() {
            return {
                count: 1
            }
        },
        template: `
            <div>
                <counter 
                v-model:app="count"
                />
            </div>
        `
    })

    app.component('counter', {
        props: ['app'],
        methods: {
            handleItemClick() {
                this.$emit('update:app', this.app + 2);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{app}}</div>
        `
    })

    app.mount('#root')
```

#### 使用多个v-model双向绑定
如果需要绑定多个属性，我们可以这样：
``` js
const app = Vue.createApp({
        data() {
            return {
                count: 1,
                count1: 1
            }
        },
        template: `
            <div>
                <counter 
                v-model:count="count" v-model:count1="count1"
                />
            </div>
        `
    })

    app.component('counter', {
        props: ['count', 'count1'],
        methods: {
            handleItemClick() {
                this.$emit('update:count', this.count + 2);
            },
            handleItemClick1() {
                this.$emit('update:count1', this.count1 + 2);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{count}}</div>
        <div @click="handleItemClick1">Counter {{count1}}</div>
        `
    })

    app.mount('#root')
```

#### 自定义v-model修饰符
``` js
const app = Vue.createApp({
        data() {
            return {
                count: 'a',
            }
        },
        template: `
            <div>
                <counter 
                v-model.uppercase="count" 
                />
            </div>
        `
    })

    app.component('counter', {
        props: {
            'modelValue': String,
            'modelModifiers': {
                default: () => ({})
            }
        },
        mounted() {
            console.log(this.modelModifiers)
        },
        methods: {
            handleItemClick() {
                let newValue = this.modelValue + 'b';
                if(this.modelModifiers.uppercase) {
                    newValue = newValue.toUpperCase();
                }
                this.$emit('update:modelValue', newValue);
            }
        },
        template: `
        <div @click="handleItemClick">Counter {{modelValue}}</div>
        `
    })

    app.mount('#root')

```
通过modelModifiers接受v-model修饰符, 通过this.modelModifiers判断修饰符是否存在，来对数据做一些处理。

### 使用插槽和具名插槽解决组件内容传递问题
父组件可以使用slot插槽向子组件传递数据（标签，字符串，子组件），子组件使用slot标签接收。例如：
``` js
const app = Vue.createApp({
        template: `
            <myForm>
                <div>提交</div>
            </myForm>
            <myForm>
                <button>提交</button>
            </myForm>
        `
    })
    app.component('myForm', {
        methods: {
            handleClick() {
                alert(123)
            }
        },
        template: `
            <div>
                <input />
                <span @click="handleClick">
                    <slot></slot>
                </span>
                
            </div>
        `
    })

    app.mount('#root')
```

使用插槽需要注意，无法直接在父组件传递时绑定事件：
``` html
    <myForm>
        <div @click="handleClick">提交</div>
    </myForm>
```
上面代码将会报错。

可以通过在子组件中，包多一层的方式解决插槽绑定事件问题。


#### slot中数据作用域的问题
虽然使用插槽后，父组件中调用的子组件标签内的内容会替换子组件中slot标签中的内容，但是，如果涉及到数据的问题，父模板里调用的数据属性，使用的都是父模板里的数据。
```js
    const app = Vue.createApp({
        data() {
            return {
                text: '提交'
            }
        },
        template: `
            <myForm>
                <div>{{text}}</div>
            </myForm>
            <myForm>
                <button>{{text}}</button>
                <test />
            </myForm>
        `
    })

    app.component('myForm', {
        data() {
            return {
                text: '123'
            }
        },
        methods: {
            handleClick() {
                alert(123)
            }
        },
        template: `
            <div>
                <input />
                <span @click="handleClick">
                    <slot></slot>
                </span>
                
            </div>
        `
    })
    
    app.component('test', {
        template: `<div>test</div>`
    })

    app.mount('#root')
```
最终text渲染结果为‘提交’


#### slot默认值
当slot不传值时，slot默认值会起作用：
``` html
<slot>default Value</slot>
```


#### 具名slot
上面我们都是整块slot一起传递，我们可以通过v-slot为slot命名，然后在子组件中使用拆分使用：
``` js
 const app = Vue.createApp({
        template: `
            <layout>
                <template v-slot:header>
                    <div>header</div>
                </template>
                <template v-slot:footer>
                    <div>footer</div>
                </template>
            </layout>
        `
    })
    app.component('layout', {
        template: `<div>
                <slot name="header"></slot>
                <div>content</div>
                <slot name="footer"></slot>
            </div>`
    })

    app.mount('#root')
```
注意：v-slot不允许直接作用在标签上，只能用在components 或 template标签上。

具名插槽可以使用#来替换v-slot:。
``` js
    const app = Vue.createApp({
        template: `
            <layout>
                <template #header>
                    <div>header</div>
                </template>
                <template #footer>
                    <div>footer</div>
                </template>
            </layout>
        `
    })
```
它们的作用都是相同的。


涉及到dom的传递，使用slot方式会简便许多。

现在，我们可以通过props和slot两种方式实现父组件向子组件传递数据。


### 作用域插槽
``` js
const app = Vue.createApp({
    template: `
        <list />
    `
})

app.component('list', {
    data() {
        return {
            list: [1, 2, 3]
        }
    },
    template: `
        <div v-for="item in list">{{item}}</div>`
})

app.mount('#root')

```
上面代码中，父组件调用子组件list, list循环遍历div标签。
假设现在有这样一个需求，循环子组件list的标签由父组件决定,我们应该怎么做呢？这个时候，我们可以使用作用域插槽：

``` js
const app = Vue.createApp({
    template: `
        <list>
            <span></span>//将span传递给子组件
        </list>
    `
})

app.component('list', {
    data() {
        return {
            list: [1, 2, 3]
        }
    },
    template: `
        <div>
            <slot v-for="item in list" />//通过slot便签获取父组件传递过来的插槽span标签。
        </div>`
})

app.mount('#root')
```
此时页面将会渲染出3个空的span标签，我们如何为循环的span标签填充内容呢？
``` js
//错误
const app = Vue.createApp({
    template: `
        <list>
            <span>{{item}}</span>//此时item会去寻找父组件的状态
        </list>
    `
})
```
``` js
//正确
const app = Vue.createApp({
    template: `
        <list v-slot="slotProps">
            <span>{{slotProps.item}}</span>//使用子组件传递过来的值
        </list>
    `
})
app.component('list', {
    data() {
        return {
            list: [1, 2, 3]
        }
    },
    template: `
        <div>
            <slot v-for="item in list" :item="item" />//通过bind属性的方法，将值传递给span标签。
        </div>`
})

app.mount('#root')
```
尝试将span标签改成别的标签，此时，我们就实现了父组件控制子组件循环的标签。

回顾一下整个流程：
1.父组件调用子组件list
2.父组件调用子组件list时使用slot传递一个标签给子组件list
3.在子组件中循环父组件传递过来的slot(循环的标签由父组件传递的标签决定)
4.在子组件调用slot的时候，将循环的数据项传递给父组件中的slot
5.父组件中在子组件上使用v-slot="slotProps"接受传递过来的数据对象
6.父组件中在子组件的slot上就可以用slotProps值了。

上面的代码中，子组件传递给slot的参数只有item项，所以，可以使用对象结构来简写：
``` js
const app = Vue.createApp({
    template: `
        //对象解构
        <list v-slot="{item}">
            <span>{{item}}</span>
        </list>
    `
})
```

为什么使用作用域插槽？
可以让父组件使用子组件的数据。通过作用域插槽，子组件可以通过slot将数据传递给父组件。
在写项目用的可能不多，但在写vue组件插件的时候，我们会用的比较多。



## 动态组件和异步组件
动态组件：根据数据的变化，结合component这个标签，来随时动态切换组件的显示。
先来看看以下代码：
``` js
const app = Vue.createApp({
    data() {
        return {
            currentItem: 'input-item'
        }
    },
    methods: {
        handleClick() {
            if(this.currentItem === 'input-item') {
                this.currentItem = 'common-item'
            }else {
                this.currentItem = 'input-item'
            }
        }
    },
    template: `
    <input-item v-show="currentItem === 'input-item'" />
    <common-item v-show="currentItem === 'common-item'" />
    <button @click="handleClick">切换</button>
`
})
app.component('input-item', {
    template: `<input />`
})
app.component('common-item', {
    template: `<div>Hello world</div>`
})
app.mount('#root')
```
以上代码，实现了点击按钮切换两个组件的显隐。
使用component标签精简上面代码：
``` js
//动态组件
const app = Vue.createApp({
    data() {
        return {
            currentItem: 'input-item'
        }
    },
    methods: {
        handleClick() {
            if(this.currentItem === 'input-item') {
                this.currentItem = 'common-item'
            }else {
                this.currentItem = 'input-item'
            }
        }
    },
    template: `
    <component :is="currentItem" />
    <button @click="handleClick">切换</button>
`
})
```
component标签渲染组件由currentItem的值决定。
我们在input框中输入点什么，然后点击切换，再切换回来，发现input框中输入的东西没了。
可以使用keep-alive缓存标签对动态组件进行包裹。
``` html
 <keep-alive>
    <component :is="currentItem" />
</keep-alive>
```
再次切换发现，组件的状态都被缓存了下来。

异步组件
异步执行某些组件的逻辑，这叫做异步组件。
``` js
const app = Vue.createApp({
    template: `
    <div>
        <common-item />
        <async-common-item />
    </div>
    `
})
//同步组件
app.component('common-item', {
    template: `<div>Hello world</div>`
})
//异步组件
app.component('async-common-item', Vue.defineAsyncComponent(() => {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            resolve({
                template: `<div>This is an async component</div>`
            })
        }, 4000)
    })
}))
app.mount('#root')
```
异步组件的构建：
通过Vue.defineAsyncComponent(() => {
    return new Promise()
})构建一个异步组件。

异步组件有什么用？
通过异步的方式，动态加载其他组件。好处：将大型项目拆分成多个小的js文件，在需要用到这些js文件的时候，再通过异步的方式去加载这些js文件。



## 基础语法知识点查漏补缺
### v-once
v-once让所在标签只被渲染一次，即便后面数据刷新，也不再渲染。
``` js
const app = Vue.createApp({
    data() {
        return {
            count: 1
        }
    },
    template: `
    <div>
        <div>
            <div @click="count += 1" v-once/>
        </div>
    </div>
    `
})
app.mount('#root')
```
### ref
实际上是获取Dom节点的一种写法,也可以获取组件的引用。
(慎重使用ref)
``` js
const app = Vue.createApp({
    data() {
        return {
            count: 1
        }
    },
    mounted() {
        console.log(this.$refs.common.sayHello())
    },
    template: `
    <div>
        <div>
            <common-item ref="common" />
        </div>
    </div>
    `
})
app.component('common-item', {
    methods: {
        sayHello() {
            alert('Hello')
        }
    },
    template: `<div>Hello world</div>`
})

app.mount('#root')
```

### provide /inject
跨组件之间多级传值。
想象一下我们想要将一个属性传递给孙子、曾孙层级很深的子组件，通过props属性传递的方式，层级太深，非常麻烦，如：
``` js
const app = Vue.createApp({
    data() {
        return {
            count: 100
        }
    },
    template: `
    <div>
        <child :count="count" />
    </div>
    `
})
app.component('child', {
    props: ['count'],
    template: `<child-child :count="count" />`
})
app.component('child-child', {
    props: ['count'],
    template: `<div>{{count}}</div>`
})

app.mount('#root')
```
使用provide / inject :
``` js
const app = Vue.createApp({
    provide: {
        count: 100
    },
    template: `
    <div>
        <child />
    </div>
    `
})
app.component('child', {
    template: `<child-child />`
})
app.component('child-child', {
    inject: ['count']
    template: `<div>{{count}}</div>`
})

app.mount('#root')
```
如果想要传递data中的数据：
``` js
const app = Vue.createApp({
    data() {
        return {
            count: 100
        }
    },
    provide() {
        count: this.count
    },
    template: `
    <div>
        <child />
    </div>
    `
})
app.component('child', {
    template: `<child-child />`
})
app.component('child-child', {
    inject: ['count']
    template: `<div>{{count}}</div>`
})

app.mount('#root')
```
需要注意，provide传递的数据是一次性的，非双向绑定的。即当data状态发生改变时，provide不会再重新获取新的data状态,不会再重新渲染inject。
那么如何实现双向绑定呢？后面再讲





## Vue的生命周期
在vue实例开始创建、运行到销毁的过程，就是vue的生命周期

生命周期函数：在Vue生命周期的某一时刻自动执行的函数。

生命周期钩子 = 生命周期函数 = 生命周期事件。
### vue2版本的生命周期
![image](https://cn.vuejs.org/images/lifecycle.png)

### vue3版本的生命周期
![image](https://v3.vuejs.org/images/lifecycle.svg)

### 1.开始阶段
创建vue实例，并挂载到页面元素中。
``` js
const app = Vue.createApp(options)
app.mount(el)
```
### 第二步
初始化页面中的事件和生命周期函数
``` js
init events & lifecycle
```
完成第二步后自动触发beforeCreate，在实例生成之前执行

### 第三步
初始化数据和模板绑定相关内容
``` js
init injections & reactivity
```
完成第三步后自动触发created，在实例生成之后执行

至此，vue实例创建完成。

### 第四步
判断是否有template选项。
如果有则将该template编译成render函数

如果没有则将app.mount(el)中的el的innerHTML作为template

之后，会触发beforeMount, 在组件渲染到页面之前执行

### 第五步
创建app.$el并且将其添加到el中。
即组件内容渲染到页面。

完成后执行mounted，在组件渲染到页面之后执行

### 第六步
当数据（状态）发生改变,虚拟DOM重新渲染和修补之前(页面重新渲染之前)，执行beforeUpdate

当数据(状态)发生改变，虚拟DOM重新渲染和修补之后(页面重新渲染之后)，执行updated


### 第七步
当app.unmount()被调用

Vue应用失效时，自动执行beforeUnmount
Vue应用失效时，且dom完全销毁之后，执行unmounted

