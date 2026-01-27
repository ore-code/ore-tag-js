# unmounted()

Invoked when the element is removed from the DOM.

**Syntax**

```js
unmounted() {}
```

## Example

**JS**

```js
class OreExample extends OreTag {
    unmounted() {
        console.log("The element was unmounted.");
    }

    render() {
        return `
			<p>Check the developer console for output.</p>
        `;
    }
}

OreExample.register("ore-example", OreExample;

document.getElementById("example").remove();
```

**HTML**

```html
<ore-example id="example"></ore-example>
```