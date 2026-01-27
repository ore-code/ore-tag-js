# created()

Invoked when the element is constructed and before it is connected to the DOM. 

**Syntax**

```js
created() {}
```

## Example

**JS**

```js
class OreExample extends OreTag {
    created() {
        console.log("The element was created.");
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