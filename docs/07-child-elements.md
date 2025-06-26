# Child Elements

Child elements passed into a component are handled using native HTML `<slot>` tags. A `<slot>` acts as a placeholder where content from the component’s HTML usage is inserted into the shadow DOM. Ore does not modify this behavior — it uses the browser’s built-in slotting system to support projected children. This allows you to pass custom content 


 ## Inserting Child Elements

**JS**

    class HelloWidget extends OreComponent {
        render() {
            return `
                <div>
                    <slot></slot>
                </div>
            `;
        }
    }

    OreComponent.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget>
        <p>Hello World</p>
    </hello-widget>
