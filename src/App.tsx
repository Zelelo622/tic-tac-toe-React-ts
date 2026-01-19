import { useState, useEffect, useCallback } from "react";
import {
  checkWinner,
  minimax,
  type Difficulty,
  type Player,
} from "./utils/minimax";

function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState<"X" | "O">("X");
  const [difficulty, setDifficulty] = useState<Difficulty>("perfect");

  const winner = checkWinner(board);

  const handleClick = useCallback(
    (index: number) => {
      setBoard((prevBoard) => {
        if (prevBoard[index] || checkWinner(prevBoard)) return prevBoard;
        const newBoard = [...prevBoard];
        newBoard[index] = isXNext ? "X" : "O";
        return newBoard;
      });
      setIsXNext((prev) => !prev);
    },
    [isXNext],
  );

  const makeAiMove = useCallback(() => {
    const currentBoard = [...board];
    const availableMoves = currentBoard
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null) as number[];

    if (availableMoves.length === 0) return;

    if (difficulty === "normal" && Math.random() < 0.3) {
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      if (randomMove !== undefined) {
        handleClick(randomMove);
        return;
      }
    }

    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        currentBoard[i] = "O";
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      handleClick(move);
    }
  }, [board, difficulty, handleClick]);

  const resetGame = () => {
    const nextStarter = startingPlayer === "X" ? "O" : "X";
    setStartingPlayer(nextStarter);
    setBoard(Array(9).fill(null));
    setIsXNext(nextStarter === "X");
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const timeout = setTimeout(() => {
        makeAiMove();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isXNext, winner, makeAiMove]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-black bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
          TIC TAC TOE
        </h1>

        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mt-4 gap-2 justify-between">
          <button
            onClick={() => setDifficulty("normal")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              difficulty === "normal"
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Обычный
          </button>
          <button
            onClick={() => setDifficulty("perfect")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              difficulty === "perfect"
                ? "bg-blue-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Идеальный ИИ
          </button>
        </div>
      </div>

      <div className="mb-6 text-xl font-medium h-8 flex items-center gap-2">
        {winner ? (
          <span className="text-yellow-400 animate-pulse">
            {winner === "Draw"
              ? "Ничья!"
              : `Победил: ${winner === "X" ? "Игрок" : "ИИ"}`}
          </span>
        ) : (
          <>
            <span className="text-zinc-500 text-sm uppercase tracking-widest">
              Ход:
            </span>
            <span className={isXNext ? "text-cyan-400" : "text-rose-500"}>
              {isXNext ? "Игрок (X)" : "ИИ (O)"}
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 bg-zinc-800 p-3 rounded-3xl shadow-2xl border border-white/5">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => isXNext && handleClick(i)}
            disabled={!!cell || !!winner || !isXNext}
            className={`w-24 h-24 sm:w-28 sm:h-28 text-5xl font-bold flex items-center justify-center rounded-2xl transition-all duration-200
              ${!cell && !winner && isXNext ? "hover:bg-zinc-700 cursor-pointer active:scale-95" : "cursor-default"}
              ${cell === "X" ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" : "text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]"}
              bg-zinc-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]`}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-10 px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg active:scale-95 uppercase tracking-wider text-sm cursor-pointer"
      >
        Следующий раунд
      </button>

      <p className="mt-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
        Первым начинал: {startingPlayer === "X" ? "Игрок" : "ИИ"}
      </p>
    </div>
  );
}

export default App;
