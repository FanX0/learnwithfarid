import { serviceClient } from '@/utils/supabase/serviceClient'

export async function deleteUserById(currentUserId: string, targetUserId: string) {
    // 1. Validasi role current user
    const { data: cp, error: cpError } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single()
    if (cpError || cp?.role !== 'super_admin') {
        throw new Error('Akses ditolak: hanya super_admin')
    }

    // 2. Hapus user dari auth.users
    const { error: delAuthError } = await serviceClient.auth.admin.deleteUser(targetUserId)
    if (delAuthError) {
        console.error('Error deleting auth user:', delAuthError.message)
        throw new Error('Gagal menghapus pengguna (auth)')
    }

    // 3. Hapus record profile terkait
    const { error: delProfError } = await serviceClient
        .from('profiles')
        .delete()
        .eq('id', targetUserId)
    if (delProfError) {
        console.error('Error deleting profile:', delProfError.message)
        throw new Error('Pengguna terhapus dari auth, tetapi gagal hapus profil')
    }

    return true
}
