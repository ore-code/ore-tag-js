# updatedAttrs()

Invoked after an observed attribute has changed.

**Syntax**

```js
updatedAttrs() {}
```

**Parameters**

| Name       | Type                 | Description                         |
| ---------- | -------------------- | ----------------------------------- |
| prevAttrs  | object               | The previous attributes             |

## Example

**JS**

```js
class OreExample extends OreTag {
    updatedAttrs(prevAttrs) {
        console.log("The old name was: " + prevAttrs.name);
    }

    render() {
        return `
			<p>Check the developer console for output.</p>
        `;
    }
}

OreExample.register("ore-example", OreExample, ["name"]);


document.getElementById("example").setAttribute("name", "Ore");
```

**HTML**

```html
<ore-example name="World"></ore-example>
```