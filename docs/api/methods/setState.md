# setState()

Updates the element’s internal state.

**Syntax**

```js
static register(name, el, observed)
```

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| values     | Object               | The new state values                |

## Example

**JS**

```js
class OreExample extends OreTag {
    created() {
		this.state = {
			count: 0
		}
	}
	increment() {
		this.setState({
			count: this.state.count + 1
		});
	}
    render() {
        return `
            <button @click="increment">
                Count: ${this.state.count}
            </button>
        `;
    }
}
 
OreExample.register("ore-example", OreExample);
```

**HTML**

```html
<ore-example id="example"></ore-example>
```
 