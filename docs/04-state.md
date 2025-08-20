# State

State is internal data used by a component to track values that change over time. It exists only in JavaScript and is not visible in the DOM. Unlike attributes, state is not set through HTML and is meant to control logic or UI that doesn't need to be exposed externally. Each component has its own `state` object, which is initialized empty and can be updated internally as needed.


## Reading State

You can read the current state using `this.state`.

**JS**

    class CounterWidget extends OreTag {
        constructor() {
            super();
            this.state = { count: 0 };
        }

        render() {
            return `
                <div>
                    Clicked count: <strong>${this.state.count}</strong>
                </div>
            `;
        }
    }

    OreTag.register("counter-widget", CounterWidget);

**HTML**

    <counter-widget></counter-widget>

## Updating State

You can update the component’s state using this.updateState({ key: value }).

**JS**

    document.querySelector("counter-widget").updateState({ count: 5 });