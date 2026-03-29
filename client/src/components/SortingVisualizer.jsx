import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
} from "../algorithms/sorting";

const ALGO_MAP = {
  "Bubble Sort": bubbleSortSteps,
  "Selection Sort": selectionSortSteps,
  "Insertion Sort": insertionSortSteps,
  "Merge Sort": mergeSortSteps,
  "Quick Sort": quickSortSteps,
  "Heap Sort": heapSortSteps,
};

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function SortingVisualizer({ algorithm, algoInfo }) {
  const [array, setArray] = useState(() => generateArray(30));
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [arraySize, setArraySize] = useState(30);
  const intervalRef = useRef(null);

  const currentStep = steps[stepIdx] || null;

  // Reset when algorithm or array changes
  useEffect(() => {
    stop();
    setSteps([]);
    setStepIdx(-1);
  }, [algorithm]);

  const generateNew = useCallback(() => {
    stop();
    const arr = generateArray(arraySize);
    setArray(arr);
    setSteps([]);
    setStepIdx(-1);
  }, [arraySize]);

  const prepare = useCallback(() => {
    stop();
    const fn = ALGO_MAP[algorithm];
    if (!fn) return;
    const s = fn([...array]);
    setSteps(s);
    setStepIdx(0);
  }, [algorithm, array]);

  const play = useCallback(() => {
    if (steps.length === 0) {
      const fn = ALGO_MAP[algorithm];
      if (!fn) return;
      const s = fn([...array]);
      setSteps(s);
      setStepIdx(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(true);
  }, [steps, algorithm, array]);

  const stop = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Auto-play
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, Math.max(20, 500 - speed * 4));
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps, speed]);

  const displayArray = currentStep ? currentStep.array : array;
  const maxVal = Math.max(...displayArray);

  const getBarClass = (i) => {
    if (!currentStep) return "bar default";
    const { comparing, swapping, sorted, pivot } = currentStep;
    if (sorted && sorted.includes(i)) return "bar sorted";
    if (swapping && swapping.includes(i)) return "bar swapping";
    if (pivot === i) return "bar pivot";
    if (comparing && comparing.includes(i)) return "bar comparing";
    return "bar default";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls */}
      <div className="controls-bar">
        <span className="algo-title">{algorithm}</span>
        <button className="btn btn-primary" onClick={isPlaying ? stop : play} disabled={stepIdx === steps.length - 1 && steps.length > 0}>
          {isPlaying ? "⏸ Pause" : stepIdx === -1 ? "▶ Visualize" : "▶ Resume"}
        </button>
        <button className="btn" onClick={() => setStepIdx((p) => Math.max(0, p - 1))} disabled={stepIdx <= 0 || isPlaying}>
          ⏮ Prev
        </button>
        <button className="btn" onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))} disabled={stepIdx >= steps.length - 1 || isPlaying}>
          Next ⏭
        </button>
        <button className="btn btn-danger" onClick={generateNew}>
          ⟳ New Array
        </button>
        <div className="size-control">
          <span>Size:</span>
          <input type="range" min="10" max="60" value={arraySize}
            onChange={(e) => { setArraySize(+e.target.value); stop(); setArray(generateArray(+e.target.value)); setSteps([]); setStepIdx(-1); }} />
          <span>{arraySize}</span>
        </div>
        <div className="speed-control">
          <span>Speed:</span>
          <input type="range" min="1" max="120" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
          <span>{speed > 80 ? "Fast" : speed > 40 ? "Mid" : "Slow"}</span>
        </div>
      </div>

      {/* Step info */}
      <div className="step-info">
        {currentStep ? (
          <>
            <span>→</span>
            <span>{currentStep.description}</span>
            <span className="step-counter">
              [{stepIdx + 1} / {steps.length}]
            </span>
          </>
        ) : (
          <span style={{ color: "var(--muted)" }}>Press Visualize to start</span>
        )}
      </div>

      {/* Bars */}
      <div className="visualizer-area">
        <div className="bars-container">
          {displayArray.map((val, i) => (
            <div
              key={i}
              className={getBarClass(i)}
              style={{ height: `${(val / maxVal) * 100}%` }}
            >
              {arraySize <= 20 && (
                <span className="bar-value">{val}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {[
          { label: "Default", color: "rgba(88,166,255,0.4)", cls: "" },
          { label: "Comparing", color: "var(--comparing)", cls: "" },
          { label: "Swapping", color: "var(--swapping)", cls: "" },
          { label: "Sorted", color: "var(--sorted)", cls: "" },
          { label: "Pivot", color: "var(--pivot)", cls: "" },
        ].map((l) => (
          <div className="legend-item" key={l.label}>
            <div className="legend-dot" style={{ background: l.color }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Info Panel */}
      {algoInfo && (
        <div className="info-panel">
          <div className="info-card">
            <div className="info-label">Time Complexity</div>
            <div className="complexity-grid">
              <div className="complexity-row">
                <span className="complexity-key">Best</span>
                <span className="complexity-val green">{algoInfo.timeComplexity?.best}</span>
              </div>
              <div className="complexity-row">
                <span className="complexity-key">Avg</span>
                <span className="complexity-val yellow">{algoInfo.timeComplexity?.average}</span>
              </div>
              <div className="complexity-row">
                <span className="complexity-key">Worst</span>
                <span className="complexity-val red">{algoInfo.timeComplexity?.worst}</span>
              </div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-label">Space</div>
            <div className="info-value cyan">{algoInfo.spaceComplexity}</div>
          </div>
          <div className="info-card">
            <div className="info-label">Stable?</div>
            <div className={`info-value ${algoInfo.stable ? "green" : "red"}`}>
              {algoInfo.stable ? "✓ Yes" : "✗ No"}
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
