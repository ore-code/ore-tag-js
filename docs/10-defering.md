# Defering

The `defer` attribute is a built-in way to delay rendering of a component until after it has been fully initialized. When present on a component, it prevents any content — including slots or children — from being displayed until the first render has completed. This helps avoid flash-of-unstyled-content (FOUC) or placeholder artifacts during load.

Ore components automatically remove the `defer` attribute during the first render.

## Defering Child Elements

**JS**
 
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

**CSS**

    [defer] {
        display: none;
    }

**HTML**

    <my-widget defer>
        <p>This will be hidden until the component renders.</p>
    </my-widget>

## Notes

You do not need to use defer on every component. It is optional and useful primarily when the component requires setup time before showing content, such as loading data or preparing the DOM. The defer attribute works by combining native HTML behavior (attribute presence) with Ore’s rendering flow, making it a lightweight and declarative way to control timing.

