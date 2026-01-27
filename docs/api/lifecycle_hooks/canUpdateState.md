# canUpdateState()

Returns a boolean that determines whether the internal state should update.

**Syntax**

```js
canUpdateState()
```

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| newState   | object               | The new state                       |

**Returns**

`boolean`

## Example

**JS**

```js
class OreExample extends OreTag {
	created() {
		this.state = {
			name: "World"
		}
	}

    canUpdateState(newState) {
        return false;
    }

    render() {
        return `
			<p>Hello ${this.state.name}</p>
        `;
    }
}

OreExample.register("ore-example", OreExample);

document.getElementById("example").setState("name", "Ore");
```

**HTML**

```html
<ore-example></ore-example>
```
