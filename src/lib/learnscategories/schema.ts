import { z } from 'zod'

export const learnCategorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi'),
})

export type LearnCategoryForm = z.infer<typeof learnCategorySchema>
