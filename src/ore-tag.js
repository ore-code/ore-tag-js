import morphdom from 'morphdom';
import coerce from './utils/coerce.js';

/**
 * Used to create custom elements with reactive attributes, lifecycle
 * hooks, and event binding. It uses attributes as the sole source of
 * reactivity as intended. 	
 */
export default class OreTag extends HTMLElement {
	/**
	 * Return the custom element's attributes in a key-value object. 
	 * The object is updated automatically during the render pipeline
	 * and should be treated as readonly.
	 * 
	 * @public
	 * @type {Object.<string, string|boolean>}
	 * @default {}
	 */
	attrs = {};

	/**
	 * Return the custom element's internal state in a key-value object. 
	 * The object is updated using the setState method.
	 * 
	 * @public
	 * @type {Object.<string, any>}
	 * @default {}
	 */
	state = {};

	/**
	 * Return the custom element's shadow DOM root. It is exposed for
	 * internal rendering and event binding, and should be treated as
	 * readonly.
	 * 
	 * @public
	 * @type {ShadowRoot}
	 * @default undefined
	 */
	root = undefined;

	/**
	 * Return a list of attributes observed by the custom element.
	 * Set by the register() method and read by observedAttributes.
	 * 
	 * @private
	 * @static
	 * @type {string[]}
	 */
	static _observed = [];

	/**
	 * Tracks attached listeners so we can remove them before  
	 * rebinding. It also prevents duplicates and leaks in  
	 * morphdom mode.  
	 * 
	 * @private
	 * @type {{el: Element, event: string, bound: Function}[]}
	 */
	#bindings = [];

	/**
	 * Return whether the element has completed its initial render.  
	 * It's set to true at the end of the initial resync() cycle and  
	 * can be used to ignore early updated() calls.
	 * 
	 * @public
	 * @type {boolean}
	 * @default false
	 */
	hasRendered = false;

	/**
	 * Return whether the element will use DOM diffing when rending. 
	 * This is done using morphdom  
	 * 
	 * @public
	 * @static
	 * @type {boolean}
	 * @default false
	 */
	static useDiffing = false;
 
	/**
	 * The constructor initializes the custom element by attaching a
	 * shadow DOM, converting the attributes into a key-value object,
	 * and invoking the created() lifecycle hook.
	 * 
	 * @constructor
	 */
	constructor() {
		super();

		//
		// Attach the shadow DOM to the custom element.
		//
		this.root = this.attachShadow({mode: "open"});

		//
		// Convert HTML attributes into an object.
		//
		this.attrs = toAttrObject(this.attributes);

		//
		// Invoke the created() lifecycle method.
		//
		this.created();
	}

	/**
	 * This lifecycle method is called when the custom element is 
	 * attached to the DOM. It invokes the mounted() lifecycle method
	 * and triggers an internal render.
	 * 
	 * @protected
	 */
	connectedCallback() {
		//
		// Invoke the mounted() lifecycle method.
		//
		this.mounted();

		//
		// Execute the internal render pipeline.
		//
		this.resync();
	}

	/**
	 * This lifecycle method is called when the custom element is 
	 * detached from the DOM. It invokes the unmounted() lifecycle 
	 * method.
	 * 
	 * @protected
	 */
	disconnectedCallback() {
		//
		// Unbind any bound listeners to avoid leaks.
		// 
		this._unbind();

		//
		// Invoke the unmounted lifecycle method().
		//
		this.unmounted();
	}

