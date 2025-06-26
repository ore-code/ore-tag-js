# Methods

Methods are custom functions defined inside your component class. These functions are part of the component instance and can be called from other methods, from the `render()` function, or externally via JavaScript. Methods are not tied to the DOM itself but are useful for organizing logic, formatting data, or handling reusable behavior inside your component.

## Adding a Method

You can define a method as a class function and call it using `this.methodName()`.

**JS**

    class HelloWidget extends OreComponent {
        greet(name) {
            return `Hello, ${name}`;
        }

        render() {
            return `
                <div>
                    ${this.greet(this.attrs.person)}
                </div>
            `;
        }
    }
    
    OreComponent.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget person="World"></hello-widget>


