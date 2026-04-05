class AVLNode {
  constructor(key, value) {
    this.key = key;           // Concept name (for searching)
    this.value = value;       // Full concept object
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    
    return y;
  }

  insert(node, key, value) {
    if (!node) return new AVLNode(key, value);
    
    if (key < node.key) {
      node.left = this.insert(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.insert(node.right, key, value);
    } else {
      return node; // Duplicate keys not allowed
    }
    
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalance(node);
    
    // Left Left Case
    if (balance > 1 && key < node.left.key) {
      return this.rotateRight(node);
    }
    
    // Right Right Case
    if (balance < -1 && key > node.right.key) {
      return this.rotateLeft(node);
    }
    
    // Left Right Case
    if (balance > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    
    // Right Left Case
    if (balance < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    
    return node;
  }

  search(node, key) {
    if (!node) return null;
    
    if (key === node.key) {
      return node.value;
    } else if (key < node.key) {
      return this.search(node.left, key);
    } else {
      return this.search(node.right, key);
    }
  }

  getAllNodes(node, result = []) {
    if (node) {
      this.getAllNodes(node.left, result);
      result.push(node.value);
      this.getAllNodes(node.right, result);
    }
    return result;
  }

  searchByPrefix(node, prefix, results = []) {
    if (!node) return results;
    
    if (node.key.toLowerCase().startsWith(prefix.toLowerCase())) {
      results.push(node.value);
    }
    
    // Traverse both sides since tree is sorted by name
    this.searchByPrefix(node.left, prefix, results);
    this.searchByPrefix(node.right, prefix, results);
    
    return results;
  }

  getPredecessor(node, key, predecessor = null) {
    if (!node) return predecessor;
    
    if (node.key < key) {
      return this.getPredecessor(node.right, key, node);
    } else {
      return this.getPredecessor(node.left, key, predecessor);
    }
  }

  getSuccessor(node, key, successor = null) {
    if (!node) return successor;
    
    if (node.key > key) {
      return this.getSuccessor(node.left, key, node);
    } else {
      return this.getSuccessor(node.right, key, successor);
    }
  }
}

export default AVLTree;