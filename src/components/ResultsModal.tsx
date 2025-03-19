import Image from "next/image";
import React from "react"

type ResultsModalProps = {
    wpm: number;
    typos: number;
    onTryAgain: () => void;
    onNext: () => void;
    speed: boolean;
    accuracy: boolean;
    lessThenTwoTypos: boolean;
}

export default function ResultsModal({ wpm, typos, onTryAgain, onNext, speed, accuracy, lessThenTwoTypos }: ResultsModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md text-center border-2 border-gray-200">
                {/* Header */}
                <h2 className="text-3xl font-extrabold text-gray-800">Exercise Finished!</h2>
                <p className="text-xl text-gray-600 mt-2">{wpm} wpm, {typos} typos</p>

                {/* Achievements */}
                <div className="flex justify-center space-x-6 mt-6">
                    <div className="flex flex-col items-center">
                        <Image src={`${lessThenTwoTypos ? "/star_gold.svg" : "/star_gray.svg"}`} alt="star" width={100} height={100} />
                        <p className="text-green-500 text-sm font-semibold">less than 2 typos</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image src={`${accuracy ? "/bullseye_gold.svg" : "/bullseye_gray.svg"}`} alt="smile" width={100} height={100} />
                        <p className="text-orange-500 text-sm font-semibold">exercise without typos</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image src={`${speed ? "/thunder_gold.svg" : "/thunder_gray.svg"}`} alt="bolt" width={100} height={100} />
                        <p className="text-purple-500 text-sm font-semibold">speed more than 28 WPM</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={onTryAgain}
                        className="px-6 py-2 text-lg font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                    >
                        Try again
                    </button>
                    {
                        speed || accuracy || lessThenTwoTypos ? (
                            <button
                                onClick={onNext}
                                className="px-6 py-2 text-lg font-semibold text-white bg-yellow-400 border-2 border-yellow-500 rounded-lg hover:bg-yellow-500 transition-all shadow-md"
                            >
                                Next
                            </button>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
        </div>
    )
}