# Ore.js

No build tools. No JSX. Ore is a component library to build simple, lightweight components that run lightning-fast on the metal, directly in your browser. Effortlessly craft high-performance, elegant web components with zero setup, delivering smooth and seamless experiences that feel instant and intuitive.

## Example

**JS**

    class HelloWidget extends OreComponent {
        render() {
            return `
                <div>
                    Hello, World!
                </div>
            `;
        }
    }
 
    OreComponent.register("hello-widget", HelloWidget);

**HTML**

    <hello-widget></hello-widget>

## Documentation

- [Overview](docs/01-overview.md)
- [Basic Component](docs/02-basic-component.md)
- [Attributes](docs/03-attrs.md)
- [State](docs/04-state.md)
- [Methods](docs/05-methods.md)
- [Methods](docs/06-events.md)
- [Child Elements](docs/07-child-elements.md)
- [Lifecycle Hooks](docs/08-lifecycle-hooks.md)
- [Styling](docs/09-styling.md)
- [Defering](docs/10-defering.md)

## Contributing

We welcome contributions from the community! To get started, please review our [Contributing Guidelines](https://github.com/ore-code/ore-js/blob/main/CONTRIBUTING.md)
