'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { fetchLearnsCategoryById } from '@/lib/learnscategories/fetchById'
import { updateLearnsCategoryById } from '@/lib/learnscategories/updateById'
import { InputField } from '@/components/InputField'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    name: z
        .string()
        .min(2, { message: 'Nama kategori minimal terdiri dari 2 huruf.' })
        .nonempty({ message: 'Nama kategori wajib diisi.' }),
})

type FormData = z.infer<typeof schema>

export default function EditLearnsCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: '' },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchLearnsCategoryById(id)
                setValue('name', data.name)
            } catch (err) {
                toast.error('Gagal mengambil data kategori.')
            }
        }

        if (id) fetchData()
    }, [id, setValue])

    const onSubmit = async (data: FormData) => {
        try {
            await updateLearnsCategoryById(id, { name: data.name.trim() })
            toast.success('Kategori berhasil diperbarui.')
            router.push('/dashboard/learnscategories')
        } catch (err) {
            console.error('Update error:', err)
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Edit Learn Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="name"
                    name="name"
                    label="Name"
                    registration={register('name')}
                    error={errors.name?.message}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded text-white ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}
