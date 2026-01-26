# mounted()

Invoked when the element is connected to the DOM. Use this hook for setup 
that requires the element to be in the document, such as measuring layout, 
starting timers, or interacting with external DOM nodes.

**Syntax**

```js
mounted() {}
```

## Example

```js
class OreExample extends OreTag {
    mounted() {
        console.log("The custom element was mounted.");
    }

    render() {
        return `
            <p>Click the console messages for more details.</p>
        `;
    }
}

OreExample.register("ore-example", OreExample, []);
```

```html
<ore-example></ore-example>
```