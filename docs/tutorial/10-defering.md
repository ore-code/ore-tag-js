# Defering

The `defer` attribute is a built-in way to delay rendering of a component until after it has been fully initialized. When present on a component, it prevents any content from being displayed until the first render has completed.

**CSS**

```css
[defer] { display: none; }
```

**JS**

```js
class MyWidget extends OreTag {
    render() {
        return `
            <div>
                <slot></slot>
            </div>
        `;
    }
}

OreTag.register("my-widget", MyWidget);
```
 
**HTML**

```html
<say-hello defer>
	<p>Hello World</p>
</say-hello>
```  
