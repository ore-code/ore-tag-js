## canRender()

Returns a `boolean` that determines whether the element should render.

### Example

**JS**

```js
class SayHello extends OreTag {
	canRender() {	
		return this.attrs.visible;
	}
	render() {
		return `
			<p>Hello World</p>
		`;
	}
}

OreTag.register("say-hello", SayHello, ["visible"]);
```

**HTML**

```html
<say-hello visible="false"></say-hello>
``` 

## canUpdateState()

Returns a `boolean` that determines whether the internal state should update.

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| newState   | object               | The new state                       |

### Example

**JS**

```js
class SayHello extends OreTag {
	created() {
		this.state = {
			name: "world"
		};
	}
	canUpdateState(newState) {
		return false;
	}
	render() {
		return `
			<p>Hello ${this.state.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);

document.getElementById("greeting").setState({
	name: "Ore"
);
```

**HTML**

```html
<say-hello id="greeting"></say-hello>
``` 

## created()

Invoked when the element is constructed and before it is connected to the DOM. 

### Example

**JS**

```js
class SayHello extends OreTag {
	created() {
		console.log("Hello World");
	}
	canUpdateState(newState) {
		return false;
	}
	render() {
		return `
			<p>Check the developer console for a special greeting.</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello id="greeting"></say-hello>
``` 