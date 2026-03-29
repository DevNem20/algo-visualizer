# 🧠 AlgoViz — MERN Stack Algorithm Visualizer

A full-stack DSA visualizer built with the **MERN stack** (MongoDB, Express, React, Node.js).

## Features

### Sorting Algorithms
- **Bubble Sort** — O(n²) comparison-based
- **Selection Sort** — Minimum selection approach  
- **Insertion Sort** — In-place, stable, great for nearly sorted
- **Merge Sort** — Divide & conquer, guaranteed O(n log n)
- **Quick Sort** — Pivot-based partitioning
- **Heap Sort** — Max-heap extraction

### Tree Traversals (BST)
- **Inorder** — Left → Root → Right (gives sorted output)
- **Preorder** — Root → Left → Right (for cloning trees)
- **Postorder** — Left → Right → Root (for deletion)
- **Level Order / BFS** — Queue-based breadth-first

### Core Features
- Step-by-step animation with Pause / Prev / Next controls
- Adjustable speed and array size
- Real-time complexity info from MongoDB
- Custom BST input (type your own values)
- Color-coded states: comparing, swapping, sorted, pivot, visited, current

---

## Project Structure

```
algo-visualizer/
├── package.json              ← root (concurrently dev scripts)
├── server/
│   ├── package.json
│   ├── index.js              ← Express + MongoDB entry
│   ├── models/
│   │   └── Algorithm.js      ← Mongoose model
│   └── routes/
│       └── algorithms.js     ← REST API routes
└── client/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js
        ├── App.jsx            ← Root component + routing
        ├── algorithms/
        │   ├── sorting.js     ← All sorting step generators
        │   └── tree.js        ← BST + traversal step generators
        ├── components/
        │   ├── SortingVisualizer.jsx
        │   └── TreeVisualizer.jsx
        └── styles/
            └── App.css
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env — set your MongoDB URI
```

### 3. Start MongoDB
Make sure MongoDB is running locally on port 27017, or update `MONGO_URI` in `.env`.

### 4. Run dev servers
```bash
# From root directory
npm run dev
```

This starts:
- **Express API** at `http://localhost:5000`
- **React App** at `http://localhost:3000`

> **Note:** The app works fully even without MongoDB running — it falls back to built-in algorithm metadata. MongoDB adds persistence for the complexity info panel.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/algorithms` | All algorithms metadata |
| GET | `/api/algorithms?category=sorting` | Filter by category |
| GET | `/api/algorithms/:name` | Single algorithm info |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Styling | Pure CSS (no UI library) |
| Dev Tools | Concurrently, Nodemon |

---

## DSA Concepts Covered

- **Arrays**: Sorting in-place, index manipulation
- **Recursion**: Merge Sort, Quick Sort, Tree traversals
- **Divide & Conquer**: Merge Sort, Quick Sort
- **Heaps**: Heap Sort via max-heap
- **Trees**: BST insertion, DFS (3 orders), BFS
- **Queues**: Level-order traversal (BFS)
- **Big-O Analysis**: Time + space complexity for every algorithm
