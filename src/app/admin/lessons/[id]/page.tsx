"use client"

// app/admin/lessons/[id]/page.tsx
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, Exercise } from "@prisma/client";
import { useParams } from "next/navigation";

export default async function LessonDetails({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        if (!id) return; // Wait for the `id` to be available

        const getLessonDetails = async () => {
            const response = await fetch(`/api/lessons/${id}`);
            const lessonData = await response.json();
            setLesson(lessonData.lesson);
            setExercises(lessonData.exercises);
        };

        getLessonDetails();
    }, [id]);

    if (!lesson) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            {/* <p>{lesson.desciption}</p> */}

            <h2 className="text-2xl font-bold mt-4">Exercises</h2>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.id} className="p-2">
                        <strong>Exercise {exercise.index + 1}:</strong> {exercise.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

