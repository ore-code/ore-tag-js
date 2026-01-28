# What Is Ore Tag?

Ore Tag is a lightweight framework for building custom web components that manage their own state and rendering. It runs directly on the web platform with no build tools or transpilation, so components can be written in plain JavaScript and used immediately in any modern browser.

## How it Compares to React

**No Tooling Required**

React typically relies on a build step to handle JSX and modern syntax. Ore Tag does not. Components run natively without preprocessing or configuration.

**No JSX**

React uses JSX, which requires compilation. Ore uses standard JavaScript template literals, keeping templating simple and dependency‑free.

**Optional Diffing**

React always uses a virtual DOM. Ore Tag does not. Components can render by replacing output directly or, when needed, enable diffing to update only what changed. Diffing is optional and controlled by the component.
