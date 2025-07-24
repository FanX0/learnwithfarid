'use client'

import { createClient } from '@/utils/supabase/client'

export async function createLearnsCategories(formData: FormData) {
    const supabase = createClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new Error('User not authenticated')
    }

    const input = Object.fromEntries(formData)
    const payload = { ...input, user_id: user.id }

    const { data, error } = await supabase
        .from('learns_categories')
        .insert([payload])
        .select()

    if (error) throw error
    return data
}
