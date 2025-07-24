import { serviceClient } from '@/utils/supabase/serviceClient'

export async function updateUserById(
    currentUserId: string,
    targetUserId: string,
    updates: Partial<{ name: string; role: string }>
) {
    // 1. Validasi: user yang meminta harus super_admin
    const { data: currentProfile, error: cpError } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single()
    if (cpError || currentProfile?.role !== 'super_admin') {
        throw new Error('Akses ditolak: hanya super_admin yang diizinkan')
    }

    // 2. Validasi: pastikan targetUserId valid
    const { data: targetProfile, error: tpError } = await serviceClient
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()
    if (tpError || !targetProfile) {
        throw new Error('Profil pengguna tidak ditemukan')
    }

    // 3. Update field (hanya kolom yang disediakan)
    const { data: updated, error: updError } = await serviceClient
        .from('profiles')
        .update(updates)
        .eq('id', targetUserId)
        .select('*')
    if (updError) {
        console.error('Error update profile:', updError.message)
        throw new Error('Gagal memperbarui profil pengguna')
    }

    return updated[0]
}
