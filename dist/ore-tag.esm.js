var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // document-fragments dont have attributes so lets not do anything
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    // update attributes on original DOM element
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;

            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;

    if (fromNodeName === toNodeName) {
        return true;
    }

    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);

    // If the target element is a virtual DOM node or SVG node then we may
    // need to normalize the tag name before comparing. Normal HTML elements that are
    // in the "http://www.w3.org/1999/xhtml"
    // are converted to upper case
    if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
        return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
        return toNodeName === fromNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name);
        }
    }
}

var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    // Workaround for MS Edge bug where the 'selected' attribute can only be
                    // removed if set to a non-empty value:
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                // We have to reset select element's selectedIndex to -1, otherwise setting
                // fromEl.selected using the syncBooleanAttrProp below has no effect.
                // The correct selectedIndex will be set in the SELECT special handler below.
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            // We have to loop through children of fromEl, not toEl since nodes can be moved
            // from toEl to fromEl directly when morphing.
            // At the time this special handler is invoked, all children have already been morphed
            // and appended to / removed from fromEl, so using fromEl here is safe and correct.
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while(curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild;
                    // handle empty optgroups
                    if (!curChild) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }

            fromEl.selectedIndex = selectedIndex;
        }
    }
};

var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
  if (node) {
    return (node.getAttribute && node.getAttribute('id')) || node.id;
  }
}

