# attr

Indicates whether the element has completed its initial render.

**Type**

`boolean`

**Syntax**

```js
hasRendered
```

## Example

**JS**

```js
class OreExample extends OreTag {
	created() {
		console.log(this.hasRendered);
	}
    render() {
        return `
			<p>Check the developer console for output.</p>
		`; 
    }
}

OreExample.register("ore-example", OreExample);
```

**HTML**

```html
<ore-example></ore-example>
```