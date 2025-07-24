'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error || !signUpData.user) {
        redirect('/error')
    }

    // Insert ke tabel profiles
    const { error: profileError } = await supabase.from('profiles').insert([
        {
            id: signUpData.user.id,
            name: name,
        },
    ])

    if (profileError) {
        console.error("Profile insert error:", profileError)
        redirect('/error') // redirect jika gagal simpan profil
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}