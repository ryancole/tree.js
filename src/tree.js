
// include node object
var Node = require('./node');

// tree constructor
var Tree = module.exports = function (comparator) {
    
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

// add
Tree.prototype.insert = function (key) {
    
    if (this.root == null) {
        
        // if tree is empty, create new root node
        this.root = new Node(key);
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
                var new_node = new Node(key, node);
                
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
                var new_node = new Node(key, node);
                
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

// generic comparator
function generic_comparator (a, b) {
    
    if (a < b)
        return -1;
    
    else if (a > b)
        return 1;
    
    return 0;
    
};
