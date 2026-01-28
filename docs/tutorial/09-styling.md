# Styling

Ore components use shadow DOM, which scopes styles to the element. Rules written inside a component apply only to that component and do not affect the rest of the page.

## Using Style Tag

Use a `<style>` tag inside `render()` to include CSS directly in the component.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<style>
				p { margin-bottom: 1.5rem; }
			</style>
			
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

## Using Link Tag

Use a `<link>` tag inside `render()` to load an external stylesheet for the component.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<link rel="stylesheet" href="stylesheet.css">

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

## Notes

Child components are styled through `:host` because each one has its own shadow DOM. Standard selectors do not cross that boundary.

    my-child {
        /* This will not work */
    }

    :host(my-child) {
        /* This is correct */
    }
