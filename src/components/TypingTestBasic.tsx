"use client";

import { useEffect, useRef, useState } from "react";
import { lorem } from "../helpers/paragraph";
import Image from "next/image";
import { checkWpm } from "../helpers/wpm";
import { useSession } from "next-auth/react";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { TypingTestResponse } from "@/types/GlobalTypes";


const TypingTestBasic = () => {
    const originalText = lorem;
    const [userInput, setUserInput] = useState("");
    const [currentError, setCurrentError] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number>(60);
    const [timeLeft, setTimeLeft] = useState<number>(selectedTime);
    const [timerStarted, setTimerStarted] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [wpmScore, setWpmScore] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [correctKeyStrokes, setCorrectKeystrokes] = useState(0);
    const [incorrectKeyStrokes, setIncorrectKeystrokes] = useState(0);
    const [textSize, setTextSize] = useState<number>(2);
    const sentenceRef = useRef<HTMLDivElement | null>(null);
    const currentCharRef = useRef<HTMLSpanElement | null>(null);
    const { data: session } = useSession();
    const user = session?.user;
    const [typingTestResults, setTypingTestResults] = useState<TypingTestResponse | null>(null);
    const [error, setError] = useState<string>("");

    // TODO: Use this error in the component
    console.log("error: ", error)

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(parseInt(event.target.value, 10));
    };

    useEffect(() => {
        if (!user?.id) return;

        const fetchWpm = async () => {
            try {
                const response = await fetch(`/api/wpm?userId=${user.id}`);
                if (!response.ok) throw new Error("Failed to fetch WPM results.");
                setTypingTestResults(await response.json());
            } catch (error) {
                setError((error as Error).message);
            }
        };

        fetchWpm();
    }, [user?.id])

    useEffect(() => {
        currentCharRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [userInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!timerStarted) {
            setTimerStarted(true);
            setTimeLeft(selectedTime);
        }
        if (isDisabled) return;

        const value = e.target.value;
        const normalizedOriginal = originalText.trim();

        const newCharIndex = value.length - 1;
        if (newCharIndex >= 0) {
            if (value[newCharIndex] === normalizedOriginal[newCharIndex]) {
                setCorrectKeystrokes(prev => prev + 1);
            } else {
                setIncorrectKeystrokes(prev => prev + 1);
            }
        }

        if (normalizedOriginal.startsWith(value)) {
            setCurrentError(false);
        } else {
            setCurrentError(true);
        }

        setUserInput(value);
    };

    const calculateAccuracy = () => {
        const totalKeystrokes = correctKeyStrokes + incorrectKeyStrokes;
        const calculateAccuracy = totalKeystrokes > 0 ? Math.round((correctKeyStrokes / totalKeystrokes) * 100) : 0;
        setAccuracy(calculateAccuracy);
        return calculateAccuracy;
    }

    const calculateWPM = () => {
        const wordsPerMinute = checkWpm(userInput.length, 1);
        setWpmScore(wordsPerMinute);
        calculateAccuracy();
    };

    const restartTest = () => {
        setUserInput("");
        setCurrentError(false);
        setTimeLeft(selectedTime);
        setTimerStarted(false);
        setIsDisabled(false);
        setWpmScore(0);
        setAccuracy(0);
        setCorrectKeystrokes(0);
        setIncorrectKeystrokes(0);

        if (sentenceRef.current) {
            sentenceRef.current.scrollTo({ top: 0, behavior: "instant" });
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTextSize = parseInt(event.target.value, 10);
        setTextSize(newTextSize);
    };

    const saveWpmScore = async (wordsPerMinute: number, accuracy: number) => {
        try {
            const userId = user?.id;

            const response = await fetch("/api/wpm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    wpm: wordsPerMinute,
                    accuracy: accuracy,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Typing test result saved successfully: ", result);
            } else {
                const errorData = await response.json();
                console.error("Error saving typing test result: ", errorData.error);
            }
        } catch (error) {
            console.error("Error making request: ", error);
        }
    };

    useEffect(() => {
        if (isDisabled) {
            saveWpmScore(wpmScore, accuracy);
        }
    }, [wpmScore, accuracy, isDisabled]);

    useEffect(() => {
        if (!timerStarted) return;

        if (timeLeft <= 0) {
            calculateWPM();
            setIsDisabled(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timerStarted, timeLeft]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-white px-6 py-10">
            {/* Content container with conditional blur */}
            <div className={`w-full max-w-3xl transition-all duration-300 ${isDisabled ? "blur-sm" : ""}`}>
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 text-center -mt-4 tracking-tight leading-tight drop-shadow-md">
                    Test Your <span className="text-blue-600">Typing Speed</span>
                </h1>
                <p className="text-gray-700 text-center text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                    Sharpen your typing skills, boost your speed, and enhance your accuracy with real-time feedback!
                </p>

                {/* Timer and Controls */}
                <div className="bg-white p-5 rounded-xl shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <Image src="/timer.svg" alt="Timer" width={32} height={32} />
                        <select
                            value={selectedTime}
                            onChange={handleTimeChange}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={timerStarted}
                        >
                            <option value={60}>60s</option>
                            <option value={300}>5 Mins</option>
                        </select>
                        <div className="font-semibold">
                            Time: <span className="text-red-500 font-bold">{timeLeft}s</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 font-semibold text-xl">
                        <button
                            onClick={restartTest}
                            className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                        WPM: <span className="text-green-600">{wpmScore}</span>
                        HIGHEST WPM: <span className="text-green-600">{typingTestResults?.highestWpm.wpm || 0}</span>
                    </div>
                </div>

                {/* Text Size Control */}
                <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-sm text-gray-600">Text Size:</span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">Smaller</span>
                        <input
                            type="range"
                            min={2}
                            max={5}
                            value={textSize}
                            onChange={handleSliderChange}
                            className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Larger</span>
                    </div>
                </div>

                {/* Typing Content Box */}
                <div
                    ref={sentenceRef}
                    className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 overflow-y-auto h-64 mb-6 text-lg leading-relaxed tracking-wide"
                >
                    <p className={`text-${textSize}xl text-gray-800`}>
                        {/* Typed characters */}
                        <span className="text-gray-400">{originalText.slice(0, userInput.length)}</span>
                        {/* Current character with ref */}
                        <span
                            ref={currentCharRef}
                            className={`font-bold underline px-1 rounded ${currentError ? "text-red-600 bg-red-100" : "text-blue-600 bg-blue-100"
                                }`}
                        >
                            {originalText.charAt(userInput.length)}
                        </span>
                        {/* Remaining characters */}
                        <span>{originalText.slice(userInput.length + 1)}</span>
                    </p>
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    disabled={isDisabled}
                    className={`w-full px-5 py-3 text-lg border-2 rounded-lg focus:outline-none transition-shadow ${currentError
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
                        : "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                        }`}
                    placeholder={isDisabled ? "Test Over! Press Restart to try again." : "Start typing here..."}
                    autoFocus
                />

                {/* Helper text */}
                <p className="text-gray-600 text-sm mt-3 text-center">
                    Start typing to begin the test!
                </p>
            </div>

            {/* WPM Results Overlay */}
            {isDisabled && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-96 border border-gray-200">
                        <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm">
                                Test Complete
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Speed</h2>
                        <div className="text-5xl font-extrabold text-blue-600 mb-5">
                            {wpmScore} <span className="text-lg text-gray-500">WPM</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-5">
                            {accuracy}% <span className="text-lg text-gray-500">Accuracy</span>
                        </div>
                        {!user && (
                            <>
                                <p className="text-gray-600 text-sm mb-5">
                                    Create an account to save your results and track your progress!
                                </p>
                                <Link
                                    href={"/signup"}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                                >
                                    <span>Sign Up</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <br />
                            </>
                        )}
                        <button
                            onClick={restartTest}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:scale-105"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TypingTestBasic;
