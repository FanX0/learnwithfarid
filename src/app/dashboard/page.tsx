import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    return (
        <div className=" bg-blue-500" >
            <p>Hello {data.user.email}</p>
            <LogoutButton />
            <p>Welcome to your dashboard</p>
            <p>You can do stuff here</p>
            <p>Like add courses</p>
            <p>Or add lessons</p>
            <p>Or add quizzes</p>
        </div>



    )
}