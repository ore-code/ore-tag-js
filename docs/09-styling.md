# Styling

Ore components are styled using standard CSS, written directly inside the `render()` method using a `<style>` tag. Because each component uses shadow DOM, styles are scoped automatically and won't affect the rest of the page. You can also include external stylesheets using a `<link>` tag if you prefer to keep styles separate.

## Styling a Component
  
**JS**
 
    class HelloWidget extends OreTag {
        render() {
            return `
                <style>
                    div {
                        margin-bottom: 1.5rem;
                        padding: 1.5rem;
                        color: #fff;
                        background-color: #222;
                    }
                </style>
                <div>
                    Hello, styled component!
                </div>
            `;
        }
    }

    OreTag.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget></hello-widget>

## Notes

When styling child components from within another component, you must use the :host selector. This is because the child component is encapsulated in its own shadow DOM, and standard selectors won't cross shadow boundaries. For example:  

    my-child {
        /* This will not work */
    }

    :host(my-child) {
        /* This is correct */
    }
