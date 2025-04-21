"use client";

import Certificate from "@/components/Certificate";
import CompletePage from "@/components/Complete";
import { useEffect, useState } from "react";

export default function Page() {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const res = await fetch("/api/progress/completion", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setIsCompleted(false);
          return;
        }

        const data = await res.json();
        setIsCompleted(data.isCompleted);
      } catch (err) {
        console.error("Error checking completion:", err);
        setIsCompleted(false);
      }
    };

    checkCompletion();
  }, []);

  if (isCompleted == null) {
    return <div className="mt-12">Checking Progress....</div>;
  }

  return (
    <div className="mt-12">
      {/* <CompletePage isCompleted={false} /> */}
      {/* TODO: Fetch attributes from backend */}
      {isCompleted && (
        <Certificate
          userName="M Sanjay Achar"
          completionDate="March 20, 2025"
          blurred={true}
        />
      )}
      <CompletePage isCompleted={isCompleted} />
    </div>
  );
}
