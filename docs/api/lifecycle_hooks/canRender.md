# canRender()

Returns a boolean that determines whether the element should render.

**Syntax**

```js
mounted() {}
```

**Returns**

`boolean`

## Example

**JS**

```js
class OreExample extends OreTag {
    canRender() {
        return false;
    }
    render() {
        return `
			<p>This element will never be rendered.</p>
        `;
    }
}

OreExample.register("ore-example", OreExample);
```

**HTML**

```html
<ore-example></ore-example>
```