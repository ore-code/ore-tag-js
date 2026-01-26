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

This method is called before a component applies any state or attribute changes. Return `true` to allow the update, or `false` to block it. This lets you prevent unnecessary renders or enforce update rules.

**JS**

	class HelloWidget extends OreTag {
		created() {
			this.state = {
				name: "World"
			}
		}
		canUpdate() {
			return false;
		}
		render() {					 
			return `
				<p>Hello ${this.state.name}</p>
			`;
		}
	}

	OreTag.register("hello-widget", HelloWidget);
	
	document.querySelector("hello-widget").updateState({
		name: "Ore"
	});
	
## beforeUpdate()

This method is called after an update has been approved but before the component rerenders. It is intended for performing any preparations or setup needed prior to rendering, such as cleanup or temporary calculations.

**JS**

	class HelloWidget extends OreTag {
		created() {
			this.state = {
				name: "World"
			}
		}
		beforeUpdate() {
			console.log("Component is updating.");
		}
		render() {					 
			return `
				<p>Hello ${this.state.name}</p>
			`;
		}
	}
	
	OreTag.register("hello-widget", HelloWidget);
	
	document.querySelector("hello-widget").updateState({
		name: "Ore Tag"
	});

## afterUpdate()

This method is called after the component has rerendered and the shadow DOM has been updated. It is intended for post-render tasks, such as querying the DOM, managing focus, or interacting with newly rendered elements.

**JS**

	class HelloWidget extends OreTag {
		created() {
			this.state = {
				name: "World"
			}
		}
		afterUpdate() {
			console.log("Component was updated.");
		}
		render() {					 
			return `
				<p>Hello ${this.state.name}</p>
			`;
		}
	}
	
	OreTag.register("hello-widget", HelloWidget);
	
	document.querySelector("hello-widget").updateState({
		name: "Ore Tag"
	});