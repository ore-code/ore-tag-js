# updatedState()

Invoked after the internal state has changed.

**Syntax**

```js
updatedState() {}
```

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| prevState  | object               | The previous state                  |

## Example

**JS**

```js
class OreExample extends OreTag {
	created() {
		this.state = {
			name: "World"
		}
	}

    updatedState(prevState) {
        console.log("The old name was: " + prevState.name);
    }

    render() {
        return `
			<p>Check the developer console for output.</p>
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