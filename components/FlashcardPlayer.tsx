"use client";

import { useState } from "react";
import { FLASHCARDS_DATABASE } from "@/lib/data/flashcards";
import { Flashcard } from "@/types";

export default function FlashcardPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentCard = FLASHCARDS_DATABASE[currentIndex];

  const handleNext = (difficulty: "hard" | "medium" | "easy") => {
    setIsFlipped(false);
    const nextIndex = (currentIndex + 1) % FLASHCARDS_DATABASE.length;
    setCurrentIndex(nextIndex);
    setProgress(((nextIndex + 1) / FLASHCARDS_DATABASE.length) * 100);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card Container */}
      <div
        className={`relative h-80 cursor-pointer transition-transform duration-500 preserve-3d ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="px-3 py-1 bg-accent-primary/15 text-accent-hover rounded-full text-xs font-semibold mb-4">
            {currentCard.specialty}
          </span>

          {currentCard.isJewel && (
            <span className="text-purple-400 text-sm font-semibold mb-6">
              💎 Joya ENARM
            </span>
          )}

          <p className="text-lg font-medium leading-relaxed mb-8">
            {currentCard.question}
          </p>

          <span className="text-text-dim text-sm italic">
            Toca para ver la respuesta
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="px-3 py-1 bg-accent-primary/15 text-accent-hover rounded-full text-xs font-semibold mb-6">
            {currentCard.specialty}
          </span>

          <h3 className="font-display text-3xl font-bold text-gradient mb-4">
            {currentCard.answerTitle}
          </h3>

          <p className="text-text-secondary leading-relaxed mb-6">
            {currentCard.answerDesc}
          </p>

          <div
            className="bg-bg-tertiary rounded-lg p-4 text-sm text-left w-full"
            dangerouslySetInnerHTML={{ __html: currentCard.extra }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mt-8 mb-6">
        <button
          onClick={() => handleNext("hard")}
          className="flex flex-col items-center gap-1 px-6 py-3 bg-bg-card border border-border rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
        >
          <span className="text-2xl">😰</span>
          <span className="text-xs font-semibold">Difícil</span>
        </button>

        <button
          onClick={() => handleNext("medium")}
          className="flex flex-col items-center gap-1 px-6 py-3 bg-bg-card border border-border rounded-lg hover:border-yellow-500 hover:text-yellow-500 transition-all"
        >
          <span className="text-2xl">🤔</span>
          <span className="text-xs font-semibold">Regular</span>
        </button>

        <button
          onClick={() => handleNext("easy")}
          className="flex flex-col items-center gap-1 px-6 py-3 bg-bg-card border border-border rounded-lg hover:border-green-500 hover:text-green-500 transition-all"
        >
          <span className="text-2xl">😎</span>
          <span className="text-xs font-semibold">Fácil</span>
        </button>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-text-muted text-sm">
          {currentIndex + 1} / {FLASHCARDS_DATABASE.length} tarjetas
        </span>
      </div>
    </div>
  );
}
