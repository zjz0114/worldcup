"use client";

import { useState, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

export default function PenaltyGame() {
  const [gameState, setGameState] = useState<"ready" | "aiming" | "shooting" | "result">("ready");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<"goal" | "saved" | "missed" | null>(null);
  const [keeperPos, setKeeperPos] = useState<Position>({ x: 50, y: 50 });
  const [ballPos, setBallPos] = useState<Position>({ x: 50, y: 85 });
  const fieldRef = useRef<HTMLDivElement>(null);

  const MAX_ATTEMPTS = 5;

  const shoot = (targetX: number, targetY: number) => {
    if (gameState !== "ready" && gameState !== "aiming") return;

    setGameState("shooting");
    setTargetPos({ x: targetX, y: targetY });

    // Keeper moves randomly
    const keeperX = 20 + Math.random() * 60;
    const keeperY = 30 + Math.random() * 40;
    setKeeperPos({ x: keeperX, y: keeperY });

    // Animate ball
    let progress = 0;
    const startX = 50;
    const startY = 85;

    const animate = () => {
      progress += 0.05;
      if (progress >= 1) {
        // Calculate result
        const distance = Math.sqrt(
          Math.pow(targetX - keeperX, 2) + Math.pow(targetY - keeperY, 2)
        );

        let newResult: "goal" | "saved" | "missed";
        if (distance < 15) {
          newResult = "saved";
        } else if (targetX < 10 || targetX > 90 || targetY < 10) {
          newResult = "missed";
        } else {
          newResult = "goal";
        }

        setResult(newResult);
        if (newResult === "goal") {
          setScore((s) => s + 1);
        }
        setAttempts((a) => a + 1);
        setGameState("result");
        return;
      }

      setBallPos({
        x: startX + (targetX - startX) * progress,
        y: startY + (targetY - startY) * progress * 0.7, // Ball moves up
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setGameState("ready");
    setResult(null);
    setBallPos({ x: 50, y: 85 });
    setKeeperPos({ x: 50, y: 50 });
  };

  const nextKick = () => {
    if (attempts >= MAX_ATTEMPTS) {
      resetGame();
    } else {
      setGameState("ready");
      setResult(null);
      setBallPos({ x: 50, y: 85 });
      setKeeperPos({ x: 50, y: 50 });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "ready" && gameState !== "aiming") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    shoot(x, y);
  };

  const getMessage = () => {
    if (result === "goal") return "⚽ GOAL!";
    if (result === "saved") return "🧤 SAVED!";
    if (result === "missed") return "😱 MISSED!";
    return "";
  };

  const getFinalMessage = () => {
    const percentage = (score / MAX_ATTEMPTS) * 100;
    if (percentage === 100) return "🏆 PERFECT! World Class!";
    if (percentage >= 80) return "⭐ Excellent! Professional Level!";
    if (percentage >= 60) return "👍 Good! Amateur Level!";
    if (percentage >= 40) return "👊 Not Bad! Keep Practicing!";
    return "💪 Room for Improvement!";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Score Board */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
            <span className="text-white/60 text-xs block">SCORE</span>
            <span className="text-white text-2xl font-black">{score}/{attempts}</span>
          </div>
          {attempts >= MAX_ATTEMPTS && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl px-4 py-2 border border-yellow-400/30">
              <span className="text-yellow-300 text-sm font-semibold">{getFinalMessage()}</span>
            </div>
          )}
        </div>
        <button
          onClick={resetGame}
          className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Game Field */}
      <div
        ref={fieldRef}
        onClick={handleClick}
        className="relative w-full aspect-[4/3] max-h-[400px] bg-gradient-to-b from-green-600 to-green-800 rounded-3xl overflow-hidden cursor-crosshair border-4 border-white/20 shadow-2xl select-none"
      >
        {/* Field Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 border border-white rounded-full"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white"></div>
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white"></div>
        </div>

        {/* Goal */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16">
          <div className="absolute inset-0 border-4 border-white/50 rounded-t-lg"></div>
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/50"></div>
          {/* Net */}
          <div className="absolute inset-2 opacity-30" style={{
            backgroundImage: "linear-gradient(90deg, transparent 49%, white 49%, white 51%, transparent 51%), linear-gradient(0deg, transparent 49%, white 49%, white 51%, transparent 51%)",
            backgroundSize: "8px 8px"
          }}></div>
        </div>

        {/* Goalkeeper */}
        <div
          className="absolute w-12 h-16 transition-all duration-300 ease-out"
          style={{
            left: `${keeperPos.x}%`,
            top: `${keeperPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-yellow-300 rounded-full"></div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-lg border-2 border-red-700"></div>
            {/* Gloves */}
            <div className="absolute bottom-10 -left-1 w-4 h-3 bg-white rounded-full border border-gray-300"></div>
            <div className="absolute bottom-10 -right-1 w-4 h-3 bg-white rounded-full border border-gray-300"></div>
          </div>
        </div>

        {/* Ball */}
        <div
          className="absolute w-8 h-8 transition-all"
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-full h-full bg-white rounded-full shadow-xl border-4 border-gray-200 relative overflow-hidden">
            {/* Ball pattern */}
            <div className="absolute inset-1">
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-black rounded-full"></div>
              <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-black rounded-full"></div>
              <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-black rounded-full"></div>
              <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Target Indicator (when aiming) */}
        {gameState === "ready" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/80 text-center">
              <div className="text-4xl mb-2 animate-bounce">👆</div>
              <div className="text-sm font-medium">Click to shoot!</div>
            </div>
          </div>
        )}

        {/* Result Overlay */}
        {gameState === "result" && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-5xl mb-2">{getMessage()}</div>
              <button
                onClick={nextKick}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                {attempts >= MAX_ATTEMPTS ? "🔄 Play Again" : "➡️ Next Kick"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-white/50 text-sm">
        <p>Click anywhere in the goal to shoot! Score as many goals as you can!</p>
      </div>
    </div>
  );
}
