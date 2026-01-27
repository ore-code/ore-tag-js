# Attributes

Attributes are values placed on the element in the DOM. They are normal HTML attributes, and OreTag keeps a live `attrs` object that always matches them, so your component can read the current values at any time.
 
```JS
this.attrs
```

## Unobserved Attributes

Unobserved attributes do not trigger updates when they change. They are useful for values you want to read but do not need to react to. Since they are not reactive, you do not include them in the observed array.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello ${this.attrs.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello);
```

**HTML**

```html
<say-hello name="world"></say-hello>
```

## Observed Attributes

Observed attributes are the ones your component reacts to. When any of these attributes change in the DOM, the component runs its update cycle and draws itself again. To make an attribute reactive, include its name in the array you pass to the register function.

**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello ${this.attrs.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello, ["name"]);
```

**HTML**

```html
<say-hello name="world"></say-hello>
``` 

## Changing Attributes

You can change attributes with standard DOM methods. When you update an attribute on the element, the new value appears in the attrs object, and the component will react to it if the attribute is observed.


**JS**

```js
class SayHello extends OreTag {
	render() {
		return `
			<p>Hello ${this.attrs.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello, ["name"]);

document.getElementById("greeting").setAttribute("name", "Ore");
```

**HTML**

```html
<say-hello id="greeting" name="world"></say-hello>
``` 

## The updatedAttrs Hook

The `updatedAttrs` hook runs whenever an observed attribute changes. It gives your component a chance to compare the previous values with the new ones before the component draws itself again. This is useful for work that depends on attribute changes, such as loading data, updating state, or running side effects.

**JS**

```js
class SayHello extends OreTag {
	updatedAttrs(prevAttrs) {
		console.log("Previous:", prevAttrs.name);
	}
	render() {
		return `
			<p>Hello ${this.attrs.name}</p>
		`;
	}
}

OreTag.register("say-hello", SayHello, ["name"]);

document.getElementById("greeting").setAttribute("name", "Ore");
```

**HTML**

```html
<say-hello name="world"></say-hello>
``` 