
// local modules
var Node = require('./tree-node').Node;

// module exports
exports.Tree = Tree;
exports.createTree = function createTree (comparator) { return new Tree(comparator); };

// tree constructor
function Tree (comparator) {
    
    this.count = 0;
    this.root = null;
    this.min_node = null;
    this.max_node = null;
    this.comparator = comparator || generic_comparator;
    
};

// contains
Tree.prototype.find = function (key) {
    
    var result = null;
    
    this.traverse(function (node) {
        
        if (this.comparator(node.key, key) > 0) {
            
            return node.left;
            
        } else if (this.comparator(node.key, key) < 0) {
            
            return node.right;
            
        } else {
            
            result = node;
            
            // returning null stops traversal of tree
            return null;
            
        }
        
    });
    
    return result;
    
};

// remove
Tree.prototype.remove = function (key) {
    
    var result = false;
    
    this.traverse(function (node) {
        
        if (this.comparator(node.key, key) > 0) {
            
            return node.left;
            
        } else if (this.comparator(node.key, key) < 0) {
            
            return node.right;
            
        } else {
            
            result = node.value;
            this.remove_node(node);
            
        }
        
    });
    
    // adjust the total count
    if (result)
        this.count = this.root ? this.count - 1 : 0;
    
    // return value that was removed
    return result;
    
};

// remove node
Tree.prototype.remove_node = function (node) {
    
    if (node.left != null || node.right != null) {
        
        var balance_node = null;
        var replace_node = null;
        
        if (node.left != null) {
            
            replace_node = this.get_max_node(node.left);
            
            if (replace_node != node.left) {
                
                replace_node.parent.right = replace_node.left;
                
                if (replace_node.left)
                    replace_node.left.parent = replace_node.parent;
                
                replace_node.left = node.left;
                replace_node.left.parent = replace_node;
                
                balance_node = replace_node.parent;
                
            }
            
            replace_node.parent = node.parent;
            replace_node.right = node.right;
            
            if (replace_node.right)
                replace_node.right.parent = replace_node;
            
            if (node == this.max_node)
                this.max_node = replace_node;
            
            // reduce count
            this.count--;
            
        } else {
            
            replace_node = this.get_min_node(node.right);
            
            if (replace_node != node.right) {
                
                replace_node.parent.left = replace_node.right;
                
                if (replace_node.right)
                    replace_node.right.parent = replace_node.parent;
                
                replace_node.right = node.right;
                replace_node.right.parent = replace_node;
                
                balance_node = replace_node.parent;
                
            }
            
            replace_node.parent = node.parent;
            replace_node.left = node.left;
            
            if (replace_node.left)
                replace_node.left.parent = replace_node;
            
            if (node == this.min_node)
                this.min_node = replace_node;
            
            // reduce count
            this.count--;
            
        }
        
        // update parent of node being removed
        if (node.is_left_child)
            node.parent.left = replace_node;
            
        else if (node.is_right_child)
            node.parent.right = replace_node;
            
        else
            this.root = replace_node;
        
        // balance the tree
        this.balance(balance_node ? balance_node : replace_node);
        
    } else {
        
        // if node is leaf, remove it and balance from its parent
        if (node.is_left_child) {
            
            node.parent.left = null;
            this.count--;
            
            if (node == this.min_node)
                this.min_node = node.parent;
            
            this.balance(node.parent);
            
        } else if (node.is_right_child) {
            
            node.parent.right = null;
            this.count--;
            
            if (node == this.max_node)
                this.max_node = node.parent;
            
            this.balance(node.parent);
            
        } else {
            
            this.clear();
            
        }
        
    }
    
};

// clear
Tree.prototype.clear = function () {
    
    this.root = null;
    this.min_node = null;
    this.max_node = null;
    this.count = 0;
    
};