	/**
	 * This lifecycle member is called when an observed attribute
	 * changes. It triggers an internal render and invokes the
	 * updated() lifecycle method.
	 * 
	 * @protected
	 * @param {string} name - The attribute name that changed
	 * @param {string|null} oldValue - The previous value of the attribute
	 * @param {string|null} newValue - The new value of the attribute
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		//
		// Capture the previous values from the attrs object. This 
		// is passed over to the updatedAttrs lifecycle hook for
		// comparison.
		//
		const prevAttrs = { ...this.attrs };

		//
		// Updates the internal attrs object with the latest HTML 
		// attributes. This ensures that render() and updatedAttr() 
		// see the current values.
		//
		this.attrs[name] = newValue; 

		//
		// Check to make sure that the value has changed from the
		// snapshot.
		//
		if(oldValue != newValue) {			
			//
			// Invoke the updated() lifecycle method.
			//
			this.updatedAttrs(prevAttrs);

			//
			// Execute the internal render pipeline.
			//
			this.resync();
		}
	}
 
	/**
	 * This static method returns a list of attributes the custom 
	 * element observes for changes. The array is configured in the
	 * register() method.
	 * 
	 * @type {string[]}
	 */
	static get observedAttributes() {
		//
		// Return the observed attributes.
		//
		return this._observed || [];
	} 

	/**
	 * Register a custom element and set its observed attributes.
	 * 
	 * @public
	 * @param {string} name - The tag name for the custom element
	 * @param {Function} el - The class extending OreTag
	 * @param {string[]} observed - Array of attributes to observe
	 */
	static register(name, el, observed) {
		//
		// Set the observed attributes.
		//
		el._observed = observed;

		//
		// Register the custom element.
		//
		customElements.define(name, el);
	}

	setState(values) {		
		//
		// Predict what the state will look like.
		//
		const newState = { ...this.state, ...values };

		//
		// Capture the previous state.
		//
		const prevState = { ...this.state };

		//
		// Check to see whether the instance can update.
		//
		if(this.canUpdateState(newState) == true) {
 
			//
			// Replace the internal state object.
			//
			this.state = newState;

			//
			// Invoke the updated() lifecycle method.
			//
			this.updatedState(prevState);

			//
			// Execute the internal render pipeline.
			//
			this.resync();
		}
	}

	/**
	 * Re-renders the element by re-reading all HTML attributes, updating
	 * the shadow DOM, and rebinding events. This method runs the normal
	 * render pipeline and respects canRender(). Safe for users to call
	 * at any time to manually trigger a redraw.
	 *
	 * @public
	 */
	resync() {
		//
		// Update the attrs object with the latest HTML attributes.
		//
		this.attrs = toAttrObject(this.attributes);

		//
		// Only render if canRender() returns true.
		//
		if (this.canRender()) {			
			//
			// Internal-only: hide slotted/child elements until ready.
			// Remove [defer] attribute so children can render safely.
			//
			// Use CSS [defer] { display:none; } to hide until ready.
			//
			super.removeAttribute("defer");
			
			//
			// Update the shadow DOM with the template from render().
			//
			this._reconcile(this.render());
			//this.render();

			//
			// Bind events to elements inside the shadow DOM.
			//
			this._bind();

			//
			// Mark that the element has completed its first render.
			//
			this.hasRendered = true;
		}
	}

	/**
	 * Private method that applies changes to the shadow DOM. If
	 * useDiffing is true, the HTML is diffed using morphdom; 
	 * otherwise the shadow DOM is replaced with `innerHTML`.
	 * 
	 * @private
	 * @param {string} html - The HTML string returned from render.
	 */
	_reconcile(html) {
		//
		// Check to see if we are allowing diffing to occur.
		//
		if(this.constructor.useDiffing === true) {
			//
			//  Create a container element.
			//
			const template = document.createElement("div");

			//
			// Set its innerHTML.
			//
			template.innerHTML = html;

			//
			// Use morphdom to diff.
			// 
			morphdom(this.root, template, { childrenOnly: true });
		}
		else {
			//
			// Instead of diffing, insert the HTML.
			//
			this.root.innerHTML = html;
		}
	}

	_unbind() {
		//
		// Check if we are diffing.
		//
		if(this.constructor.useDiffing)	{
			//
			// Unbind bound listeners.
			//
			for (const { el, event, bound } of this.#bindings) {
				el.removeEventListener(event, bound);
			}
		}
		//
		// Clear the bindings array.
		//
		this.#bindings = [];
	}

