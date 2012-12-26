An AVL tree implementation for Node.js.

```javascript
var tree = require('tree').createTree();

for (var x = 0; x < 1000; x++) {
    
    // insert a new node, using a given key
    tree.insert(x);
    
}

// look-up a node, by key
tree.find(55);

// remove a node, by key
tree.remove(55);
```
