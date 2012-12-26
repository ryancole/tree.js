
var assert = require('assert');

// create a new tree
var tree = require('../src/tree').createTree();

// insert some values
for (var x = 0; x < 1000; x++) {
    
    tree.insert(x);
    
}

assert.equal(tree.count, 1000, 'expected the tree to contain 1000 nodes');
assert.equal(tree.find(64).key, 64, 'expected to get back a node for 64');
