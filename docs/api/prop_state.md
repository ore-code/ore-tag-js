# state

Represents the element’s current internal state as a key-value object.

**Type**

`Object`

**Syntax**

```js
state
```

## Example

**JS**

```js
class OreExample extends OreTag {
	created() {
		this.state = {
			name: "World"
		}
	}
    render() {
        return `
            <p>Hello ${this.state.name}</p>
        `;
    }
}

OreExample.register("ore-example", OreExample);
```

**HTML**

```html
<ore-example></ore-example>
```