	/**
	 * Private method that handles binding DOM events to shadow DOM 
	 * elements. It reads event handlers defined as attributes in the
	 * format @event="handlerName" and binds them to the instance.
	 * 
	 * @private
	 */
	_bind() {
		//
		// Remove bound events and clear the bindings array.
		//
		this._unbind();

		//
		// Define an array of events that can be bound automatically.
		//
		const events = [
			"click", 
			"mousedown", 
			"mouseup", 
			"keyup", 
			"keydown", 
			"input", 
			"change", 
			"focus", 
			"blur"
		];		

		//
		// Iterate through each child element inside the shadow DOM.
		//
		this.root.querySelectorAll("*").forEach(el => {
			//
			// Iterate through each event type and check for a 
			// matching attribute on the element.
			//
			events.forEach(event => {
				//
				// Construct the attribute name for the event.
				//
				const attr = `@${event}`;

				//
				// Get the handler name from the element's attribute.
				//
				const handler = el.getAttribute(attr);

				//
				// If the handler exists and is a function on the instance,
				// bind it to this and add it as an event listener.
				//
				if (handler && typeof this[handler] === "function") {
					//
					// Bind the method so "this" refers to the element instance.
					//
					const bound = this[handler].bind(this);

					//
					// Add the event listener to the element.
					//
					el.addEventListener(event, bound);

					this.#bindings.push({ el, event, bound });
				}
			});
		});		
	}

	/**
	 * This lifecycle method is called when the custom element is first.
	 * constructed. It's used to perform setup that should happen before 
	 * the element is attached to the DOM.
	 * 
	 * @public
	 */
	created() {}

	/**
	 * This lifecycle method is called when the custom element is mounted  
	 * to the DOM. It's used to to perform setup that requires the element  
	 * to be in the document, such as measuring layout or starting timers.
	 * 
	 * @public
	 */
	mounted() {}

	/**
	 * This lifecycle method is called when the custom element is removed  
	 * from the DOM. It's used to cleanup resources, remove event listeners, 
	 * or stop timers that were started in mounted().
	 * 
	 * @public
	 */	
	unmounted() {}

	/**
	 * This lifecycle methods determines if the custom element should be
	 * rendered at this time. It's called before updating the shadow DOM
	 * during the resync(). Return true will allow rendering, or false to
	 * skip it.
	 * 
	 * @public
	 * @return {boolean} True if rendering should proceed.
	 */
	canRender() { return true; } 

	/**
	 * This returns the HTML template for the custom element's shadow DOM.  
	 * It's called during resync() to generate the content. Override this
	 * to define the structure.
	 * 
	 * @public
	 * @return {string} The HTML string for the shadow DOM.
	 */
	render() { return ``; }

	/**
	 * This lifecycle method determines if the internal state can be
	 * updated.
	 * @public
	 * @param {Object} newState - The previous state
	 * @return {boolean} True if updating should proceed.	  
	 */
	canUpdateState(newState) { return true;}

	/**
	 * This lifecycle method is called after the internal state has
	 * changed.
	 * @public
	 * @param {Object} prevState - The previous state
	 */
	updatedState(prevState) {}

	/**
	 * This lifecycle method is called after an observed attribute has
	 * changed.
	 * @public
	 * @param {Object} prevAttribs - The previous attributes
	 */
	updatedAttrs(prevAttribs) {}
}
 
/**
 * Converts an array of HTML attributes into a key-value object.
 * Boolean-style attributes (empty string) are converted to true.
 * The string "false" is converted to false.
 *
 * @internal
 * @param {NamedNodeMap} attrs - The element's attributes collection
 * @returns {Object.<string, string|boolean>}
 */
function toAttrObject(attrs) {
	const obj = {};

	for (const attr of attrs) {
		obj[attr.name] = coerce(attr.value);
	}

	return obj;
}