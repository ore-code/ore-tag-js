# mounted()

Invoked when the element is attached to the DOM.

**Syntax**

```js
mounted() {}
```

## Example

**JS**

```js
class OreExample extends OreTag {
    mounted() {
        console.log("The element was mounted.");
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