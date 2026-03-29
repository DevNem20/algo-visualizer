import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  buildBST,
  assignPositions,
  flattenTree,
  flattenEdges,
  inorderSteps,
  preorderSteps,
  postorderSteps,
  levelOrderSteps,
  DEFAULT_BST_VALUES,
} from "../algorithms/tree";

const TRAVERSAL_MAP = {
  "Inorder (L→R→Root)": inorderSteps,
  "Preorder (Root→L→R)": preorderSteps,
  "Postorder (L→R→Root)": postorderSteps,
  "Level Order (BFS)": levelOrderSteps,
};

const NODE_R = 22;
const H_SPACING = 52;
const V_SPACING = 70;

export default function TreeVisualizer({ algorithm, algoInfo }) {
  const [inputVal, setInputVal] = useState(DEFAULT_BST_VALUES.join(", "));
  const [root, setRoot] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const intervalRef = useRef(null);

  const currentStep = steps[stepIdx] || null;

  // Build tree from input
  const buildTree = useCallback((valStr) => {
    try {
      const vals = valStr
        .split(/[,\s]+/)
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));
      if (vals.length === 0) return;
      const r = buildBST(vals);
      assignPositions(r);
      setRoot(r);
      setNodes(flattenTree(r));
      setEdges(flattenEdges(r));
      setSteps([]);
      setStepIdx(-1);
      stopAnim();
    } catch (e) {
      console.error("Build error", e);
    }
  }, []);

  useEffect(() => {
    buildTree(inputVal);
  }, []);

  // Reset traversal on algorithm change
  useEffect(() => {
    stopAnim();
    setSteps([]);
    setStepIdx(-1);
  }, [algorithm]);

  const stopAnim = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const prepare = () => {
    stopAnim();
    if (!root) return;
    const fn = TRAVERSAL_MAP[algorithm];
    if (!fn) return;
    const s = fn(root);
    setSteps(s);
    setStepIdx(0);
  };

  const play = () => {
    if (steps.length === 0) { prepare(); }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, Math.max(200, 1200 - speed * 10));
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps, speed]);

  // Layout: convert logical x/y to SVG coords
  const maxX = nodes.length > 0 ? Math.max(...nodes.map((n) => n.x)) : 0;
  const maxY = nodes.length > 0 ? Math.max(...nodes.map((n) => n.y)) : 0;
  const svgW = Math.max(600, (maxX + 1) * H_SPACING + NODE_R * 2 + 40);
  const svgH = (maxY + 1) * V_SPACING + NODE_R * 2 + 40;
  const offsetX = NODE_R + 20;
  const offsetY = NODE_R + 20;

  const nodeCoord = (node) => ({
    cx: offsetX + node.x * H_SPACING,
    cy: offsetY + node.y * V_SPACING,
  });

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  // Visited/current state from step
  const visited = new Set(currentStep ? currentStep.visited : []);
  const current = currentStep ? currentStep.current : null;

  // Traversal order display (vals)
  const visitedVals = currentStep
    ? currentStep.order.map((id) => {
        const n = nodeById[id];
        return n ? n.val : "?";
      })
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls */}
      <div className="controls-bar">
        <span className="algo-title">{algorithm.split(" ")[0]} {algorithm.split(" ")[1] || ""}</span>
        <button className="btn btn-primary" onClick={isPlaying ? stopAnim : play} disabled={!root}>
          {isPlaying ? "⏸ Pause" : stepIdx === -1 ? "▶ Traverse" : "▶ Resume"}
        </button>
        <button className="btn" onClick={() => setStepIdx((p) => Math.max(0, p - 1))} disabled={stepIdx <= 0 || isPlaying}>
          ⏮ Prev
        </button>
        <button className="btn" onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} disabled={stepIdx >= steps.length - 1 || isPlaying || steps.length === 0}>
          Next ⏭
        </button>
        <button className="btn btn-danger" onClick={() => { stopAnim(); setSteps([]); setStepIdx(-1); }}>
          ⟳ Reset
        </button>
        <div className="speed-control">
          <span>Speed:</span>
          <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
          <span>{speed > 66 ? "Fast" : speed > 33 ? "Mid" : "Slow"}</span>
        </div>
      </div>

      {/* Tree Input */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div className="tree-input-row">
          <input
            className="tree-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter BST values: 50, 30, 70, 20, 40..."
          />
          <button className="btn btn-primary" onClick={() => buildTree(inputVal)}>
            Build BST
          </button>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            {nodes.length} nodes
          </span>
        </div>
      </div>

      {/* Step Info */}
      <div className="step-info">
        {currentStep ? (
          <>
            <span>→</span>
            <span>{currentStep.description}</span>
            {currentStep.queueVals && currentStep.queueVals.length > 0 && (
              <span style={{ color: "var(--yellow)", fontSize: "0.75rem" }}>
                Queue: [{currentStep.queueVals.join(", ")}]
              </span>
            )}
            <span className="step-counter">[{stepIdx + 1} / {steps.length}]</span>
          </>
        ) : (
          <span style={{ color: "var(--muted)" }}>Build a BST and press Traverse</span>
        )}
      </div>

      {/* SVG Tree */}
      <div className="visualizer-area">
        <div className="tree-svg-container">
          <svg
            className="tree-svg"
            width={svgW}
            height={svgH}
            style={{ minHeight: 240 }}
          >
            {/* Edges */}
            {edges.map((e, i) => {
              const from = nodeById[e.from];
              const to = nodeById[e.to];
              if (!from || !to) return null;
              const { cx: x1, cy: y1 } = nodeCoord(from);
              const { cx: x2, cy: y2 } = nodeCoord(to);
              const isVisited = visited.has(e.from) && visited.has(e.to);
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={`tree-edge ${isVisited ? "visited" : ""}`}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const { cx, cy } = nodeCoord(node);
              const isVisited = visited.has(node.id);
              const isCurrent = current === node.id;
              return (
                <g key={node.id}>
                  <circle
                    cx={cx} cy={cy} r={NODE_R}
                    className={`tree-node-circle ${isCurrent ? "current" : isVisited ? "visited" : ""}`}
                  />
                  <text x={cx} y={cy} className="tree-node-text">
                    {node.val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Traversal Output */}
        <div className="traversal-output">
          <div className="traversal-label">TRAVERSAL ORDER</div>
          <div className="traversal-nodes">
            {visitedVals.length === 0 ? (
              <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                Start traversal to see the visit order...
              </span>
            ) : (
              visitedVals.map((val, i) => (
                <span
                  key={i}
                  className={`tnode ${i === visitedVals.length - 1 ? "current-node" : "highlighted"}`}
                >
                  {val}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {[
          { label: "Unvisited", color: "var(--bg3)", border: "var(--border)" },
          { label: "Visited", color: "rgba(88,166,255,0.15)", border: "var(--visited)" },
          { label: "Current", color: "rgba(57,211,83,0.2)", border: "var(--current)" },
        ].map((l) => (
          <div className="legend-item" key={l.label}>
            <div className="legend-dot" style={{ background: l.color, border: `1.5px solid ${l.border}`, borderRadius: "50%" }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Info Panel */}
      {algoInfo && (
        <div className="info-panel">
          <div className="info-card">
            <div className="info-label">Time Complexity</div>
            <div className="info-value green">{algoInfo.timeComplexity?.average}</div>
          </div>
          <div className="info-card">
            <div className="info-label">Space (h = height)</div>
            <div className="info-value yellow">{algoInfo.spaceComplexity}</div>
          </div>
          <div className="info-card">
            <div className="info-label">Pattern</div>
            <div className="info-value" style={{ color: "var(--cyan)", fontSize: "0.75rem" }}>
              {algorithm.includes("Inorder") ? "L → Root → R" :
               algorithm.includes("Preorder") ? "Root → L → R" :
               algorithm.includes("Postorder") ? "L → R → Root" : "Queue (FIFO)"}
            </div>
          </div>
          <div className="info-card">
            <div className="info-label">Key Insight</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: "1.5" }}>
              {algoInfo.keyInsight}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
