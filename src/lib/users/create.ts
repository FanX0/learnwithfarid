import { serviceClient } from '@/utils/supabase/serviceClient'

export async function createUser(
    currentUserId: string,
    email: string,
    name: string,
    role: string,
    password?: string
) {
    // 1. Validasi super_admin
    const { data: cp, error: cpErr } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single()
    if (cpErr || cp?.role !== 'super_admin') {
        throw new Error('Akses ditolak: hanya super_admin yang diizinkan')
    }

    // 2. Buat user di auth
    const params: any = { email }
    if (password) params.password = password
    const { data: authRes, error: authErr } = await serviceClient.auth.admin.createUser({
        ...params,
        email_confirm: true
    })
    if (authErr || !authRes.user) {
        console.error('Error createUser auth:', authErr?.message)
        throw new Error('Gagal membuat akun baru')
    }
    const userId = authRes.user.id

    // 3. Tambahkan data profil
    const { data: prof, error: profErr } = await serviceClient
        .from('profiles')
        .insert({ id: userId, name, role })
        .single()
    if (profErr) {
        console.error('Error createUser profile:', profErr.message)
        throw new Error('Akun dibuat, tapi gagal simpan profil')
    }

    return { id: userId, email, name, role, created_at: authRes.user.created_at }
}
