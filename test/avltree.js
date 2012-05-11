
// import tree module
var Tree = require('../src/tree');

// init tree
var t = new Tree;

// insert random data
for (var x = 0; x < 1000000; x++) {
    
    t.insert(x);
    
}

// perform a search
console.log(t.find(55));