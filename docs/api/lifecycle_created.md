# created()

Invoked when the element is constructed and before it is connected to 
the DOM. Use this hook to define default values or perform setup that 
does not depend on layout or document attachment.

**Syntax**

```js
created() {}
```

## Example

```js
class OreExample extends OreTag {
    created() {
        console.log("The custom element was created.");
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