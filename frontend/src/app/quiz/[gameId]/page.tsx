"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import type { Quiz, QuizOption, QuizQuestion } from "@/type";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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

  async function fetchQuiz() {
    try {
      setLoading(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/quiz/${gameId}`,
        {
          method: "GET",
        },
      );

      console.log("QUIZ STATUS:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const json = await res.json();

      console.log("QUIZ RESPONSE:", json);

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
      const finalScore = Math.round((score / totalQuestions) * 100);

      alert(`Quiz selesai 🎉\n\nSkor Anda: ${finalScore}`);

      router.push("/");
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
            <div className="mt-8 bg-[#F9F5F1] border border-[#E8DDD4] rounded-2xl p-5">
              <p className="font-bold text-[#7B0000]">Hasil Jawaban</p>

              <p className="mt-2 text-gray-700">
                {currentQuestion?.options.find(
                  (option) => option.id === selectedOptionId,
                )?.is_correct
                  ? "Jawaban Anda benar 🎉"
                  : "Jawaban Anda salah"}
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
    </div>
  );
}
