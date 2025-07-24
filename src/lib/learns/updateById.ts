import { createClient } from '@/utils/supabase/client'
import { fetchLearnById } from './fetchById'

export async function updateLearnById(id: string, formData: FormData) {
    const supabase = createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
        throw new Error('User not authenticated')
    }

    const user_id = userData.user.id

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category_id = formData.get('category_id') as string
    const file = formData.get('image_path') as File

    const updates: any = {
        name,
        description,
        category_id,
        user_id,
        updated_at: new Date().toISOString(),
    }

    if (file && file.size > 0) {
        // 1. Ambil data sebelumnya untuk dapat nama gambar lama
        const oldData = await fetchLearnById(id)
        const oldImagePath = oldData?.image_path
        console.log('Deleting file:', oldImagePath)

        const check = await supabase
            .storage
            .from('learn')
            .list('', { search: oldImagePath })

        console.log('File exists in list?:', check)

        // 2. Hapus file lama jika ada
        if (oldImagePath) {
            const { data: deleteData, error: deleteError } = await supabase
                .storage
                .from('learn')
                .remove([oldImagePath])

            console.log('Delete result:', deleteData)
            if (deleteError) {
                console.error('Failed to delete old image:', deleteError.message)
            } else if (deleteData?.length === 0) {
                console.warn('No files deleted. It may already have been deleted.')
            }
        }

        // 3. Upload gambar baru
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase
            .storage
            .from('learn')
            .upload(fileName, file)

        if (uploadError) {
            throw new Error('Failed to upload image: ' + uploadError.message)
        }

        updates.image_path = fileName
    }

    const { data, error } = await supabase
        .from('learns')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user_id)
        .select()
        .single()

    if (error) throw error

    return data
}
