An AVL tree implementation for Node.js.

```javascript
var tree = require('tree').createTree();

for (var x = 0; x < 1000; x++) {
    
    // insert a new node, using a given key and value
    tree.insert(x, { timestamp: new Date });
    
}

// look-up a value, by key
var value = tree.find(55).value;

// remove a node, by key
tree.remove(55);
```
