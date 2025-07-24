import { createClient } from '@/utils/supabase/client'

export async function createLearns(formData: FormData) {
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

    if (!file || file.size === 0) {
        throw new Error('Image is required')
    }

    const fileName = `${Date.now()}-${file.name}`

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase
        .storage
        .from('learn') // bucket name
        .upload(fileName, file)

    if (uploadError) {
        throw new Error('Failed to upload image: ' + uploadError.message)
    }

    // Simpan ke database
    const { data, error } = await supabase
        .from('learns')
        .insert([
            {
                name,
                description,
                category_id: category_id,
                image_path: fileName,
                user_id,
            },
        ])
        .select()
        .single()

    if (error) throw error

    return data
}
