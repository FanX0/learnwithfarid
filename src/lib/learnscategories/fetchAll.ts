'use client'

import { createClient } from '@/utils/supabase/client'
import { ILearnsCategories } from '@/types/learnscategories'

type FetchResult = {
    data: ILearnsCategories[]
    total: number
}

export async function fetchAllLearnsCategories(
    page = 1,
    limit = 10,
    search = '',
    filterUser = '',
    filterDate = ''
): Promise<FetchResult> {
    try {
        const supabase = createClient()

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('User not authenticated')

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        if (profileError || !profile) throw new Error('User profile fetch failed')

        const start = (page - 1) * limit
        const end = start + limit - 1

        let query = supabase
            .from<ILearnsCategories>('learns_categories')
            .select('*, profiles(name)', { count: 'exact' })
            .range(start, end)

        // Batasi data jika bukan super_admin
        if (profile.role !== 'super_admin') {
            query = query.eq('user_id', user.id)
        }

        // Filter nama kategori (case-insensitive)
        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        // Filter nama pembuat berdasarkan profil
        if (filterUser) {
            query = query.ilike('profiles.name', `%${filterUser}%`) // ilike on referenced table :contentReference[oaicite:0]{index=0}
        }

        // ✅ Filter berdasarkan tanggal (dengan rentang waktu agar lebih aman)
        if (filterDate) {
            const from = `${filterDate}T00:00:00`
            const to = `${filterDate}T23:59:59.999999`
            query = query.gte('created_at', from).lte('created_at', to)
        }

        const { data, error, count } = await query
        if (error) throw error

        return { data: data ?? [], total: count ?? 0 }
    } catch (err: any) {
        console.error('fetchAllLearnsCategories error:', err.message || err)
        throw err
    }
}
