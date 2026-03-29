const express = require("express");
const router = express.Router();
const Algorithm = require('../models/Algorithm');

// GET all algorithms
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const algorithms = await Algorithm.find(filter).select("-__v");
    res.json(algorithms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET algorithm by name
router.get("/:name", async (req, res) => {
  try {
    const algo = await Algorithm.findOne({
      name: { $regex: new RegExp(req.params.name, "i") },
    }).select("-__v");
    if (!algo) return res.status(404).json({ error: "Algorithm not found" });
    res.json(algo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
