
// node constructor
var Node = module.exports = function (key, parent) {
    
    this.key = key;
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