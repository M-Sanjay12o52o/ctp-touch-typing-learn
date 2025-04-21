"use client";

import {
  ExerciseProgress,
  Progress as ProgressType,
} from "@/types/GlobalTypes";
import Link from "next/link";
import { useEffect, useState } from "react";

type Exercise = {
  id: string;
  lessonId: number;
  index: number;
  content: string;
};

const Progress = () => {
  const [progress, setProgress] = useState<ProgressType[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/userid");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        if (!data.userId) throw new Error("User ID not found");
        setUserId(data.userId);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/progress?userId=${userId}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        const progressData: ProgressType[] = data.progress || [];
        setProgress(progressData);

        const allExercises: Exercise[] = [];

        progressData.forEach((item) => {
          const lessonId = item.lesson.id;
          item.exercisesCompleted.forEach((exercise: ExerciseProgress) => {
            const exerciseIndex = exercise.exerciseId;
            allExercises.push({
              id: `${lessonId}-${exerciseIndex}`,
              lessonId: lessonId,
              index: exerciseIndex - 1,
              content: `Exercise ${exerciseIndex}`,
            });
          });

          for (let i = 1; i <= 6; i++) {
            // if (!item.exercisesCompleted.includes(i)) {
            if (item.exercisesCompleted.some((e) => e.exerciseId === i)) {
              allExercises.push({
                id: `${lessonId}-${i}`,
                lessonId: lessonId,
                index: i - 1,
                content: `Exercise ${i}`,
              });
            }
          }
        });
        setExercises(allExercises);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p>Error: {error}</p>;

  if (progress.length === 0) {
    return (
      <div className="mt-20 text-center">
        <p className="text-gray-600">
          You haven&apos;t started any lessons yet.
        </p>
        <Link
          href="/lessons"
          className="text-blue-500 underline mt-2 inline-block"
        >
          Start Your First Lesson
        </Link>
      </div>
    );
  }

  const lessons = progress.map((item) => {
    const lessonId = item.lesson.id;
    const title = item.lesson.title;
    const completedCount = item.exercisesCompleted.length;
    const lessonExercises = exercises.filter((ex) => ex.lessonId === lessonId);
    const totalExercises = 7; // Ideally fetched from backend
    const percentage = Math.round((completedCount / totalExercises) * 100);

    return {
      lessonId,
      title,
      totalExercises,
      completedCount,
      percentage,
      exercises: lessonExercises,
    };
  });

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Your Progress</h2>
      {lessons.map((lesson) => (
        <div
          key={lesson.lessonId}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">{lesson.title}</h3>
            <span className="text-sm text-gray-500">
              {lesson.percentage}% Completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${lesson.percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: lesson.totalExercises }, (_, i) => i + 1).map(
              (exerciseNum) => {
                const progressEntry = progress.find(
                  (p) => p.lesson.id === lesson.lessonId,
                );
                const isCompleted = progressEntry?.exercisesCompleted.some(
                  (e) => e.exerciseId === exerciseNum,
                );

                return (
                  <div
                    key={`${lesson.lessonId}-${exerciseNum}`}
                    className="flex flex-col items-center p-2 border rounded-md"
                  >
                    {isCompleted ? (
                      <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        ✓
                      </span>
                    ) : (
                      <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        {exerciseNum}
                      </span>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
