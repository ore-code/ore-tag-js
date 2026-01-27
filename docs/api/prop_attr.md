# attr

Represents the element’s current HTML attributes as a key-value object.

**Type**

`Object`

**Syntax**

```js
attrs
```

## Example

**JS**

```js
class OreExample extends OreTag {
    render() {
        return `
            <p>Hello ${this.attrs.name}</p>
        `;
    }
}

OreExample.register("ore-example", OreExample, ["name"]);
```

**HTML**

```html
<ore-example name="World"></ore-example>
```