# Child Elements

Child elements passed into a component are handled using the browser’s native <slot> element. 

## Inserting Child Elements 

Place a `<slot>` in your template where projected children should appear.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<div>
				<slot></slot>
			</div>
		`;
	}
}

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello>
	<p>Hello World</p>
</say-hello>
```  
 