# resync()

Returns the element’s HTML as a string.

**Syntax**

```js
render()
```

**Returns**

`string`

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
```

**HTML**

```html
<ore-example name="World"></ore-example>
```