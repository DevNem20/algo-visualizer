const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const algorithmRoutes = require("./routes/algorithms");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/algovisualizer";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/algorithms", algorithmRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Algo Visualizer API is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await seedDatabase();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    // Start server anyway (without DB) for local dev without MongoDB
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} (no DB)`)
    );
  });

// Seed algorithm metadata into MongoDB
async function seedDatabase() {
  const Algorithm = require("./models/Algorithm");
  const count = await Algorithm.countDocuments();
  if (count > 0) return;

  const algorithms = [
    // Sorting
    {
      name: "Bubble Sort",
      category: "sorting",
      timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      spaceComplexity: "O(1)",
      stable: true,
      description:
        "Repeatedly swaps adjacent elements if they are in the wrong order. Simple but inefficient for large datasets.",
      keyInsight:
        "Each pass bubbles the largest unsorted element to its correct position.",
    },
    {
      name: "Selection Sort",
      category: "sorting",
      timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
      spaceComplexity: "O(1)",
      stable: false,
      description:
        "Finds the minimum element in the unsorted portion and places it at the beginning.",
      keyInsight:
        "Makes at most n-1 swaps, making it efficient when write operations are costly.",
    },
    {
      name: "Insertion Sort",
      category: "sorting",
      timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      spaceComplexity: "O(1)",
      stable: true,
      description:
        "Builds the sorted array one element at a time by inserting each into its correct position.",
      keyInsight:
        "Excellent for nearly sorted data and small datasets. Used as a subroutine in Timsort.",
    },
    {
      name: "Merge Sort",
      category: "sorting",
      timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      spaceComplexity: "O(n)",
      stable: true,
      description:
        "Divides array in half, recursively sorts each half, then merges them back together.",
      keyInsight:
        "Guaranteed O(n log n) performance. Preferred for linked lists and external sorting.",
    },
    {
      name: "Quick Sort",
      category: "sorting",
      timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      spaceComplexity: "O(log n)",
      stable: false,
      description:
        "Picks a pivot element and partitions the array around it, then recursively sorts the partitions.",
      keyInsight:
        "Fastest in practice due to cache efficiency. Worst case avoided with random pivot selection.",
    },
    {
      name: "Heap Sort",
      category: "sorting",
      timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      spaceComplexity: "O(1)",
      stable: false,
      description:
        "Converts array into a max-heap, then repeatedly extracts the maximum element.",
      keyInsight:
        "Combines best of both worlds: O(n log n) like Merge Sort and O(1) space like Insertion Sort.",
    },
    // Tree Traversals
    {
      name: "Inorder Traversal",
      category: "tree",
      timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
      spaceComplexity: "O(h)",
      stable: true,
      description: "Visits Left → Root → Right. Produces sorted output for a BST.",
      keyInsight: "Used to validate BSTs and get elements in sorted order.",
    },
    {
      name: "Preorder Traversal",
      category: "tree",
      timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
      spaceComplexity: "O(h)",
      stable: true,
      description:
        "Visits Root → Left → Right. Used for copying/serializing trees.",
      keyInsight: "Root is always processed first — great for cloning a tree structure.",
    },
    {
      name: "Postorder Traversal",
      category: "tree",
      timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
      spaceComplexity: "O(h)",
      stable: true,
      description:
        "Visits Left → Right → Root. Used for deleting trees and evaluating expressions.",
      keyInsight: "Children always processed before parents — essential for safe deletion.",
    },
    {
      name: "Level Order (BFS)",
      category: "tree",
      timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
      spaceComplexity: "O(w)",
      stable: true,
      description:
        "Visits nodes level by level using a queue. Also known as Breadth-First Search.",
      keyInsight:
        "Finds shortest path in unweighted trees. Width (w) of tree determines space usage.",
    },
  ];

  await Algorithm.insertMany(algorithms);
  console.log("✅ Database seeded with algorithm metadata");
}