function morphdomFactory(morphAttrs) {

  return function morphdom(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }

    if (typeof toNode === 'string') {
      if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
        var toNodeHtml = toNode;
        toNode = doc.createElement('html');
        toNode.innerHTML = toNodeHtml;
      } else if (fromNode.nodeName === 'BODY') {
        var toNodeBody = toNode;
        toNode = doc.createElement('html');
        toNode.innerHTML = toNodeBody;
        // Extract the body element from the created HTML structure
        var bodyElement = toNode.querySelector('body');
        if (bodyElement) {
          toNode = bodyElement;
        }
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }

    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child){ return parent.appendChild(child); };
    var childrenOnly = options.childrenOnly === true;

    // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
    var fromNodesLookup = Object.create(null);
    var keyedRemovalList = [];

    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }

    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {

          var key = undefined;

          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            // If we are skipping keyed nodes then we add the key
            // to a list so that it can be handled at the very end.
            addKeyedRemoval(key);
          } else {
            // Only report the node as discarded if it is not keyed. We do this because
            // at the end we loop through all keyed elements that were unmatched
            // and then discard them in one final pass.
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }

          curChild = curChild.nextSibling;
        }
      }
    }

    /**
    * Removes a DOM node out of the original DOM
    *
    * @param  {Node} node The node to remove
    * @param  {Node} parentNode The nodes parent
    * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
    * @return {undefined}
    */
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }

      if (parentNode) {
        parentNode.removeChild(node);
      }

      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }

    // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
    // function indexTree(root) {
    //     var treeWalker = document.createTreeWalker(
    //         root,
    //         NodeFilter.SHOW_ELEMENT);
    //
    //     var el;
    //     while((el = treeWalker.nextNode())) {
    //         var key = getNodeKey(el);
    //         if (key) {
    //             fromNodesLookup[key] = el;
    //         }
    //     }
    // }

    // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
    //
    // function indexTree(node) {
    //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
    //     var el;
    //     while((el = nodeIterator.nextNode())) {
    //         var key = getNodeKey(el);
    //         if (key) {
    //             fromNodesLookup[key] = el;
    //         }
    //     }
    // }

    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }

          // Walk recursively
          indexTree(curChild);

          curChild = curChild.nextSibling;
        }
      }
    }

    indexTree(fromNode);

    function handleNodeAdded(el) {
      onNodeAdded(el);

      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;

        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          // if we find a duplicate #id node in cache, replace `el` with cache value
          // and morph it to the child node.
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          // recursively call for curChild and it's children to see if we find something in
          // fromNodesLookup
          handleNodeAdded(curChild);
        }

        curChild = nextSibling;
      }
    }

    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      // We have processed all of the "to nodes". If curFromNodeChild is
      // non-null then we still have some from nodes left over that need
      // to be removed
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
          // Since the node is keyed it might be matched up later so we defer
          // the actual removal to later
          addKeyedRemoval(curFromNodeKey);
        } else {
          // NOTE: we skip nested keyed nodes from being removed since there is
          //       still a chance they will be matched up later
          removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
        }
        curFromNodeChild = fromNextSibling;
      }
    }

    function morphEl(fromEl, toEl, childrenOnly) {
      var toElKey = getNodeKey(toEl);

      if (toElKey) {
        // If an element with an ID is being morphed then it will be in the final
        // DOM so clear it out of the saved elements collection
        delete fromNodesLookup[toElKey];
      }

      if (!childrenOnly) {
        // optional
        var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
        if (beforeUpdateResult === false) {
          return;
        } else if (beforeUpdateResult instanceof HTMLElement) {
          fromEl = beforeUpdateResult;
          // reindex the new fromEl in case it's not in the same
          // tree as the original fromEl
          // (Phoenix LiveView sometimes returns a cloned tree,
          //  but keyed lookups would still point to the original tree)
          indexTree(fromEl);
        }

        // update attributes on original DOM element first
        morphAttrs(fromEl, toEl);
        // optional
        onElUpdated(fromEl);

        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }

      if (fromEl.nodeName !== 'TEXTAREA') {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }

    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;

      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;

      // walk the children
      outer: while (curToNodeChild) {
        toNextSibling = curToNodeChild.nextSibling;
        curToNodeKey = getNodeKey(curToNodeChild);

        // walk the fromNode children all the way through
        while (!skipFrom && curFromNodeChild) {
          fromNextSibling = curFromNodeChild.nextSibling;

          if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }

          curFromNodeKey = getNodeKey(curFromNodeChild);

          var curFromNodeType = curFromNodeChild.nodeType;

          // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
          var isCompatible = undefined;

          if (curFromNodeType === curToNodeChild.nodeType) {
            if (curFromNodeType === ELEMENT_NODE) {
              // Both nodes being compared are Element nodes

              if (curToNodeKey) {
                // The target node has a key so we want to match it up with the correct element
                // in the original DOM tree
                if (curToNodeKey !== curFromNodeKey) {
                  // The current element in the original DOM tree does not have a matching key so
                  // let's check our lookup to see if there is a matching element in the original
                  // DOM tree
                  if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                    if (fromNextSibling === matchingFromEl) {
                      // Special case for single element removals. To avoid removing the original
                      // DOM node out of the tree (since that can break CSS transitions, etc.),
                      // we will instead discard the current node and wait until the next
                      // iteration to properly match up the keyed target element with its matching
                      // element in the original tree
                      isCompatible = false;
                    } else {
                      // We found a matching keyed element somewhere in the original DOM tree.
                      // Let's move the original DOM node into the current position and morph
                      // it.

                      // NOTE: We use insertBefore instead of replaceChild because we want to go through
                      // the `removeNode()` function for the node that is being discarded so that
                      // all lifecycle hooks are correctly invoked
                      fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                      // fromNextSibling = curFromNodeChild.nextSibling;

                      if (curFromNodeKey) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                      } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                      }

                      curFromNodeChild = matchingFromEl;
                      curFromNodeKey = getNodeKey(curFromNodeChild);
                    }
                  } else {
                    // The nodes are not compatible since the "to" node has a key and there
                    // is no matching keyed node in the source tree
                    isCompatible = false;
                  }
                }
              } else if (curFromNodeKey) {
                // The original has a key
                isCompatible = false;
              }

              isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
              if (isCompatible) {
                // We found compatible DOM elements so transform
                // the current "from" node to match the current
                // target DOM node.
                // MORPH
                morphEl(curFromNodeChild, curToNodeChild);
              }

            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
              // Both nodes being compared are Text or Comment nodes
              isCompatible = true;
              // Simply update nodeValue on the original node to
              // change the text value
              if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
              }

            }
          }

          if (isCompatible) {
            // Advance both the "to" child and the "from" child since we found a match
            // Nothing else to do as we already recursively called morphChildren above
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }

          // No compatible match so remove the old node from the DOM and continue trying to find a
          // match in the original DOM. However, we only do this if the from node is not keyed
          // since it is possible that a keyed node might match up with a node somewhere else in the
          // target tree and we don't want to discard it just yet since it still might find a
          // home in the final DOM tree. After everything is done we will remove any keyed nodes
          // that didn't find a home
          if (curFromNodeKey) {
            // Since the node is keyed it might be matched up later so we defer
            // the actual removal to later
            addKeyedRemoval(curFromNodeKey);
          } else {
            // NOTE: we skip nested keyed nodes from being removed since there is
            //       still a chance they will be matched up later
            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
          }

          curFromNodeChild = fromNextSibling;
        } // END: while(curFromNodeChild) {}

        // If we got this far then we did not find a candidate match for
        // our "to node" and we exhausted all of the children "from"
        // nodes. Therefore, we will just append the current "to" node
        // to the end
        if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
          // MORPH
          if(!skipFrom){ addChild(fromEl, matchingFromEl); }
          morphEl(matchingFromEl, curToNodeChild);
        } else {
          var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
          if (onBeforeNodeAddedResult !== false) {
            if (onBeforeNodeAddedResult) {
              curToNodeChild = onBeforeNodeAddedResult;
            }

            if (curToNodeChild.actualize) {
              curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
            }
            addChild(fromEl, curToNodeChild);
            handleNodeAdded(curToNodeChild);
          }
        }

        curToNodeChild = toNextSibling;
        curFromNodeChild = fromNextSibling;
      }

      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    } // END: morphChildren(...)

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
      // Handle the case where we are given two DOM nodes that are not
      // compatible (e.g. <div> --> <span> or <div> --> TEXT)
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          // Going from an element node to a text node
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }

          return morphedNode;
        } else {
          // Text node to something else
          morphedNode = toNode;
        }
      }
    }

    if (morphedNode === toNode) {
      // The "to node" was not compatible with the "from node" so we had to
      // toss out the "from node" and use the "to node"
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }

      morphEl(morphedNode, toNode, childrenOnly);

      // We now need to loop over any keyed nodes that might need to be
      // removed. We only do the removal if we know that the keyed node
      // never found a match. When a keyed node is matched up we remove
      // it out of fromNodesLookup and we use fromNodesLookup to determine
      // if a keyed node has been matched up or not
      if (keyedRemovalList) {
        for (var i=0, len=keyedRemovalList.length; i<len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      // If we had to swap out the from node with a new node because the old
      // node was not compatible with the target node then we need to
      // replace the old DOM node in the original DOM tree. This is only
      // possible if the original DOM node was part of a DOM tree which
      // we know is the case if it has a parent node.
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
  };
}

