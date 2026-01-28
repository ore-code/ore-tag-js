# Basic Components

Custom elements in Ore extend from the base class. This gives them access to rendering, state, attributes, and the lifecycle system.

## Rendering

Rendering is handled by the `render()` method. It returns the HTML for the element. Ore calls this method whenever the element needs to update its output.

**JS**

```js

class SayHello extends OreTag {
	render() {
		return `
			<p>Hello World</p>
		`;
	}
}
```

## Registering

Elements become available in the DOM when they are registered. Registration links a tag name to your class so the browser knows how to create and upgrade that element.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello World</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello></say-hello>
``` 

## Diffing

Diffing controls whether Ore replaces all of the output or updates only the parts that changed. It is enabled or disabled by setting a boolean on the component class.  

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello World</p>
		`;
	}
}

OreTag.useDiffing = true;

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello></say-hello>
``` 

## Resyncing

Resyncing forces the element to render again using its current state and attributes. It does not change state; it simply triggers a new render cycle.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello World</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);

document.getElementById("greeting").resync();
```

**HTML**

```html
<say-hello id="greeting"></say-hello>
``` 