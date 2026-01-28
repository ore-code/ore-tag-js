# Methods

Methods are functions on your component class. They run on the component instance and can be used for any internal logic.

**JS**

```js
class SayHello extends OreTag {
    greet() {
        console.log("Hello World");
    }

    render() {
        return `
            <button @click="greet">Say Hello</button>
        `;
    }
}

OreTag.register("say-hello", SayHello);
 
**HTML**

```html
<say-hello></say-hello>
``` 
