import { z } from "zod"

const singleLearnSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 huruf"),
    description: z.string().min(2, "Deskripsi minimal 2 huruf"),
    category_id: z.string().min(1, "Kategori wajib dipilih"),
    image_path: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Gambar wajib diunggah" }),
})

export const createMultipleLearnSchema = z.object({
    learns: z.array(singleLearnSchema).min(1, "Minimal 1 data harus diisi"),
})

export type CreateMultipleLearnFormData = z.infer<typeof createMultipleLearnSchema>
