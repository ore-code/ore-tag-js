/**
 * Internal function that convers an array to an object. Used for attrs.
 * @internal
 * @param {Array} _values - The array to convert.
 */
function _ArrayToObject(_values) {
	return Object.fromEntries(Array.from(_values).map(_item => [_item.name, _item.value]));
}

/**
 * Build a custom web component that has state.
 * @class
 */
export default class OreComponent extends HTMLElement {
    
    /* Public Properties */

        /**
         * The component's state.
         * @public
         * @type {Object} 
         * @default {}
         */
        state = {};

        /**
         * The component's attrs.
         * @type {Object} 
         * @default {}
         */
        attrs = {};

		/**
         * The component's shadow root.
		 * @type {ShadowRoot} 
         * @default undefined
		 */
		root;
    
    /* Constructor */

        /**
         * The component's constructor function.
         * @constructor
         */
        constructor() {
            super();

            //
            // 1. Attach a shadow DOM tree to the component.
            //
            this.root = this.attachShadow({mode: "open"});

            //
            // 2. Set the attributes object.
            //
            this.attrs =  _ArrayToObject(this.attributes);
 
            //
            // 3. Execute the created lifecycle method.
            //
            this.created();

            //
            // 4. Execute an initial render to draw the component.
            //
            this._render();
        }

    /* Class Methods */

        /**
         * Executed when the web component is added to the DOM.
         * @public
         */
        connectedCallback() {
            //
            // 1. Invoke the mounted lifecycle hook.
            //
            this.mounted();
        }

        /**
         * Executed when the web component is removed from the DOM.
         * @public
         */
        disconnectedCallback() {
            //
            // 1. Invoke the unmounted lifecycle hook.
            //
            this.unmounted();
        }

    /* Static Methods */

        /**
         * Register the component with the DOM.
         * @static
         * @param  {string} _name - The tag name.
         * @param  {Object} _element - The component.
         */
        static register(_name, _element) {
            //
            // 1. Register the custom element with the DOM.
            //
            window.customElements.define(_name, _element);
        }
 
    /* Override Methods */

        /**
         * Update an attribute and force a rerender.
         * @public
         * @param {string} _name  - The attribute's name.
         * @param {string} _value - The attribute's value.
         */
        setAttribute(_name, _value) { 
            //
            // We do this incase developers use this method.
            //
            this.updateAttr(_name, _value);
        }

    /* Public Methods */

        /**
         * Update an attribute and force a rerender.
         * @public
         * @param {string} _name  - The attribute's name.
         * @param {string} _value - The attribute's value.
         */
        updateAttr(_name, _value) {
            //
            // 1. Predict what the attribute object will look like.
            //
            const _nextAttrs = { ..._ArrayToObject(this.attributes), [_name]: _value };

            //
            // 2. Check to make sure we are allowed to update.
            //
		    if(this.canUpdate(_nextAttrs, this.state) == true) {
                //
                // A. Set the attribute value.
                //
                super.setAttribute(_name, _value);

                //
                // B. Update the attribute object.
                //
                this.attrs = _nextAttrs;

                //
                // C. Rerender the component.
                //
                this._render();
            }
        }
        
        /**
         * Update the state and force a rerender.
         * @public
         * @param {Object} _values - The new state.
         */
        updateState(_values) {
            //
            // 1. Predict what the state object will look like.
            //
            const _nextState = { ...this.state, ..._values };
            
            //
            // 2. Check to make sure we are allowed to update.
            //
		    if(this.canUpdate(this.attrs, _nextState) == true) {
                //
                // A. Update the state object.
                //
                this.state = _nextState;

                //
                // B. Rerender the component.
                //
                this._render();
            }
        }

    /* Private Methods */

        /**
         * Internal method that handles the rendering.
         * @private
         */
        _render() {
            //
            // 1. Remove the deferred attribute that is used to hide components.
            //
            this.removeAttribute("defer");

            //
            // 2. Convert the attributes argument into a JavaScript object for DX.
            //
            this.attrs = _ArrayToObject(this.attributes);
         
            //
            // 3. Execute the canRender lifecycle hook. Perform a render if the return value is true.
            //
            if(this.canRender() == true) {
                //
                // A. Update the shadow DOM.
                //
                this.shadowRoot.innerHTML = this.render();

                //
                // B. Bind our event handlers.
                //
                this._bind();
            }
        }

        /**
         * Internal method that handles binding events.
         * @private
         */
        _bind() {
            //
            // 1. Define an object with the event names to bind.
            //
            const _events = ["click", "mousedown", "mouseup", "keyup", "keydown", "input", "change", "focus", "blur"];

            //
            // 2. Iterate through each element in the shadow DOM.
            //
            this.root.querySelectorAll("*").forEach(_el => {
                //
                // 3. Iterate through items in the events object.
                //
                _events.forEach(_event => {
                    //
                    // A. Define a constant with the attribute name.
                    //
                    const _attr = `@${_event}`;

                    //
                    // B. Define a callback function for the event.
                    //
                    const _handler = _el.getAttribute(_attr);

                    //
                    // C. Bind the event if the attribute exists.
                    //
                    if (_handler && typeof this[_handler] === "function") {
                        //
                        // - Bind the element so "this" exists.
                        //
                        const _bound = this[_handler].bind(this);  

                        //
                        // - Execute the event handler.
                        //
                        _el.addEventListener(_event, _bound);
                     }
                });
            });
        }

    /* Lifecycle Methods */
 
        /**
         * Invoked when the component is added to the DOM.
         * @public
         */
        mounted() {}

        /**
         * Invoked when the component is removed from the DOM.
         * @public
         */
        dismounted() {}
        
        /**
         * Invoked after the component was created.
         * @public
         */
        created() {}

        /**
         * Invoked when the component is rendering.
         * @public
         * @return {string} The HTML.
         */
        render() { return ""; }

        /**
         * Invoked before the component is rendered.
         * @public
         * @return {boolean} True to allow rendering.
         */
        canRender() { return true; }

        /**
         * Invoked before attr or state is updated.
         * @public
         * @param  {Object} _nextAttrs - The next attributes.
         * @return {Object} _nextState - The next state.
         */
        canUpdate(_nextAttrs, _nextState) { return true; } 
}