const mongoose = require("mongoose");

const algorithmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ["sorting", "tree"], required: true },
    timeComplexity: {
      best: String,
      average: String,
      worst: String,
    },
    spaceComplexity: String,
    stable: Boolean,
    description: String,
    keyInsight: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Algorithm", algorithmSchema);
