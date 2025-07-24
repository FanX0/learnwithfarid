import { serviceClient } from '@/utils/supabase/serviceClient'

export async function fetchUserById(currentUserId: string, targetUserId: string) {
    // 1. Validasi role current user (harus super_admin)
    const { data: cp, error: cpErr } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single()

    if (cpErr || cp?.role !== 'super_admin') {
        throw new Error('Akses ditolak: hanya super_admin yang diizinkan')
    }

    // 2. Ambil semua auth users
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

    // 4. Temukan user dan profil berdasarkan targetUserId
    const authUser = authUsersRes.users.find(u => u.id === targetUserId)
    const profile = profiles.find(p => p.id === targetUserId)

    if (!authUser || !profile) {
        throw new Error('Pengguna tidak ditemukan')
    }

    return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        profile: {
            name: profile.name,
            role: profile.role,
            updated_at: profile.updated_at
        }
    }
}
