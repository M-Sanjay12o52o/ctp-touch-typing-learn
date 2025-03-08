import { db } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { lessonId: string; exercisesId: string } }
) {
    const { lessonId, exercisesId } = params;

    console.log("lessonId: ", lessonId, "exercisesId: ", exercisesId);

    // exerciseId from string to number
    const exerciseIdNum = parseInt(exercisesId, 10);

    const lesson = await db.lesson.findUnique({
        where: { id: parseInt(lessonId, 10) },
        include: {
            exercises: true // Fetch all exercises related to this lesson
        }
    });

    if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // const exerciseIndex = lesson.exercises[parseInt(exerciseId, 10)]?.id; // Get exercise ID based on the index

    if (!exerciseIdNum) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const exercise = await db.exercise.findUnique({
        where: { id: exerciseIdNum }
    });

    if (!exercise) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    return NextResponse.json(exercise); // Send back the specific exercise
}