var morphdom = morphdomFactory(morphAttrs);

/**
 * Convert attribute strings into usable values. It supports
 * booleans, numbers, JSON, and falls back to the raw string
 * when no safe conversion applies.
 *
 * @param {string} value The raw attribute value
 * @return {any} The coerced boolean, number, object, or string
 */
function coerce(value) {
	//
	// Handle blank values.
	//
	if(value === "") {
		return true;
	}

	//
	// Handle false string.
	//
	if(value === "false") {
		return false;
	}
	
	//
	// Handle true string.
	//
	if(value === "true") {
		return true;
	}
	
	//
	// Handle numbers.
	//
	if(isNaN(value) == false && value.trim() !== "") {
		return Number(value);
	}

	//
	// Handle JSON.
	//
    try { return JSON.parse(value); } catch {}

	//
	// Return value.
	//
    return value;
}

/**
 * Used to create custom elements with reactive attributes, lifecycle
 * hooks, and event binding. It uses attributes as the sole source of
 * reactivity as intended. 	
 */
class OreTag extends HTMLElement {
	/**
	 * Represents the element’s current HTML attributes  as a key-value object. 
	 * 
	 * @public
	 * @type {Object}
	 * @default {}
	 */
	attrs = {};

	/**
	 * Represents the element’s internal state as a key-value object.
	 * 
	 * @public
	 * @type {Object}
	 * @default {}
	 */
	state = {};

	/**
	 * Represents the element’s shadow DOM root.
	 * 
	 * @public
	 * @type {ShadowRoot}
	 * @readonly
	 * @default undefined
	 */
	root = undefined;

	/**
	 * Stores the list of attributes the element observes for changes.
	 * 
	 * @private
	 * @static
	 * @type {string[]}
	 */
	static _observed = [];

	/**
	 * Stores the element’s currently bound event listeners for cleanup 
	 * and re-binding. 
	 * 
	 * @private
	 * @type {{el: Element, event: string, bound: Function}[]}
	 */
	#bindings = [];

	/**
	 * Indicates whether the element has completed its initial render.
	 * 
	 * @public
	 * @type {boolean}
	 * @default false
	 */
	hasRendered = false;

	/**
	 * Enables DOM diffing during rendering when set to true. 
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
	 * Registers the custom element with its observed attributes.
	 * 
	 * @public
	 * @param {string} name - The tag name for the element
	 * @param {Function} el - The class extending OreTag
	 * @param {string[]} observed - The attributes to observe
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
	/**
	 * Updates the element’s internal state.
	 * 
	 * @public
	 * @param {Object} values - The new state values
	 */
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
	 * Forces the element to re-render using its current state and attributes.
	 *
	 * @public
	 */
	resync() {
		//
		// Update the attrs object with the latest HTML attributes.
		//
		//this.attrs = toAttrObject(this.attributes);

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
	 * Invoked when the element is constructed and before it is connected 
	 * to the DOM.
	 * 
	 * @public
	 */
	created() {}

	/**
	 * Invoked when the element is attached to the DOM.
	 * 
	 * @public
	 */
	mounted() {}

	/**
	 * Invoked when the element is removed from the DOM.
	 * 
	 * @public
	 */	
	unmounted() {}

	/**
	 * Returns a boolean that determines whether the element should render.
	 * 
	 * @public
	 * @return {boolean} True if rendering should proceed.
	 */
	canRender() { return true; } 

	/**
	 * Returns the element’s HTML as a string.
	 * 
	 * @public
	 * @return {string} The HTML string for the shadow DOM.
	 */
	render() { return ``; }

	/**
	 * Returns a boolean that determines whether the internal state should 
	 * update.
	 * 
	 * @public
	 * @param {Object} newState - The previous state
	 * @return {boolean} True if updating should proceed.	  
	 */
	canUpdateState(newState) { return true;}

	/**
	 * Invoked after the internal state has changed.
	 * 
	 * changed.
	 * @public
	 * @param {Object} prevState - The previous state
	 */
	updatedState(prevState) {}

	/**
	 * Invoked after an observed attribute has changed.
	 * 
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

export { OreTag as default };
