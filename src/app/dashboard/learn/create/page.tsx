'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

import { InputField } from '@/components/InputField'
import { TextareaField } from '@/components/TextareaField'
import { SelectField } from '@/components/SelectField'
import { createLearns } from '@/lib/learns/create'
import { fetchAllLearnsCategories } from '@/lib/learnscategories/fetchAll'
import { createMultipleLearnSchema, CreateMultipleLearnFormData } from '@/lib/learns/schema'
import { ILearnsCategories } from '@/types/learnscategories'

export default function CreateMultipleLearnPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<ILearnsCategories[]>([])

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateMultipleLearnFormData>({
        resolver: zodResolver(createMultipleLearnSchema),
        defaultValues: {
            learns: [{ name: '', description: '', category_id: '', image_path: undefined }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'learns',
    })

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAllLearnsCategories()
                setCategories(data)
            } catch (err) {
                toast.error('Gagal memuat kategori')
            }
        }
        load()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue(`learns.${index}.image_path`, file, { shouldValidate: true })
        }
    }

    const onSubmit = async (data: CreateMultipleLearnFormData) => {
        try {
            for (const learn of data.learns) {
                const formData = new FormData()
                formData.append('name', learn.name)
                formData.append('description', learn.description)
                formData.append('category_id', learn.category_id)
                formData.append('image_path', learn.image_path)
                await createLearns(formData)
            }

            toast.success('Semua data Learn berhasil dibuat.')
            reset()
            router.push('/dashboard/learn')
        } catch (err) {
            console.error('Gagal submit:', err)
            toast.error('Gagal membuat data. Coba lagi nanti.')
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Create Multiple Learn</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 border p-4 rounded">
                        <InputField
                            id={`learns.${index}.name`}
                            label="Name"
                            required
                            error={errors.learns?.[index]?.name?.message}
                            {...register(`learns.${index}.name`)}
                        />
                        <TextareaField
                            id={`learns.${index}.description`}
                            label="Description"
                            required
                            error={errors.learns?.[index]?.description?.message}
                            {...register(`learns.${index}.description`)}
                        />
                        <SelectField
                            id={`learns.${index}.category_id`}
                            label="Category"
                            required
                            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                            error={errors.learns?.[index]?.category_id?.message}
                            {...register(`learns.${index}.category_id`)}
                        />
                        <InputField
                            id={`learns.${index}.image_path`}
                            label="Image"
                            type="file"
                            required
                            error={errors.learns?.[index]?.image_path?.message}
                            onChange={(e) => handleFileChange(e, index)}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 text-sm"
                        >
                            Hapus
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ name: '', description: '', category_id: '', image_path: undefined })}
                    className="text-sm text-blue-600 hover:underline"
                >
                    + Tambah Learn
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Mengirim...' : 'Submit Semua'}
                </button>
            </form>
        </div>
    )
}