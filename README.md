# Ore Tag

A lightweight and powerful framework built on native Web Components with a clear render and update pipeline.

**Features**

* No manditory diffing (per-component or global toggle)
* No abstraction tax
* No build tools
* No JSX
* No ceremony
* No bullshit

## Documentation

* [Tutorial](docs/tutorial/toc.md)
* [API](docs/api/toc.md)

## Example
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

## Contributing

We welcome contributions from the community! To get started, please review our [Contributing Guidelines](https://github.com/ore-code/ore-tag-js/blob/main/CONTRIBUTING.md)