
// module exports
exports.Node = Node;
exports.createNode = function createNode (key, value, parent) { return new Node(key, value, parent); };

// node constructor
function Node (key, value, parent) {
    
    this.key = key;
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
    this.parent = parent ? parent : null;
    
};

// getters
Node.prototype = {
    
    get is_right_child() {
        
        return !!this.parent && this.parent.right == this;
        
    },
    
    get is_left_child() {
        
        return !!this.parent && this.parent.left == this;
        
    }
    
};
