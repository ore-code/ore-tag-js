# What Is Ore?

Ore is a lightweight framework designed for building custom web components that manage their own state and rendering. Unlike many modern frameworks, Ore runs directly on the web platform without requiring any build tools or transpilation. This means you can write components in plain JavaScript and deploy them immediately in any modern browser. Ore leverages native browser APIs, providing a clean and efficient approach to creating reusable UI elements.

## How it Compares to React

**No Tooling Required**

Unlike React, which generally requires a build process (using Babel, Webpack, or similar tools) to transpile JSX and modern JavaScript syntax into browser-compatible code, Ore works natively without any preprocessing. This eliminates the need for configuring complex toolchains and speeds up the development workflow. Developers can write Ore components in plain JavaScript, drop them into their projects, and run them immediately in any browser that supports Web Components — no compilation step necessary.

**No JSX**

While React uses JSX — a syntax extension that resembles HTML but requires transpilation — Ore uses JavaScript’s built-in template literals for templating. Template literals allow embedding expressions inside backticks () using ${}` syntax. This keeps the component code straightforward and readable without any extra tooling. Dynamic content can be interpolated directly in the template string, making it easy to create reactive, data-driven views using standard JavaScript features. This simplicity is especially valuable for quick prototyping and projects aiming to minimize dependencies.

**Runs on the Metal**

Ore components are native custom elements implemented using the browser’s Web Components standards. This means they operate “on the metal,” directly interfacing with the browser’s DOM APIs without additional layers such as a virtual DOM diffing engine. Because of this, Ore components often have lower runtime overhead and better performance in many cases. Instead of reconciling a virtual DOM tree, Ore updates the shadow DOM directly during rendering, leading to predictable and efficient updates.
 