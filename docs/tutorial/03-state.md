# State

State is the internal data your component manages for itself. It does not come from attributes, and it is not controlled by the outside world. OreTag keeps a live `state` object that stores values that change as the component runs.

```JS
this.state
```

## Default State

You can define default state values in the `created` hook. This hook runs when the component is constructed, so it is the right place to set up the initial state object.

**JS**

```js
class SayHello extends OreTag {
	created() {
		this.state = {
			name: "world"
		};
	}
	render() {
		return `
			<p>Hello ${this.state.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello></say-hello>
``` 

## Changing State

You change state with the `setState` method. It takes an object of new values and merges them into the current state. When the state changes, the component runs its update cycle and draws itself again.

**JS**

```js
class SayHello extends OreTag {
	created() {
		this.state = {
			name: "world"
		};
	}
	render() {
		return `
			<p>Hello ${this.state.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);

document.getElementById("greeting").setState({
	name: "Ore"
);
```

**HTML**

```html
<say-hello id="greeting"></say-hello>
``` 

## The updatedState Hook

The `updatedState` hook runs whenever the component’s state changes. It receives the previous state values, giving your component a chance to compare them with the new ones before the component draws itself again. This is useful for work that depends on state changes, such as loading data, syncing with attributes, or running side effects.

**JS**

```js
class SayHello extends OreTag {
	created() {
		this.state = {
			name: "world"
		};
	}
	updatedState(prevState) {
		console.log("Previous:", prevState.name);
	}
	render() {
		return `
			<p>Hello ${this.state.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);

document.getElementById("greeting").setState({
	name: "Ore"
);
```

**HTML**

```html
<say-hello id="greeting"></say-hello>
``` 