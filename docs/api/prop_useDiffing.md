# useDiffing

Enables DOM diffing during rendering when set to true.

**Type**

`boolean`

**Syntax**

```js
static useDiffing
```

## Example

**JS**

```js
class OreExample extends OreTag {
    render() {
        return `
            <p>Diffing is now enabled and handled by morphdom.</p>
        `;
    }
}

OreTag.useDiffing = true;

OreExample.register("ore-example", OreExample);
```

**HTML**

```html
<ore-example></ore-example>
```