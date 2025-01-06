import Keyboard from '@/components/LearnInput'
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Navbar from '@/components/Navbar'

export default async function LearnPage() {
    const session = await getServerSession(options)

    if (!session) {
        redirect('/signup?callbackUrl=/learn')
    }

    return <div>
        <section className="flex flex-col gap-6">
            <Navbar user={session?.user} pagetype={"Server"} />
        </section>
        <Keyboard lessonId={1} />
    </div>
}

