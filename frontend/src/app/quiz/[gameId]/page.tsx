"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Quiz, QuizOption, QuizQuestion } from "@/type";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Confetti from "react-confetti";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [finalScore, setFinalScore] = useState(0);

  async function fetchQuiz() {
    try {
      setLoading(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/quiz/${gameId}`,
        {
          method: "GET",
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      setQuiz(json.result);
    } catch (error) {
      console.error("FETCH QUIZ ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!gameId) return;

    fetchQuiz();
  }, [gameId]);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <p className="text-gray-500">Memuat Quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <p className="text-red-500">Quiz tidak ditemukan</p>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;

  const currentQuestion: QuizQuestion | undefined =
    quiz.questions[currentQuestionIndex];

  const correctOption = currentQuestion?.options.find(
    (option) => option.is_correct,
  );

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  function handleSelectOption(option: QuizOption) {
    if (showResult) return;

    setSelectedOptionId(option.id);

    setShowResult(true);

    if (option.is_correct) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);

      setSelectedOptionId(null);

      setShowResult(false);
    } else {
      const finalScoreValue = Math.round((score / totalQuestions) * 100);

      setFinalScore(finalScoreValue);

      if (finalScoreValue === 100) {
        setShowConfetti(true);
      }

      setShowFinalResult(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="cursor-pointer text-[#7B0000] font-medium mb-8"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2B0A0A]">
                {quiz.title}
              </h1>

              <p className="mt-2 text-gray-500">
                Minimal skor: {quiz.min_score}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Pertanyaan</p>

              <p className="text-2xl font-bold text-[#7B0000]">
                {currentQuestionIndex + 1}/{quiz.questions.length}
              </p>
            </div>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-[#7B0000] rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <p className="text-sm font-semibold text-[#7B0000] uppercase tracking-wider">
            Pertanyaan
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-snug text-[#2B0A0A]">
            {currentQuestion?.question}
          </h2>

          <div className="mt-10 space-y-4">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedOptionId === option.id;

              const isCorrect = option.is_correct;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`
                      w-full p-5 rounded-2xl border transition-all duration-300 text-left flex items-center gap-4

                      ${
                        !showResult
                          ? "bg-white border-gray-200 hover:border-[#7B0000] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                          : ""
                      }

                      ${
                        showResult && isCorrect
                          ? "bg-green-50 border-green-500"
                          : ""
                      }

                      ${
                        showResult && isSelected && !isCorrect
                          ? "bg-red-50 border-red-500"
                          : ""
                      }
                    `}
                >
                  <div
                    className={`
                        w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0

                        ${
                          showResult && isCorrect
                            ? "bg-green-500 text-white"
                            : ""
                        }

                        ${
                          showResult && isSelected && !isCorrect
                            ? "bg-red-500 text-white"
                            : ""
                        }

                        ${!showResult ? "bg-gray-100 text-gray-700" : ""}
                      `}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="text-lg font-medium text-[#2B2B2B]">
                    {option.option_text}
                  </span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`mt-8 rounded-2xl p-5 border transition-all duration-300
      ${
        currentQuestion?.options.find(
          (option) => option.id === selectedOptionId,
        )?.is_correct
          ? "bg-green-100 border-green-500"
          : "bg-red-200 border-red-500"
      }
    `}
            >
              <p className="font-bold text-[#7B0000]">Hasil Jawaban</p>

              <div className="mt-2 flex items-center gap-2">
                {currentQuestion?.options.find(
                  (option) => option.id === selectedOptionId,
                )?.is_correct ? (
                  <>
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span className="text-green-700 font-medium">
                      Jawaban Anda Benar
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-red-600 font-bold text-lg">✕</span>
                    <span className="text-red-700 font-medium">
                      Jawaban Anda Salah
                    </span>
                  </>
                )}
              </div>

              <p className="mt-3 text-gray-800 font-semibold">
                Jawaban yang benar:
                <span className="text-[#7B0000] ml-1">
                  {correctOption?.option_text}
                </span>
              </p>
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={!showResult}
            className={`
              mt-8 w-full py-5 rounded-2xl font-semibold transition-all duration-300

              ${
                showResult
                  ? "bg-[#7B0000] hover:bg-[#5E0000] text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {currentQuestionIndex === quiz.questions.length - 1
              ? "Selesaikan Quiz"
              : "Pertanyaan Berikutnya →"}
          </button>
        </div>
      </div>
      {showFinalResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-[#2B0A0A]">
              Quiz Selesai 🎉
            </h2>

            <p className="mt-4 text-gray-600">Skor Anda:</p>

            <div className="mt-2 text-5xl font-bold text-[#7B0000]">
              {Math.round((score / totalQuestions) * 100)}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Terima kasih sudah menyelesaikan quiz
            </p>

            <button
              onClick={() => router.push("/")}
              className="cursor-pointer mt-6 w-full bg-[#7B0000] hover:bg-[#5E0000] text-white py-3 rounded-xl font-semibold transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            recycle={false}
            gravity={1.2}
            initialVelocityX={30}
            initialVelocityY={30}
            tweenDuration={100}
            confettiSource={{
              x: windowSize.width / 2,
              y: windowSize.height * 0.3,
              w: 0,
              h: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
