# Events

Ore supports declarative event binding through attribute-based syntax using `@eventName`. This allows you to connect DOM events like `click`, `input`, or `keyup` to methods defined on your component. Event handlers are automatically bound to the component instance (`this`), so you can access state, attributes, or other methods inside your handler without additional setup.

## Binding an Event

You can bind an event by adding an attribute like `@click="methodName"` directly to an element.
 
**JS**
    
    class MyWidget extends OreComponent {
        render() {
            return `
                <div>
                    <button @click="sayHello">Click Me</button>
                </div>
            `;
        }

        sayHello() {
            console.log("Hello from MyWidget!");
        }
    }

    OreComponent.register("my-widget", MyWidget);

**HTML**

    <my-widget></my-widget>