// add
Tree.prototype.insert = function (key, value) {
    
    if (this.root == null) {
        
        // if tree is empty, create new root node
        this.root = new Node(key, value);
        this.min_node = this.root;
        this.max_node = this.root;
        this.count++;
        return true;
        
    }
    
    // return value
    var result = false;
    
    // traverse the tree and insert new node
    this.traverse(function (node) {
        
        var return_node = null;
        
        // determine which direction to continue down
        if (this.comparator(node.key, key) > 0) {
            
            // traverse down left
            return_node = node.left;
            
            if (node.left == null) {
                
                // create the new node as a child of this node
                var new_node = new Node(key, value, node);
                
                // pin new node to parent node
                node.left = new_node;
                
                // adjust min node if needed
                if (node == this.min_node)
                    this.min_node = new_node;
                
                // a node was added
                result = true;
                
                // balance the tree
                this.balance(node);
                
            }
            
        } else if (this.comparator(node.key, key) < 0) {
            
            // traverse down right
            return_node = node.right;
            
            if (node.right == null) {
                
                // create the new node as a child of this node
                var new_node = new Node(key, value, node);
                
                // pin new node to parent node
                node.right = new_node;
                
                // adjust max node if needed
                if (node == this.max_node)
                    this.max_node = new_node;
                
                // a node was added
                result = true;
                
                // balance the tree
                this.balance(node);
                
            }
            
        }
        
        // if this is null, we stop traversing
        return return_node;
        
    });
    
    // if a node was added, increment count
    if (result == true)
        this.count++;
    
    return result;
    
};

// traverse
Tree.prototype.traverse = function (callback, start, end) {
    
    var node = start ? start : this.root;
    var end_node = end ? end : null;
    
    while (node && node != end_node)
        node = callback.call(this, node);
    
};

//balance
Tree.prototype.balance = function (node) {
    
    this.traverse(function (node) {
       
       // calculate the left and right node heights
        var left_height = node.left ? node.left.height : 0;
        var right_height = node.right ? node.right.height : 0;
       
        if (left_height - right_height > 1) {
           
            if (node.left.right && (!node.left.left || node.left.left.height < node.left.right.height))
                this.left_rotate(node.left);
            
            this.right_rotate(node);
           
        } else if (right_height - left_height > 1) {
            
            if (node.right.left && (!node.right.right || node.right.right.height < node.right.left.height))
                this.right_rotate(node.right);
            
            this.left_rotate(node);
            
        }
        
        // recalculate the left and right node heights
        left_height = node.left ? node.left.height : 0;
        right_height = node.right ? node.right.height : 0;
        
        // set this node's height
        node.height = Math.max(left_height, right_height) + 1;
        
        // traverse up tree and balance parent
        return node.parent;
       
    }, node);
    
};

// left rotate
Tree.prototype.left_rotate = function (node) {
    
    if (node.is_left_child) {
        
        node.parent.left = node.right;
        node.right.parent = node.parent;
        
    } else if (node.is_right_child) {
        
        node.parent.right = node.right;
        node.right.parent = node.parent;
        
    } else {
        
        this.root = node.right;
        this.root.parent = null;
        
    }
    
    var right = node.right;
    node.right = node.right.left;
    
    if (node.right != null)
        node.right.parent = node;
    
    right.left = node;
    node.parent = right;
    
};

// right rotate
Tree.prototype.right_rotate = function (node) {
    
    if (node.is_left_child) {
        
        node.parent.left = node.left;
        node.left.parent = node.parent;
        
    } else if (node.is_right_child) {
        
        node.parent.right = node.left;
        node.left.parent = node.parent;
        
    } else {
        
        this.root = node.left;
        this.root.parent = null;
        
    }
    
    var left = node.left;
    node.left = node.left.right;
    
    if (node.left != null)
        node.left.parent = node;
    
    left.right = node;
    node.parent = left;
    
};

// get min node
Tree.prototype.get_min_node = function (node) {
    
    if (!node)
        return this.min_node;
    
    var min_node = node;
    
    this.traverse(function (node) {
        
        var result = null;
        
        if (node.left) {
            
            min_node = node.left;
            result = node.left;
            
        }
        
        // null stops the traversal
        return result;
        
    }, node);
    
    return min_node;
    
};

// get max node
Tree.prototype.get_max_node = function (node) {
    
    if (!node)
        return this.max_node;
    
    var max_node = node;
    
    this.traverse(function (node) {
        
        var result = null;
        
        if (node.right) {
            
            max_node = node.right;
            result = node.right;
            
        }
        
        // null stops the traversal
        return result;
        
    }, node);
    
    return max_node;
    
};

// generic comparator
function generic_comparator (a, b) {
    
    if (a < b)
        return -1;
    
    else if (a > b)
        return 1;
    
    return 0;
    
};
