An AVL tree implementation for Node.js.

```javascript
var tree = require('tree').createTree();

for (var x = 0; x < 1000; x++) {
    
    tree.insert(x);
    
}

tree.find(55);
tree.remove(55);
```