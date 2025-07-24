'use client'

import { createClient } from '@/utils/supabase/client'

export async function deleteLearnsById(id: string) {
    const supabase = createClient()

    // 1. Ambil user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
        throw new Error('User not authenticated')
    }
    const user = userData.user

    // 2. Ambil role profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profileError || !profile) {
        throw new Error('Failed to fetch user profile')
    }

    // 3. Ambil data image_path
    const { data: learn, error: fetchError } = await supabase
        .from('learns')
        .select('image_path')
        .eq('id', id)
        .single()

    if (fetchError || !learn) throw fetchError

    // 4. Hapus gambar jika ada
    if (learn.image_path) {
        const { error: storageError } = await supabase
            .storage
            .from('learn')
            .remove([learn.image_path])

        if (storageError) throw storageError
    }

    // 5. Bangun query delete dengan kondisi role
    let query = supabase
        .from('learns')
        .delete()
        .eq('id', id)

    if (profile.role !== 'super_admin') {
        // Hanya bisa hapus data milik sendiri
        query = query.eq('user_id', user.id)
    }

    const { error: deleteError } = await query
    if (deleteError) throw deleteError
}
