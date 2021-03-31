## computed和watch两者的异同。
如果一个功能，能用computed或watch方式实现，computed实现会更简洁。
watch是computed的低层实现。
如果需要使用异步，使用watch。


## computed和methods两者的异同。
如果一个功能，能用computed或methods方式实现，优先使用computed。因为computed会有一个缓存，所以会使页面更高效。
computed：当计算属性依赖的内容发生变更时，才会重新执行计算。
methods：只要页面重新渲染，才会重新计算。
当使用computed和methods都能实现页面效果时，优先使用computed属性。