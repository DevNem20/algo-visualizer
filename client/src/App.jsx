import React, { useState, useEffect } from "react";
import axios from "axios";
import SortingVisualizer from "./components/SortingVisualizer";
import TreeVisualizer from "./components/TreeVisualizer";
import "./styles/App.css";

const SORTING_ALGOS = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
];

const TREE_ALGOS = [
  "Inorder (L→R→Root)",
  "Preorder (Root→L→R)",
  "Postorder (L→R→Root)",
  "Level Order (BFS)",
];

// Fallback info (used when MongoDB/server isn't running)
const FALLBACK_INFO = {
  "Bubble Sort": {
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)", stable: true,
    keyInsight: "Each pass bubbles the largest element to its correct position.",
  },
  "Selection Sort": {
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)", stable: false,
    keyInsight: "Makes at most n-1 swaps — efficient when writes are costly.",
  },
  "Insertion Sort": {
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)", stable: true,
    keyInsight: "Excellent for nearly sorted data. Core of Timsort.",
  },
  "Merge Sort": {
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)", stable: true,
    keyInsight: "Guaranteed O(n log n). Preferred for linked lists and external sorting.",
  },
  "Quick Sort": {
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)", stable: false,
    keyInsight: "Fastest in practice due to cache efficiency. Worst case avoided with random pivot.",
  },
  "Heap Sort": {
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(1)", stable: false,
    keyInsight: "O(n log n) time + O(1) space. Best of Merge Sort and Insertion Sort.",
  },
  "Inorder (L→R→Root)": {
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)", stable: true,
    keyInsight: "Produces sorted output for BST. Key for validation and sorted retrieval.",
  },
  "Preorder (Root→L→R)": {
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)", stable: true,
    keyInsight: "Root processed first — ideal for copying/serializing tree structure.",
  },
  "Postorder (L→R→Root)": {
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)", stable: true,
    keyInsight: "Children before parents — essential for safe deletion and expression eval.",
  },
  "Level Order (BFS)": {
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(w)", stable: true,
    keyInsight: "Finds shortest path in unweighted trees. Width of tree determines space.",
  },
};

export default function App() {
  const [tab, setTab] = useState("sorting"); // "sorting" | "tree"
  const [selectedAlgo, setSelectedAlgo] = useState("Bubble Sort");
  const [algoInfoMap, setAlgoInfoMap] = useState(FALLBACK_INFO);

  // Fetch algorithm metadata from MongoDB via Express API
  useEffect(() => {
    async function fetchAlgoInfo() {
      try {
        const res = await axios.get("/api/algorithms");
        const map = {};
        for (const algo of res.data) {
          map[algo.name] = algo;
        }
        // Map DB names to our display names for tree algos
        const treeNameMap = {
          "Inorder Traversal": "Inorder (L→R→Root)",
          "Preorder Traversal": "Preorder (Root→L→R)",
          "Postorder Traversal": "Postorder (L→R→Root)",
          "Level Order (BFS)": "Level Order (BFS)",
        };
        const finalMap = { ...FALLBACK_INFO };
        for (const [dbName, displayName] of Object.entries(treeNameMap)) {
          if (map[dbName]) finalMap[displayName] = map[dbName];
        }
        for (const sortName of SORTING_ALGOS) {
          if (map[sortName]) finalMap[sortName] = map[sortName];
        }
        setAlgoInfoMap(finalMap);
      } catch (e) {
        // Server not running — use fallback (app still works fully)
        console.log("Using fallback algo info (server not connected)");
      }
    }
    fetchAlgoInfo();
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSelectedAlgo(newTab === "sorting" ? "Bubble Sort" : "Inorder (L→R→Root)");
  };

  const handleAlgoSelect = (algo) => {
    setSelectedAlgo(algo);
  };

  const currentAlgos = tab === "sorting" ? SORTING_ALGOS : TREE_ALGOS;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="navbar">
        <a className="navbar-logo" href="/">
          {"<"}AlgoViz{">"}
        </a>
        <div className="navbar-tabs">
          <button
            className={`nav-tab ${tab === "sorting" ? "active" : ""}`}
            onClick={() => handleTabChange("sorting")}
          >
            ⬆ Sorting
          </button>
          <button
            className={`nav-tab ${tab === "tree" ? "active" : ""}`}
            onClick={() => handleTabChange("tree")}
          >
            🌲 Tree Traversal
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            {tab === "sorting" ? "Sorting Algorithms" : "Tree Traversals"}
          </div>
          {currentAlgos.map((algo) => (
            <button
              key={algo}
              className={`algo-btn ${selectedAlgo === algo ? `active ${tab === "sorting" ? "sort-active" : "tree-active"}` : ""}`}
              onClick={() => handleAlgoSelect(algo)}
            >
              <span>{algo}</span>
              {selectedAlgo === algo && <span className="badge on">active</span>}
            </button>
          ))}

          {/* Complexity Quick Ref */}
          <div style={{ marginTop: "auto", padding: "12px 8px" }}>
            <div className="sidebar-section" style={{ marginBottom: "8px" }}>Quick Ref</div>
            {tab === "sorting" && (
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", lineHeight: "1.8" }}>
                <div>🟢 O(n log n) → Merge, Heap, Quick</div>
                <div>🟡 O(n²) → Bubble, Selection, Insertion</div>
                <div>🔵 Stable → Bubble, Insertion, Merge</div>
              </div>
            )}
            {tab === "tree" && (
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", lineHeight: "1.8" }}>
                <div>🔵 Inorder → Sorted output (BST)</div>
                <div>🟢 Preorder → Clone/Serialize</div>
                <div>🟡 Postorder → Delete/Evaluate</div>
                <div>🟣 BFS → Shortest path</div>
              </div>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          {tab === "sorting" ? (
            <SortingVisualizer
              key={selectedAlgo}
              algorithm={selectedAlgo}
              algoInfo={algoInfoMap[selectedAlgo]}
            />
          ) : (
            <TreeVisualizer
              key={selectedAlgo}
              algorithm={selectedAlgo}
              algoInfo={algoInfoMap[selectedAlgo]}
            />
          )}
        </main>
      </div>
    </div>
  );
}
