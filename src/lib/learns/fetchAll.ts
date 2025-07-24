'use client'

import { createClient } from '@/utils/supabase/client'
import { ILearnWithRelations } from '@/types/learns'

export async function fetchAllLearns(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    filterUser: string = '',
    filterDate: string = '',
    filterCategory: string = ''
): Promise<{ data: ILearnWithRelations[]; total: number }> {
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

        if (profileError || !profile) throw new Error('Failed to fetch user profile')

        const start = (page - 1) * limit
        const end = start + limit - 1

        let query = supabase
            .from('learns')
            .select(`
                *,
                profiles (
                    name
                ),
                learns_categories!learns_category_id_fkey (
                    name
                )
            `, { count: 'exact' })
            .range(start, end)

        if (profile.role !== 'super_admin') {
            query = query.eq('user_id', user.id)
        }

        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        if (filterUser) {
            query = query
                .not('user_id', 'is', null)
                .ilike('profiles.name', `%${filterUser}%`)
        }

        if (filterDate) {
            const from = `${filterDate}T00:00:00`
            const to = `${filterDate}T23:59:59.999999`
            query = query.gte('created_at', from).lte('created_at', to)
        }

        if (filterCategory) {
            query = query.ilike('learns_categories.name', `%${filterCategory}%`)
        }

        const { data, error, count } = await query
        if (error || !data) throw new Error(error?.message || 'No data returned')

        const withImageUrls = await Promise.all(
            data.map(async (item: ILearnWithRelations) => {
                const path = decodeURIComponent(item.image_path || '')
                const { data: imageData } = supabase.storage.from('learn').getPublicUrl(path)

                return {
                    ...item,
                    imageUrl: imageData?.publicUrl || null,
                }
            })
        )

        return {
            data: withImageUrls,
            total: count ?? 0,
        }
    } catch (error) {
        console.error('fetchAllLearns error:', error)
        throw error
    }
}
