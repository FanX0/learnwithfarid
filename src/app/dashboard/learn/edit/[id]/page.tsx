'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { fetchAllLearnsCategories } from '@/lib/learnscategories/fetchAll'
import { fetchLearnById } from '@/lib/learns/fetchById'
import { updateLearnById } from '@/lib/learns/updateById'

import { InputField } from '@/components/InputField'
import { TextareaField } from '@/components/TextareaField'
import { SelectField } from '@/components/SelectField'

import { ILearnsCategories } from '@/types/learnscategories'
import { useState } from 'react'

const schema = z.object({
    name: z.string().min(2, 'Nama minimal 2 huruf'),
    description: z.string().min(2, 'Deskripsi minimal 2 huruf'),
    category_id: z.string().nonempty('Kategori wajib dipilih'),
    image_path: z.any().optional(),
})

type FormData = z.infer<typeof schema>

export default function EditLearnPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [categories, setCategories] = useState<ILearnsCategories[]>([])
    const [initialImage, setInitialImage] = useState<string>('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        const load = async () => {
            try {
                const [fetchedCategories, fetchedLearn] = await Promise.all([
                    fetchAllLearnsCategories(),
                    fetchLearnById(id),
                ])

                setCategories(fetchedCategories)
                setInitialImage(fetchedLearn.image_path)

                reset({
                    name: fetchedLearn.name,
                    description: fetchedLearn.description ?? '',
                    category_id: fetchedLearn.category_id,
                })
            } catch (err) {
                toast.error('Gagal memuat data')
                console.error(err)
            }
        }

        if (id) load()
    }, [id, reset])

    const onSubmit = async (data: FormData) => {
        const formData = new FormData()
        formData.append('name', data.name.trim())
        formData.append('description', data.description.trim())
        formData.append('category_id', data.category_id)

        const imageFile = (data.image_path as FileList)?.[0]
        if (imageFile && imageFile.size > 0) {
            formData.append('image_path', imageFile)
        }

        try {
            await updateLearnById(id, formData)
            toast.success('Data berhasil diperbarui')
            router.push('/dashboard/learn')
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Gagal memperbarui data')
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Edit Learn</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="name"
                    name="name"
                    label="Name"
                    registration={register('name')}
                    error={errors.name?.message}
                />

                <TextareaField
                    id="description"
                    name="description"
                    label="Description"
                    registration={register('description')}
                    error={errors.description?.message}
                />

                <SelectField
                    id="category_id"
                    name="category_id"
                    label="Category"
                    registration={register('category_id')}
                    error={errors.category_id?.message}
                    options={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    }))}
                />

                <div>
                    <InputField
                        id="image_path"
                        name="image_path"
                        label="Image (Kosongkan jika tidak diubah)"
                        type="file"
                        accept="image/*"
                        registration={register('image_path')}
                    />
                    {initialImage && (
                        <img
                            src={`https://legyubmobbxbsidnjirz.supabase.co/storage/v1/object/public/learn/${initialImage}`}
                            alt="Current Image"
                            className="mt-2 w-40 h-auto rounded"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded text-white ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    )
}
