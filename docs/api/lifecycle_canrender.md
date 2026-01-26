# canRender()

Invoked during each render cycle to determine whether the element should update its shadow DOM. Return true to allow rendering or false to skip it. Use this hook to prevent unnecessary renders or to delay rendering until certain conditions are met.

**Syntax**

```js
canRender() {
    return true;
}
```
## Example

```js
class OreExample extends OreTag {
    canRender() {
        return false;
    }

    render() {
        return `
            <p>This component will not be rendered.</p>
        `;
    }
}

OreExample.register("ore-example", OreExample, []);
```

```html
<ore-example></ore-example>
```


