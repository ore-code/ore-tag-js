# Ore Tag

*A lightweight framework for creating Web Components with reactive,
attribute-driven rendering.* 

No build tools required. No JSX. Ore Tag runs directly on the metal, using pure browser APIs with zero abstraction tax. Render with plain HTML strings and optionally enable morphdom powered diffing for finer grained updates without giving up simplicity.

**Philosophy**

* Attributes and state are the reactive inputs
* Rendering is explicit and synchronous
* HTML is the template language
* Diffing is optional, not required
* Zero build tools, zero ceremony

## Documentation

* [Tutorial](docs/Tutorial/toc.md)
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