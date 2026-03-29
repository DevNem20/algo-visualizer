// Binary Search Tree Node
export class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

// BST insert
export function insertBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

// Build BST from array
export function buildBST(values) {
  let root = null;
  for (const v of values) root = insertBST(root, v);
  return root;
}

// Assign x/y positions for rendering (in-order layout)
export function assignPositions(root, depth = 0, counter = { val: 0 }) {
  if (!root) return;
  assignPositions(root.left, depth + 1, counter);
  root.x = counter.val++;
  root.y = depth;
  assignPositions(root.right, depth + 1, counter);
}

// Flatten tree to array of nodes with positions
export function flattenTree(root) {
  const nodes = [];
  function dfs(node) {
    if (!node) return;
    nodes.push({ id: node.id, val: node.val, x: node.x, y: node.y });
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return nodes;
}

// Flatten edges
export function flattenEdges(root) {
  const edges = [];
  function dfs(node) {
    if (!node) return;
    if (node.left) {
      edges.push({ from: node.id, to: node.left.id });
      dfs(node.left);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id });
      dfs(node.right);
    }
  }
  dfs(root);
  return edges;
}

// ==================== TRAVERSAL STEP GENERATORS ====================

// Returns array of steps: each step = { visited: [nodeIds so far], current: nodeId, description }

export function inorderSteps(root) {
  const steps = [];
  const visited = [];

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    visited.push(node.id);
    steps.push({
      visited: [...visited],
      current: node.id,
      description: `Inorder: Visit node ${node.val} (Left → Root → Right)`,
      order: [...visited],
    });
    inorder(node.right);
  }

  inorder(root);
  return steps;
}

export function preorderSteps(root) {
  const steps = [];
  const visited = [];

  function preorder(node) {
    if (!node) return;
    visited.push(node.id);
    steps.push({
      visited: [...visited],
      current: node.id,
      description: `Preorder: Visit node ${node.val} (Root → Left → Right)`,
      order: [...visited],
    });
    preorder(node.left);
    preorder(node.right);
  }

  preorder(root);
  return steps;
}

export function postorderSteps(root) {
  const steps = [];
  const visited = [];

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    visited.push(node.id);
    steps.push({
      visited: [...visited],
      current: node.id,
      description: `Postorder: Visit node ${node.val} (Left → Right → Root)`,
      order: [...visited],
    });
  }

  postorder(root);
  return steps;
}

export function levelOrderSteps(root) {
  const steps = [];
  if (!root) return steps;

  const queue = [root];
  const visited = [];
  let level = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelNodes = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      visited.push(node.id);
      levelNodes.push(node.val);
      steps.push({
        visited: [...visited],
        current: node.id,
        description: `BFS Level ${level}: Visiting node ${node.val} from queue`,
        order: [...visited],
        queueVals: queue.map((n) => n.val),
      });
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    level++;
  }

  return steps;
}

// Default BST values for demo
export const DEFAULT_BST_VALUES = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
