"use client";

import AuthModal from "@/components/AuthModal";
import TypingTestCertificate from "@/components/TypingTestCertificate";
// import Certificate from "@/components/Certificate";
import { TypingTestCertificateResponse } from "@/types/GlobalTypes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TypingTestCertificatePage() {
  // const { data: session, status } = useSession();
  const { data: session } = useSession();
  const user = session?.user;
  const [certificate, setCertificate] =
    useState<TypingTestCertificateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `/api/typing-test/certificate?userId=${user?.id}`
        );
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to fetch certificate");

        setCertificate(data.typingTestCertificate);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AuthModal type={"signin"} />;
      </div>
    );
  }

  // if (status === "loading") return null;
  if (loading) return <p className="text-center mt-10">Loading Certificate</p>;
  if (!certificate) return <p className="text-center mt-10">No Certificate</p>;

  // TODO: Conditional render TypingTestCertificate or
  // Certificate (for the course completion)

  return (
    <TypingTestCertificate
      userName={certificate.user.username}
      completionDate={new Date(certificate.issuedDate).toLocaleDateString()}
      wpm={certificate.wpm}
      accuracy={certificate.accuracy}
      isPaid={true}
    />
  );
}
