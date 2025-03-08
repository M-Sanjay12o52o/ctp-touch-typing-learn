"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<String | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch("/api/userid");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserId(data.userId);
            } catch (error) {
                setError((error as Error).message);
            }
        }

        fetchUserId();
    }, [])

    return (
        <div>
            <h1>User ID</h1>
            {error ? <p>Error: {error}</p> : <p>{userId ? `User ID: ${userId}` : "Loading..."}</p>}
            <h1>User ID from useSession()</h1>
            {error ? <p>Error: {error}</p> : <p>{session?.user ? `User ID: ${session?.user.id}` : "Loading..."}</p>}
            {error ? <p>Error: {error}</p> : <p>{session?.user ? `User ID: ${session?.user.email}` : "Loading..."}</p>}
            {error ? <p>Error: {error}</p> : <p>{session?.user ? `User ID: ${session?.user.name}` : "Loading..."}</p>}
        </div>
    )
}

export default Page;