# resync()

Forces the element to re-render using its current state and attributes.

**Syntax**

```js
resync()
```

## Example

**JS**

```js
class OreExample extends OreTag {
    render() {
        return `
            <p>Hello World</p>
        `;
    }
}

OreExample.register("ore-example", OreExample);

OreExample.resync();
```

**HTML**

```html
<ore-example name="World"></ore-example>
```