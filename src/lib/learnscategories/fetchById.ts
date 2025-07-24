'use client'

import { createClient } from '@/utils/supabase/client'

export async function fetchLearnsCategoryById(id: string) {
    const supabase = createClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new Error('User not authenticated')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profileError || !profile) {
        throw new Error('Failed to fetch user profile')
    }

    let query = supabase
        .from('learns_categories')
        .select('*')
        .eq('id', id)

    if (profile.role !== 'super_admin') {
        query = query.eq('user_id', user.id)
    }

    const { data, error } = await query.single()
    if (error) throw error

    return data
}
