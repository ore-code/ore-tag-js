# Lifecycle Hooks

Lifecycle hooks are special methods you can define inside an Ore component to run logic at specific points in the component’s lifecycle. These hooks are called automatically by the framework during creation, before rendering, or when updates occur. They are useful for setup, validation, cleanup, or controlling how the component behaves during changes.

## mounted()

The `mounted()` method is a lifecycle hook called after the component is inserted into the DOM. Use this hook to perform setup tasks that require the element to be attached to the document, such as adding event listeners, starting timers, or measuring DOM elements.

**JS**

    class HelloWidget extends OreTag {
        mounted() {
            console.log("Component was mounted!");
        }

        render() {
            return `<div>Hello!</div>`;
        }
    }

    OreTag.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget></hello-widget>

## unmounted()

The `unmounted()` method is a lifecycle hook called after the component is inserted into the DOM. Use this hook to perform setup tasks that require the element to be attached to the document, such as adding event listeners, starting timers, or measuring DOM elements.

**JS**

    class HelloWidget extends OreComponent {
        unmounted() {
            console.log("Component was unmounted!");
        }

        render() {
            return `<div>Hello!</div>`;
        }
    }

    OreComponent.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget></hello-widget>

## created()

The `created()` method is called once after the component is constructed and the shadow DOM is attached, but before the first render. It’s a good place to initialize data or manually bind to native events.

**JS**
 
    class HelloWidget extends OreComponent {
        created() {
            console.log("Component was created!");
        }

        render() {
            return `<div>Hello!</div>`;
        }
    }

    OreComponent.register("hello-widget", HelloWidget);

**HTML**

    <my-widget></my-widget>

## canRender()

The `canRender()` method is called right before a component attempts to render. Return `true` to allow the render to proceed, or `false` to skip it entirely. This is useful when you want to delay rendering until a condition is met, such as data being loaded or a setup phase completing.

**JS**
 
    class IsVisible extends OreComponent {
        canRender() {
            return this.attrs.value === "true";
        }

        render() {
            return `
                <div>
                    <slot></slot>
                </div>
            `;
        }
    }

    OreComponent.register("is-visible", IsVisible);

**HTML**

    <is-visible value="false">
        <p>This will not be seen!</p>
    </is-visible>

## canUpdate()

The `canUpdate(attrs, state)` method is called before a component rerenders due to a state or attribute update. Return `true` to allow the update, or `false` to block it. This lets you prevent unnecessary renders or enforce update rules.

**JS**

    class CounterWidget extends OreComponent {
        canUpdate(attrs, state) {
            // Only allow updates if count is not negative
            return state.count >= 0;
        }

        constructor() {
            super();
            this.state = { count: 0 };
        }

        render() {
            return `<div>Count: ${this.state.count}</div>`;
        }
    }

    OreComponent.register("counter-widget", MyCounterWidgetWidget);

**HTML**

    <counter-widget></counter-widget>

## updating()

The updating() method is invoked immediately before a component rerenders due to a state or attribute change. This hook is useful for performing last-minute setup, measurements, or side effects before the DOM is replaced.

**JS**

	class HelloComponent extends OreTag {
		canUpdate(attrs, state) {
			//
			// Prevent the component from updating.
			//
			return false;
		}

		render() {
			return `<p>Hello World</p>`;
		}
	}
	
	OreTag.register("hello-component", HelloComponent);

	document.querySelector("hello-component").updateState();
