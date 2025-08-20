# A Basic Component

Every Ore component must define a `render()` method. This method returns an HTML string that describes the component’s UI. The returned HTML is automatically injected into the component’s shadow DOM and rerendered whenever state or attributes change. The `render()` method is the foundation of every Ore component.

## Rendering a Component

You define the UI by returning a string of HTML from `render()`.

**JS**
 
    class HelloWidget extends OreTag {
        render() {
            return `
                <div>
                    Hello, World!
                </div>
            `;
        }
    }

    //
    // You must register the component with the DOM.
    //
    OreTag.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget></hello-widget>
