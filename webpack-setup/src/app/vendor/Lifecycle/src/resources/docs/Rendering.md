For respresnting UI as function of state, we are using VDOM as our rendering strategy.

#### Library
https://github.com/Matt-Esch/virtual-dom

#### Description
virtual-dom allows you to update a view whenever state changes by creating a full VTree of the view and then patching the DOM efficiently to look exactly as you 
described it.     
This results in keeping manual DOM manipulation and previous state tracking out of your application code, promoting clean and maintainable rendering logic for 
web applications.    

#### Example

```javascript
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

// 1: Create a function that declares what the DOM should look like
function render(count)  {
    
    let style = {
            textAlign: 'center',
            lineHeight: (100 + count) + 'px',
            border: '1px solid red',
            width: (100 + count) + 'px',
            height: (100 + count) + 'px'
    }

    return <div style={style}></div>
    
}

// 2: Initialise the document
var count = 0;      // We need some app data. Here we just store a count.

var tree = render(count);               // We need an initial tree
var rootNode = createElement(tree);     // Create an initial root DOM node ...
document.body.appendChild(rootNode);    // ... and it should be in the document

// 3: Wire up the update logic
setInterval(function () {
      count++;

      var newTree = render(count);
      var patches = diff(tree, newTree);
      rootNode = patch(rootNode, patches);
      tree = newTree;
}, 1000);
```
