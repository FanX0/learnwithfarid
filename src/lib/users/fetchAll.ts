// src/lib/users/fetchAll.ts
import { serviceClient } from '@/utils/supabase/serviceClient'

export async function fetchAllUsers(currentUserId: string) {
    console.log('Initiating fetchAllUsers with serviceClient.from:', typeof serviceClient.from)

    // 1. Validasi super_admin
    const { data: currentProfile, error: profileError } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single()

    if (profileError || !currentProfile || currentProfile.role !== 'super_admin') {
        throw new Error('Akses ditolak: hanya super_admin yang diizinkan')
    }

    // 2. Ambil email tiap user dari auth.users
    const { data: authUsersRes, error: authError } = await serviceClient.auth.admin.listUsers()
    if (authError || !authUsersRes?.users) {
        console.error('Error fetch auth users:', authError)
        throw new Error('Gagal mengambil data auth users')
    }

    // 3. Ambil semua profiles
    const { data: profiles, error: profilesError } = await serviceClient
        .from('profiles')
        .select('*')
    if (profilesError) {
        console.error('Error fetch profiles:', profilesError)
        throw new Error('Gagal mengambil data profiles')
    }

    // 4. Gabungkan berdasarkan ID
    const usersWithProfile = authUsersRes.users.map((user) => {
        const profile = profiles.find((p) => p.id === user.id) ?? { name: null, role: null }
        return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            profile,
        }
    })

    console.log('Fetched data:', usersWithProfile)
    return usersWithProfile
}
