An AVL tree implementation for Node.js.

```javascript
var tree = new (require('../src/tree'));
for (var x = 0; x < 1000000; x++) {
    tree.insert(x);
}
tree.find(55);
tree.remove(55);
```