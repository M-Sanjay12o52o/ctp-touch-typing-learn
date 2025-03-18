import LearnInput from '@/components/LearnInput'
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function LearnPage() {
    const session = await getServerSession(options)

    if (!session) {
        redirect('/signup?callbackUrl=/learn')
    }

    return <div>
        <LearnInput user={session?.user} />
    </div>
}

