import { createClient } from '@/utils/supabase/client'

export async function fetchLearnById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('learns')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    // Generate public URL
    const { data: fileUrl } = supabase
        .storage
        .from('learn')
        .getPublicUrl(data.image_path)

    return {
        ...data,
        image_url: fileUrl.publicUrl,
    }
}
