'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { learnCategorySchema, LearnCategoryInput } from '@/lib/learnscategories/schema'
import { createLearnsCategories } from '@/lib/learnscategories/create'
import { updateLearnsCategoryById } from '@/lib/learnscategories/updateById'

type Props = {
    mode: 'create' | 'edit'
    initialValues?: LearnCategoryInput
    id?: string // only for edit
}

export function LearnCategoryForm({ mode, initialValues, id }: Props) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LearnCategoryInput>({
        resolver: zodResolver(learnCategorySchema),
        defaultValues: initialValues,
    })

    useEffect(() => {
        if (mode === 'edit' && initialValues) {
            reset(initialValues)
        }
    }, [initialValues, mode, reset])

    const onSubmit = async (values: LearnCategoryInput) => {
        try {
            const formData = new FormData()
            formData.append('name', values.name)

            if (mode === 'create') {
                await createLearnsCategories(formData)
            } else if (mode === 'edit' && id) {
                await updateLearnsCategoryById(id, values)
            }

            router.push('/dashboard/learnscategories')
        } catch (err) {
            console.error('Submit error:', err)
            alert('Gagal memproses data')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    id="name"
                    {...register('name')}
                    className={`mt-1 block w-full border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded p-2`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Submitting...') : mode === 'edit' ? 'Update' : 'Submit'}
            </button>
        </form>
    )
}
