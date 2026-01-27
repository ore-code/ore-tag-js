# register()

 Registers the custom element and its observed attributes.

**Syntax**

```js
static register(name, el, observed)
```

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| name       | string               | The tag name for the element        |
| el         | Function             | The class extending OreTag          |
| observed   | string[]             | The attributes to observe           |

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