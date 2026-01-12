"use client"; // Wajib: Menandakan ini adalah Client Component

import { useState, useEffect, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Award,
    Timer,
    AlertCircle,
    List,
    ArrowRight,
} from "lucide-react";
import { sessionsData } from "@/lib/examQuestion";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QuizTypes } from "../../../../../../../prisma/generated/prisma/enums";
import type { User } from "../../../../../../../prisma/generated/prisma/client";
import { Input, Label } from "@heroui/react";

// Menerima prop 'user' yang dikirim dari Server Component (ExamPage)
export default function ExamClient({ user }: { user: User }) {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    // State Global
    const [activeSession, setActiveSession] = useState<1 | 2 | 3>(1); // 1: Fisika, 2: MTK, 3: Esai

    // Current Session Data
    const currentSessionData = sessionsData[activeSession];
    const quizQuestions = currentSessionData.questions;

    // --- 2. State Kuis ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(
        Array(quizQuestions.length).fill(null),
    );
    const [showScore, setShowScore] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [essayAnswer, setEssayAnswer] = useState<string | null>(null);
    const [essayAnswerFileUrl, setEssayAnswerFileUrl] = useState<string | null>(
        null,
    );
    const [essayAnswerFileKey, setEssayAnswerFileKey] = useState<string | null>(
        null,
    );

    const INITIAL_TIME = 3 * 60 * 60; // 3 Hours
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

    const submitExamMutation = useMutation({
        ...trpc.stemExam.submitExam.mutationOptions(),
        onMutate: () => {
            setIsLoading(true);
            toast.loading("Submitting...", {
                id: "submit-exam",
            });
        },
        onSuccess: () => {
            setIsLoading(false);
            toast.dismiss("submit-exam");
            toast.success(`Submitted Answers Successfully`);
        },
        onError: (error) => {
            setIsLoading(false);
            toast.dismiss("submit-exam");
            toast.error("Failed to submit exam", {
                description: error.message,
            });
            console.log(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: trpc.stemExam.submitExam.mutationKey(),
            });
        },
    });

    const handleNextSession = useCallback(() => {
        if (activeSession < 3) {
            const nextSession = (activeSession + 1) as 1 | 2 | 3;

            // Ambil data soal untuk sesi berikutnya untuk reset jawaban
            const nextQuestions = sessionsData[nextSession]?.questions || [];

            // PENTING: Reset semua state SECARA EKSPLISIT agar tidak lompat
            setShowScore(false); // Sembunyikan layar skor
            setFinalScore(0); // Reset skor
            setCurrentQuestionIndex(0); // Balik ke soal no 1
            setTimeLeft(INITIAL_TIME); // Reset waktu
            setUserAnswers(Array(nextQuestions.length).fill(null)); // Kosongkan jawaban

            // Ubah sesi terakhir
            setActiveSession(nextSession);
        } else {
            router.push("/dashboard");
        }
    }, [activeSession, router, INITIAL_TIME]);

    const handleSubmitQuiz = useCallback(async () => {
        if (isSaving || !user) return;
        setIsSaving(true);
        let calculatedScore = 0;
        quizQuestions.forEach((question, index) => {
            const selectedIndex = userAnswers[index];
            if (
                selectedIndex !== null &&
                question.answerOptions[selectedIndex]?.isCorrect
            ) {
                calculatedScore += 1;
            }
        });
        const submissionData = {
            userId: user.id as string,
            score: calculatedScore,
            totalQuestions: quizQuestions.length,
            timeSpent: INITIAL_TIME - timeLeft,
            answers: userAnswers.map((answer) =>
                answer !== null ? Number(answer) : null,
            ),
            type: currentSessionData.subject as QuizTypes,
            essayAnswer: essayAnswer ?? undefined,
            essayAnswerFileUrl: essayAnswerFileUrl ?? undefined,
            essayAnswerFileKey: essayAnswerFileKey ?? undefined,
        };
        submitExamMutation.mutate(submissionData, {
            onError(error) {
                toast.error("Failed to submit exam", {
                    description: error.message,
                });
            },
            onSuccess: () => {
                setFinalScore(calculatedScore);
                setShowScore(true);
            },
            onSettled: () => {
                setIsSaving(false);
            },
        });
    }, [
        isSaving,
        user,
        userAnswers,
        quizQuestions,
        currentSessionData,
        submitExamMutation,
        timeLeft,
        essayAnswerFileUrl,
        essayAnswerFileKey,
        INITIAL_TIME,
        essayAnswer,
    ]);

    // --- 3. Logika Timer ---
    useEffect(() => {
        // Hentikan timer jika skor sudah muncul (kuis selesai)
        if (showScore) return;

        // Auto-submit jika waktu habis
        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [showScore, timeLeft, handleSubmitQuiz]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // --- 4. Logika Navigasi & Jawaban ---
    const answeredCount = userAnswers.filter(
        (answer) => answer !== null,
    ).length;

    const handleAnswerSelection = (answerOptionIndex: number): void => {
        const newAnswers: (number | null)[] = [...userAnswers];
        newAnswers[currentQuestionIndex] = answerOptionIndex;
        setUserAnswers(newAnswers);
    };

    const jumpToQuestion = (index: number) => setCurrentQuestionIndex(index);
    const goToNext = () =>
        currentQuestionIndex < quizQuestions.length - 1 &&
        setCurrentQuestionIndex((prev) => prev + 1);
    const goToPrev = () =>
        currentQuestionIndex > 0 && setCurrentQuestionIndex((prev) => prev - 1);

    // --- 6. Tampilan (Render) ---
    return (
        <div className="min-h-screen bg-transparent backdrop-blur-lg flex items-start justify-center p-0 lg:p-8 font-sans">
            <div className="w-full max-w-full lg:max-w-7xl bg-transparent shadow-2xl lg:rounded-2xl border border-slate-200 min-h-screen lg:min-h-0 overflow-hidden flex flex-col lg:flex-row mx-auto">
                {/* --- Sidebar Kiri (Navigasi) --- */}
                {!showScore && (
                    <div className="lg:w-80 bg-slate-900 text-white p-6 flex flex-col shrink-0 border-r border-slate-800">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-black tracking-tight leading-none">
                                    STEM Preliminary
                                </h1>
                                {/* Menampilkan nama user dari prop */}
                                <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 tracking-widest truncate">
                                    {user?.name}
                                </p>
                                <p className="text-lg font-black tracking-tight leading-loose">
                                    {currentSessionData.subject}
                                </p>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <div
                            className={`mb-8 p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                                timeLeft < 60
                                    ? "bg-red-500/10 border-red-500 animate-pulse"
                                    : "bg-white/5 border-white/10"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Timer
                                    className={`w-5 h-5 ${
                                        timeLeft < 60
                                            ? "text-red-400"
                                            : "text-blue-400"
                                    }`}
                                />
                                <span
                                    className={`text-2xl font-mono font-bold tracking-tighter ${
                                        timeLeft < 60
                                            ? "text-red-400"
                                            : "text-slate-100"
                                    }`}
                                >
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            {timeLeft < 60 && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>

                        {/* Grid Navigasi */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                                    Question List
                                </h3>
                                <List className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {quizQuestions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => jumpToQuestion(index)}
                                        className={`h-10 rounded-lg font-bold text-sm transition-all ${
                                            index === currentQuestionIndex
                                                ? "bg-blue-600 text-white shadow-lg scale-105 z-10"
                                                : userAnswers[index] !== null
                                                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                                                  : "bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Area Konten Utama --- */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Tampilan Skor Akhir */}
                    {showScore ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 animate-in fade-in duration-500 w-full h-full min-h-screen lg:min-h-[600px]">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full">
                                <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
                                    <Award className="w-16 h-16 text-green-600" />
                                </div>

                                <h2 className="text-3xl font-black text-slate-900 mb-2">
                                    {activeSession === 3
                                        ? "Exam Completed!"
                                        : `Session ${currentSessionData.subject} Completed!`}
                                </h2>
                                <p className="text-slate-500 mb-8 font-medium">
                                    Answer for{" "}
                                    <strong>
                                        {currentSessionData.subject}
                                    </strong>{" "}
                                    has been saved.
                                </p>

                                {activeSession == 3 ? (
                                    <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            This session is being graded
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Score for this session
                                        </p>
                                        <p className="text-6xl font-black text-blue-600">
                                            {finalScore}{" "}
                                            <span className="text-2xl text-slate-300 font-medium">
                                                / {quizQuestions.length}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleNextSession}
                                    className={`w-full py-4 text-white rounded-xl font-bold transition shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2
                                    ${
                                        activeSession === 3
                                            ? "bg-slate-900 hover:bg-slate-800"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }
                                `}
                                >
                                    {activeSession === 3 ? (
                                        <>
                                            Finish & Go to Dashboard{" "}
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    ) : (
                                        <>
                                            Go to Session {activeSession + 1}{" "}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Soal Aktif */
                        <div className="flex-1 flex flex-col p-6 lg:p-16 max-w-4xl mx-auto w-full animate-in slide-in-from-right-4 duration-300">
                            <div className="mb-10 flex justify-between items-center border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                                        Question {currentQuestionIndex + 1} of{" "}
                                        {quizQuestions.length}
                                    </p>
                                    <h2 className="text-2xl font-black text-slate-800">
                                        Question {currentQuestionIndex + 1}
                                    </h2>
                                </div>
                                {userAnswers[currentQuestionIndex] !== null && (
                                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" />{" "}
                                        Answered
                                    </span>
                                )}
                            </div>
                            <div className="mb-10">
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                                    {
                                        quizQuestions[currentQuestionIndex]
                                            ?.questionText
                                    }
                                </h3>
                            </div>
                            {/* Opsi Jawaban */}
                            {activeSession === 3 ? (
                                <div className="space-y-4 mb-12 flex-1">
                                    <p className="text-slate-500 italic">
                                        Please write your final answer below.
                                    </p>
                                    <div className="flex flex-col">
                                        <Label
                                            htmlFor="essay-final-answer"
                                            className="mb-2 text-black"
                                        >
                                            Final Answer
                                        </Label>
                                        <Input
                                            id="essay-final-answer"
                                            placeholder="Write your final answer here"
                                            type="text"
                                            className={
                                                "bg-slate-400 text-slate-900"
                                            }
                                            value={essayAnswer ?? ""}
                                            onChange={(e) => {
                                                setEssayAnswer(e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                setEssayAnswer(
                                                    e.target.value.trim(),
                                                );
                                                toast.success(
                                                    "Final Answer saved!",
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 mb-12 flex-1">
                                    {quizQuestions[
                                        currentQuestionIndex
                                    ]?.answerOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleAnswerSelection(index)
                                            }
                                            className={`w-full group text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-5
                                            ${
                                                userAnswers[
                                                    currentQuestionIndex
                                                ] === index
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 transform scale-[1.01]"
                                                    : "bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50"
                                            }`}
                                        >
                                            <span
                                                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all
                                            ${
                                                userAnswers[
                                                    currentQuestionIndex
                                                ] === index
                                                    ? "bg-white/20 border-white/20 text-white"
                                                    : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500"
                                            }`}
                                            >
                                                {String.fromCharCode(
                                                    65 + index,
                                                )}
                                            </span>
                                            <span className="text-lg font-bold">
                                                {option.answerText}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            ;
                            <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center">
                                <button
                                    onClick={goToPrev}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Back</span>
                                </button>

                                {currentQuestionIndex <
                                quizQuestions.length - 1 ? (
                                    <button
                                        onClick={goToNext}
                                        className="flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:translate-x-1"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="flex flex-col justify-center items-center">
                                        <span
                                            className="text-base text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg cursor-pointer"
                                            onClick={handleSubmitQuiz}
                                        >
                                            Submit Now
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
