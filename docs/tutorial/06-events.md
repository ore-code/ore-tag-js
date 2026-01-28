# Events

Ore lets you connect DOM events in your template to methods on your component. When one of these events fires on an element, Ore calls the matching method on the component instance. 

**Bindable Events**

* click
* mousedown
* mouseup
* keyup
* keydown
* input
* change
* focus
* blur

## Binding to an Event

Use `@eventName="methodName"` on an element inside `render`. The name after `@` is the event to listen for, and the string after `=` must match a method on your component. When that event occurs, Ore calls the method with `this` set to the component.

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
